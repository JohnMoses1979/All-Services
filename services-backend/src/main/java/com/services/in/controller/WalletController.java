package com.services.in.controller;

 
import com.services.in.dto.AddMoneyRequest;
import com.services.in.dto.SendMoneyRequest;
import com.services.in.dto.VerifyPaymentRequest;
import com.services.in.entity.Wallet;
import com.services.in.entity.WalletTransaction;
import com.services.in.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
@CrossOrigin("*")
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/{mobileNumber}")
    public Wallet getWallet(@PathVariable String mobileNumber) {
        return walletService.getOrCreateWallet(mobileNumber);
    }

    @PostMapping("/add-money/order")
    public Map<String, Object> createAddMoneyOrder(@RequestBody AddMoneyRequest request) throws Exception {
        return walletService.createAddMoneyOrder(request);
    }

    @PostMapping("/add-money/verify")
    public Wallet verifyAddMoney(@RequestBody VerifyPaymentRequest request) {
        return walletService.verifyPaymentAndCredit(request);
    }

    @PostMapping("/send-money")
    public Wallet sendMoney(@RequestBody SendMoneyRequest request) {
        return walletService.sendMoney(request);
    }

    @GetMapping("/transactions/{mobileNumber}")
    public List<WalletTransaction> transactions(@PathVariable String mobileNumber) {
        return walletService.getTransactions(mobileNumber);
    }
}
