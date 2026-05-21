package com.services.in.dto;

 
public class ChatDto {

    public static class ChatRequest {
        private String message;
        private String userId;

        public ChatRequest() {
        }

        public ChatRequest(String message, String userId) {
            this.message = message;
            this.userId = userId;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }
    }

    public static class ChatResponse {
        private boolean success;
        private String reply;

        public ChatResponse() {
        }

        public ChatResponse(boolean success, String reply) {
            this.success = success;
            this.reply = reply;
        }

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getReply() {
            return reply;
        }

        public void setReply(String reply) {
            this.reply = reply;
        }
    }
}
