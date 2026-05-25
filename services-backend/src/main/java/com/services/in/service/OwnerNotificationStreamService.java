package com.services.in.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.services.in.dto.OwnerNotificationEventDto;

@Service
public class OwnerNotificationStreamService {

    private static final long STREAM_TIMEOUT_MS = 30 * 60 * 1000L;

    private final Map<String, List<SseEmitter>> ownerStreams = new ConcurrentHashMap<>();

    public SseEmitter subscribe(String mobile) {
        String ownerMobile = normaliseMobile(mobile);
        SseEmitter emitter = new SseEmitter(STREAM_TIMEOUT_MS);
        ownerStreams.computeIfAbsent(ownerMobile, key -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> remove(ownerMobile, emitter));
        emitter.onTimeout(() -> remove(ownerMobile, emitter));
        emitter.onError(error -> remove(ownerMobile, emitter));

        sendToEmitter(emitter, "connected", OwnerNotificationEventDto.builder()
                .type("CONNECTED")
                .title("Notifications connected")
                .message("Real-time notifications are active.")
                .createdAt(LocalDateTime.now())
                .build());

        return emitter;
    }

    public void publish(String mobile, OwnerNotificationEventDto event) {
        String ownerMobile = normaliseMobile(mobile);
        List<SseEmitter> emitters = ownerStreams.get(ownerMobile);
        if (emitters == null || emitters.isEmpty()) {
            return;
        }

        OwnerNotificationEventDto payload = event.getCreatedAt() == null
                ? OwnerNotificationEventDto.builder()
                        .type(event.getType())
                        .title(event.getTitle())
                        .message(event.getMessage())
                        .bookingId(event.getBookingId())
                        .createdAt(LocalDateTime.now())
                        .build()
                : event;

        for (SseEmitter emitter : emitters) {
            sendToEmitter(emitter, "notification", payload);
        }
    }

    private void sendToEmitter(SseEmitter emitter, String eventName, OwnerNotificationEventDto payload) {
        try {
            emitter.send(SseEmitter.event().name(eventName).data(payload));
        } catch (IOException | IllegalStateException ex) {
            emitter.completeWithError(ex);
        }
    }

    private void remove(String mobile, SseEmitter emitter) {
        List<SseEmitter> emitters = ownerStreams.get(mobile);
        if (emitters != null) {
            emitters.remove(emitter);
        }
    }

    private String normaliseMobile(String mobile) {
        if (mobile == null) {
            return "";
        }
        return mobile.replaceAll("\\s+", "").replaceFirst("^\\+91", "");
    }
}
