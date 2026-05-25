package com.services.in.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.services.in.dto.ApiResponse;
import com.services.in.dto.OwnerNotificationEventDto;
import com.services.in.service.OwnerNotificationStreamService;

@RestController
@RequestMapping("/api/owner/notifications")
public class OwnerNotificationController {

    private final OwnerNotificationStreamService streamService;

    public OwnerNotificationController(OwnerNotificationStreamService streamService) {
        this.streamService = streamService;
    }

    @GetMapping(path = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@RequestParam String mobile) {
        return streamService.subscribe(mobile);
    }

    @PostMapping("/test")
    public ApiResponse<Void> sendTest(
            @RequestParam String mobile,
            @RequestBody OwnerNotificationEventDto event) {
        streamService.publish(mobile, event);
        return ApiResponse.ok("Notification sent.");
    }
}
