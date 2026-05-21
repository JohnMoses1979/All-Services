package com.services.in.service;

 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class SupportChatService {

    private final WebClient webClient;

    @Value("${groq.model}")
    private String model;

    public SupportChatService(@Value("${groq.api-key}") String apiKey) {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.groq.com/openai/v1")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public String getAiReply(String userMessage, String userId) {
        try {
            if (userMessage == null || userMessage.trim().isEmpty()) {
                return "Please type your question.";
            }

String systemPrompt =
        "You are a helpful AI support assistant inside a services booking mobile app. " +
        "Your job is to answer both app-related questions and normal general questions. " +

        "About this app: It is a services booking app where users can browse services, book a service, select date and time, add service address, make payment, track bookings, cancel bookings, check refund status, manage wallet, update profile, use referral rewards, and contact support. " +

        "For app-related questions, answer as if you are helping the user use this app. " +
        "If the user asks how to book a service, explain: open All Services, choose a service, select date and time, add address, review details, make payment, and confirm booking. " +
        "If the user asks about payment or wallet, explain: open My Wallet or payment history, check balance and transactions, and retry or contact support if payment failed. " +
        "If the user asks about cancellation or refund, explain: open My Bookings, select the booking, tap cancel if allowed, choose reason, and check refund status in wallet or payment history. " +
        "If the user asks about profile, explain: open My Profile, go to Personal Information, edit details, and save changes. " +
        "If the user asks about tracking, explain: open My Bookings, select the booking, and tap Track Booking or view status. " +
        "If the user asks about refer and earn, explain: open Refer & Earn from profile, share referral code, and rewards will be added after eligible referral activity. " +
        "If the user asks how to contact support, mention call support, WhatsApp, email, or live chat from the Contact Us screen. " +

        "Important: If the user asks for private account data, exact booking status, payment status, refund status, wallet balance, profile data, or order-specific information, do not invent details. Say that backend account lookup is required and guide them to the correct app section. " +

        "For general questions, answer directly and naturally. " +
        "Always try to understand spelling mistakes, short words, and casual language. " +
        "Do not say you need more context unless the question is truly impossible to answer. " +
        "Do not list topics or give a menu of abilities. " +
        "Do not repeatedly ask what the user wants to know. " +
        "If information may be current or uncertain, say it may need verification, then still give a useful general answer. " +

        "Keep answers short, clear, friendly, and mobile-friendly. " +
        "Use simple language. " +
        "For health questions, give general information only and suggest consulting a qualified doctor for serious symptoms, diagnosis, or treatment.";

            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of(
                                    "role", "system",
                                    "content", systemPrompt
                            ),
                            Map.of(
                                    "role", "user",
                                    "content", "User ID: " + userId + "\nUser message: " + userMessage
                            )
                    ),
                    "temperature", 0.7,
                    "max_tokens", 700
            );

            Map response = webClient.post()
                    .uri("/chat/completions")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            return extractGroqText(response);

        } catch (Exception e) {
            e.printStackTrace();

            String error = e.getMessage();
            if (error == null) {
                error = e.toString();
            }

            if (error.contains("429") || error.contains("Too Many Requests")) {
                return "AI limit reached. Please try again after some time.";
            }

            if (error.contains("401") || error.contains("Unauthorized")) {
                return "Groq API key is invalid. Please check backend configuration.";
            }

            if (error.contains("403") || error.contains("Forbidden")) {
                return "Groq AI access is blocked. Please check API permissions or quota.";
            }

            if (error.contains("404") || error.contains("Not Found")) {
                return "Groq model name is wrong or not available. Please check groq.model in application.properties.";
            }

            return getFallbackReply(userMessage);
        }
    }

    private String extractGroqText(Map response) {
        if (response == null) {
            return "Sorry, I could not get a response right now.";
        }

        Object choicesObj = response.get("choices");

        if (!(choicesObj instanceof List<?> choices)) {
            return "Sorry, I could not understand the AI response.";
        }

        if (choices.isEmpty()) {
            return "Sorry, I did not receive any AI response.";
        }

        Object firstChoice = choices.get(0);

        if (!(firstChoice instanceof Map<?, ?> choiceMap)) {
            return "Sorry, invalid AI response format.";
        }

        Object messageObj = choiceMap.get("message");

        if (!(messageObj instanceof Map<?, ?> messageMap)) {
            return "Sorry, AI response message is missing.";
        }

        Object contentObj = messageMap.get("content");

        if (contentObj == null) {
            return "Sorry, AI response text is missing.";
        }

        String finalReply = contentObj.toString().trim();

        if (finalReply.isEmpty()) {
            return "Sorry, I could not generate a reply right now.";
        }

        return finalReply;
    }

    private String getFallbackReply(String message) {
        if (message == null) {
            return "Please type your question.";
        }

        String lower = message.toLowerCase();

        if (lower.equals("hi") || lower.equals("hii") || lower.equals("hello") || lower.equals("hey")) {
            return "Hi! How can I help you today?";
        }

        if (lower.contains("book") || lower.contains("booking")) {
            return "To book a service, open All Services, select your service, choose date and time, add your address, and confirm the booking.";
        }

        if (lower.contains("payment") || lower.contains("wallet")) {
            return "For payment or wallet issues, open My Wallet and check your latest transactions.";
        }

        if (lower.contains("refund") || lower.contains("cancel")) {
            return "For cancellation or refund status, open My Bookings and check the booking details.";
        }

        if (lower.contains("profile")) {
            return "To update your profile, open My Profile and tap Personal Information.";
        }

        if (lower.contains("track")) {
            return "To track your booking, open My Bookings and select Track Booking.";
        }

        return "AI is not connected right now. Please try again later.";
    }
}
