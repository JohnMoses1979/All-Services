package com.services.in.controller;

import java.util.HashMap;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin("*")
public class PaymentController {

    private final String KEY_ID = "rzp_test_SlBQXlGgog4aYP";
    private final String KEY_SECRET = "Rsatp3mNJAbCa1T7D0qiYfgv";

    @PostMapping("/create-order")
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> data) throws Exception {
        int amount = ((Number) data.get("amount")).intValue();

        RazorpayClient razorpay = new RazorpayClient(KEY_ID, KEY_SECRET);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());

        Order order = razorpay.orders.create(orderRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("keyId", KEY_ID);
        response.put("id", order.get("id"));
        response.put("orderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));
        return response;
    }

    @PostMapping("/verify")
    public Map<String, Object> verifyPayment(@RequestBody Map<String, String> data) throws Exception {
        String orderId = data.get("razorpay_order_id");
        String paymentId = data.get("razorpay_payment_id");
        String signature = data.get("razorpay_signature");

        String payload = orderId + "|" + paymentId;

        String generatedSignature = hmacSHA256(payload, KEY_SECRET);

        boolean success = generatedSignature.equals(signature);

        return Map.of(
                "success", success,
                "message", success ? "Payment verified successfully" : "Payment verification failed"
        );
    }

    private String hmacSHA256(String data, String secret) throws Exception {
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        sha256Hmac.init(secretKey);

        byte[] hash = sha256Hmac.doFinal(data.getBytes());

        StringBuilder result = new StringBuilder();
        for (byte b : hash) {
            result.append(String.format("%02x", b));
        }

        return result.toString();
    }
}
