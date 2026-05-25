package com.services.in.controller;

 
import com.services.in.dto.ChatDto;
import com.services.in.service.SupportChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "*")
public class SupportChatController {

    @Autowired
    private SupportChatService supportChatService;

    @PostMapping("/chat")
    public ResponseEntity<ChatDto.ChatResponse> chat(
            @RequestBody ChatDto.ChatRequest request
    ) {
        String reply = supportChatService.getAiReply(
                request.getMessage(),
                request.getUserId()
        );

        return ResponseEntity.ok(
                new ChatDto.ChatResponse(true, reply)
        );
    }
}
