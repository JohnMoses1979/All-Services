package com.services.in.controller;

import com.services.in.dto.ApiResponse;
import com.services.in.dto.BookingActionRequest;
import com.services.in.dto.BookingDto;
import com.services.in.dto.CreateBookingRequest;
import com.services.in.service.ServiceBookingService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
public class ServiceBookingController {

    private final ServiceBookingService bookingService;

    public ServiceBookingController(ServiceBookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingDto>> create(@RequestBody CreateBookingRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Booking request sent.", bookingService.create(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingDto>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Booking fetched.", bookingService.get(id)));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getForProvider(@PathVariable Long providerId) {
        return ResponseEntity.ok(ApiResponse.ok("Provider bookings fetched.", bookingService.getForProvider(providerId)));
    }

    @PostMapping("/{id}/details")
    public ResponseEntity<ApiResponse<BookingDto>> updateDetails(
            @PathVariable Long id,
            @RequestBody BookingActionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Booking details updated.", bookingService.updateDetails(id, request)));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<BookingDto>> accept(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Booking accepted.", bookingService.accept(id)));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<BookingDto>> reject(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Booking rejected.", bookingService.reject(id)));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<ApiResponse<BookingDto>> start(
            @PathVariable Long id,
            @RequestBody BookingActionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Work started.", bookingService.start(id, request)));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<BookingDto>> complete(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Work completed.", bookingService.complete(id)));
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<ApiResponse<BookingDto>> pay(
            @PathVariable Long id,
            @RequestBody BookingActionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Payment saved.", bookingService.pay(id, request)));
    }

    @PostMapping("/{id}/rating")
    public ResponseEntity<ApiResponse<BookingDto>> rate(
            @PathVariable Long id,
            @RequestBody BookingActionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Rating saved.", bookingService.rate(id, request)));
    }
}
