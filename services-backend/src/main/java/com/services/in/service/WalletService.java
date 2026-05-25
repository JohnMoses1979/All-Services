package com.services.in.service;

 
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.services.in.dto.AddMoneyRequest;
import com.services.in.dto.SendMoneyRequest;
import com.services.in.dto.VerifyPaymentRequest;
import com.services.in.entity.Wallet;
import com.services.in.entity.WalletTransaction;
import com.services.in.repository.WalletRepository;
import com.services.in.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;

    @Value("${razorpay.key_id:rzp_test_placeholder}")
    private String razorpayKeyId;

    @Value("${razorpay.key_secret:placeholder_secret}")
    private String razorpayKeySecret;

    public Wallet getOrCreateWallet(String mobileNumber) {
        return walletRepository.findByMobileNumber(mobileNumber)
                .orElseGet(() -> {
                    Wallet wallet = new Wallet();
                    wallet.setMobileNumber(mobileNumber);
                    wallet.setBalance(BigDecimal.ZERO);
                    return walletRepository.save(wallet);
                });
    }

    public Map<String, Object> createAddMoneyOrder(AddMoneyRequest request) throws Exception {
        getOrCreateWallet(request.getMobileNumber());

        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        int amountInPaise = request.getAmount()
                .multiply(BigDecimal.valueOf(100))
                .intValue();

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "wallet_" + System.currentTimeMillis());

        Order order = razorpay.orders.create(orderRequest);

        WalletTransaction tx = WalletTransaction.builder()
                .mobileNumber(request.getMobileNumber())
                .title("Add Money")
                .amount(request.getAmount())
                .type("CREDIT")
                .status("PENDING")
                .paymentProvider("RAZORPAY")
                .providerOrderId(order.get("id"))
                .createdAt(LocalDateTime.now())
                .build();

        transactionRepository.save(tx);

        return Map.of(
                "keyId", razorpayKeyId,
                "orderId", order.get("id"),
                "amount", amountInPaise,
                "currency", "INR"
        );
    }

    public Wallet verifyPaymentAndCredit(VerifyPaymentRequest request) {
        WalletTransaction tx = transactionRepository
                .findAll()
                .stream()
                .filter(t -> request.getRazorpayOrderId().equals(t.getProviderOrderId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if ("SUCCESS".equals(tx.getStatus())) {
            return getOrCreateWallet(request.getMobileNumber());
        }

        Wallet wallet = getOrCreateWallet(request.getMobileNumber());
        wallet.setBalance(wallet.getBalance().add(tx.getAmount()));
        walletRepository.save(wallet);

        tx.setStatus("SUCCESS");
        tx.setProviderPaymentId(request.getRazorpayPaymentId());
        transactionRepository.save(tx);

        return wallet;
    }

    public Wallet sendMoney(SendMoneyRequest request) {
        Wallet sender = getOrCreateWallet(request.getSenderMobileNumber());
        Wallet receiver = getOrCreateWallet(request.getReceiverMobileNumber());

        if (sender.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient wallet balance");
        }

        sender.setBalance(sender.getBalance().subtract(request.getAmount()));
        receiver.setBalance(receiver.getBalance().add(request.getAmount()));

        walletRepository.save(sender);
        walletRepository.save(receiver);

        transactionRepository.save(WalletTransaction.builder()
                .mobileNumber(request.getSenderMobileNumber())
                .receiverMobileNumber(request.getReceiverMobileNumber())
                .title("Sent to " + request.getReceiverMobileNumber())
                .amount(request.getAmount())
                .type("DEBIT")
                .status("SUCCESS")
                .paymentProvider("WALLET")
                .createdAt(LocalDateTime.now())
                .build());

        transactionRepository.save(WalletTransaction.builder()
                .mobileNumber(request.getReceiverMobileNumber())
                .receiverMobileNumber(request.getSenderMobileNumber())
                .title("Received from " + request.getSenderMobileNumber())
                .amount(request.getAmount())
                .type("CREDIT")
                .status("SUCCESS")
                .paymentProvider("WALLET")
                .createdAt(LocalDateTime.now())
                .build());

        return sender;
    }

    public List<WalletTransaction> getTransactions(String mobileNumber) {
        return transactionRepository.findByMobileNumberOrderByCreatedAtDesc(mobileNumber);
    }
}
