package com.services.in.service;

import com.services.in.dto.BookingActionRequest;
import com.services.in.dto.BookingDto;
import com.services.in.dto.CreateBookingRequest;
import com.services.in.dto.OwnerNotificationEventDto;
import com.services.in.dto.OwnerNotificationSettingsDto;
import com.services.in.entity.OwnerAccount;
import com.services.in.entity.ServiceBooking;
import com.services.in.entity.ServiceProvider;
import com.services.in.exception.ProviderNotFoundException;
import com.services.in.repository.OwnerAccountRepository;
import com.services.in.repository.ServiceBookingRepository;
import com.services.in.repository.ServiceProviderRepository;
import java.time.LocalDateTime;
import java.security.SecureRandom;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceBookingService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final ServiceBookingRepository bookingRepository;
    private final ServiceProviderRepository providerRepository;
    private final OwnerAccountRepository ownerRepository;
    private final OwnerNotificationStreamService notificationStreamService;

    public ServiceBookingService(
            ServiceBookingRepository bookingRepository,
            ServiceProviderRepository providerRepository,
            OwnerAccountRepository ownerRepository,
            OwnerNotificationStreamService notificationStreamService) {
        this.bookingRepository = bookingRepository;
        this.providerRepository = providerRepository;
        this.ownerRepository = ownerRepository;
        this.notificationStreamService = notificationStreamService;
    }

    @Transactional
    public BookingDto create(CreateBookingRequest request) {
        ServiceProvider provider = providerRepository.findById(request.getProviderId())
                .orElseThrow(() -> new ProviderNotFoundException("Worker not found."));

        ServiceBooking booking = ServiceBooking.builder()
                .providerId(provider.getId())
                .providerName(provider.getFullName())
                .serviceName(valueOrDefault(request.getServiceName(), request.getSkill()))
                .skill(request.getSkill())
                .customerName(request.getCustomerName())
                .customerMobile(request.getCustomerMobile())
                .address(request.getAddress())
                .bookingDate(request.getBookingDate())
                .timeSlot(request.getTimeSlot())
                .amount(request.getAmount() == null ? 499 : request.getAmount())
                .status(ServiceBooking.BookingStatus.REQUESTED)
                .build();

        return toDto(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public BookingDto get(Long id) {
        return toDto(findBooking(id));
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getForProvider(Long providerId) {
        return bookingRepository.findByProviderIdOrderByCreatedAtDesc(providerId).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public BookingDto updateDetails(Long id, BookingActionRequest request) {
        ServiceBooking booking = findBooking(id);
        if (booking.getStatus() == ServiceBooking.BookingStatus.STARTED
                || booking.getStatus() == ServiceBooking.BookingStatus.COMPLETED
                || booking.getStatus() == ServiceBooking.BookingStatus.PAID
                || booking.getStatus() == ServiceBooking.BookingStatus.RATED) {
            throw new IllegalArgumentException("Booking details cannot be changed after work starts.");
        }

        if (request.getAddress() != null && !request.getAddress().isBlank()) {
            booking.setAddress(request.getAddress().trim());
        }
        if (request.getBookingDate() != null && !request.getBookingDate().isBlank()) {
            booking.setBookingDate(request.getBookingDate().trim());
        }
        if (request.getTimeSlot() != null && !request.getTimeSlot().isBlank()) {
            booking.setTimeSlot(request.getTimeSlot().trim());
        }

        return toDto(bookingRepository.save(booking));
    }

    @Transactional
    public BookingDto accept(Long id) {
        ServiceBooking booking = findBooking(id);
        booking.setStatus(ServiceBooking.BookingStatus.ACCEPTED);
        booking.setStartOtp(generateOtp());
        ServiceBooking saved = bookingRepository.save(booking);
        notifyOwner(saved, "bookingConfirmations", "Booking accepted",
                saved.getProviderName() + " accepted your " + saved.getServiceName() + " booking.");
        return toDto(saved);
    }

    @Transactional
    public BookingDto reject(Long id) {
        ServiceBooking booking = findBooking(id);
        booking.setStatus(ServiceBooking.BookingStatus.REJECTED);
        ServiceBooking saved = bookingRepository.save(booking);
        notifyOwner(saved, "bookingCancellations", "Booking rejected",
                saved.getProviderName() + " rejected your " + saved.getServiceName() + " booking.");
        return toDto(saved);
    }

    @Transactional
    public BookingDto start(Long id, BookingActionRequest request) {
        ServiceBooking booking = findBooking(id);
        if (booking.getStartOtp() == null || !booking.getStartOtp().equals(request.getOtp())) {
            throw new IllegalArgumentException("Invalid booking OTP.");
        }
        booking.setStatus(ServiceBooking.BookingStatus.STARTED);
        return toDto(bookingRepository.save(booking));
    }

    @Transactional
    public BookingDto complete(Long id) {
        ServiceBooking booking = findBooking(id);
        booking.setStatus(ServiceBooking.BookingStatus.COMPLETED);
        return toDto(bookingRepository.save(booking));
    }

    @Transactional
    public BookingDto pay(Long id, BookingActionRequest request) {
        ServiceBooking booking = findBooking(id);
        booking.setPaymentMethod(valueOrDefault(request.getPaymentMethod(), "Cash"));
        booking.setStatus(ServiceBooking.BookingStatus.PAID);
        ServiceBooking saved = bookingRepository.save(booking);
        notifyOwner(saved, "walletUpdates", "Payment saved",
                "Payment for " + saved.getServiceName() + " was saved using " + saved.getPaymentMethod() + ".");
        return toDto(saved);
    }

    @Transactional
    public BookingDto rate(Long id, BookingActionRequest request) {
        ServiceBooking booking = findBooking(id);
        int rating = Math.max(1, Math.min(5, request.getRating() == null ? 5 : request.getRating()));
        booking.setRating(rating);
        booking.setReview(request.getReview());
        booking.setStatus(ServiceBooking.BookingStatus.RATED);

        providerRepository.findById(booking.getProviderId()).ifPresent(provider -> {
            int oldReviews = provider.getReviews() == null ? 0 : provider.getReviews();
            double oldRating = provider.getRating() == null ? 0.0 : provider.getRating();
            int newReviews = oldReviews + 1;
            double newRating = ((oldRating * oldReviews) + rating) / newReviews;
            provider.setReviews(newReviews);
            provider.setRating(Math.round(newRating * 10.0) / 10.0);
            providerRepository.save(provider);
        });

        ServiceBooking saved = bookingRepository.save(booking);
        notifyOwner(saved, "bookingConfirmations", "Rating saved",
                "Your rating for " + saved.getProviderName() + " was saved.");
        return toDto(saved);
    }

    private ServiceBooking findBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
    }

    private String generateOtp() {
        return String.valueOf(100000 + RANDOM.nextInt(900000));
    }

    private String valueOrDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private void notifyOwner(ServiceBooking booking, String settingKey, String title, String message) {
        if (booking.getCustomerMobile() == null || booking.getCustomerMobile().isBlank()) {
            return;
        }

        ownerRepository.findByMobile(normaliseMobile(booking.getCustomerMobile()))
                .filter(owner -> isNotificationEnabled(owner, settingKey))
                .ifPresent(owner -> notificationStreamService.publish(owner.getMobile(),
                        OwnerNotificationEventDto.builder()
                                .type(settingKey)
                                .title(title)
                                .message(message)
                                .bookingId(booking.getId())
                                .createdAt(LocalDateTime.now())
                                .build()));
    }

    private boolean isNotificationEnabled(OwnerAccount owner, String settingKey) {
        OwnerNotificationSettingsDto settings = OwnerNotificationSettingsDto.from(owner);
        return switch (settingKey) {
            case "bookingConfirmations" -> Boolean.TRUE.equals(settings.getBookingConfirmations());
            case "bookingReminders" -> Boolean.TRUE.equals(settings.getBookingReminders());
            case "bookingCancellations" -> Boolean.TRUE.equals(settings.getBookingCancellations());
            case "offersDiscounts" -> Boolean.TRUE.equals(settings.getOffersDiscounts());
            case "newServices" -> Boolean.TRUE.equals(settings.getNewServices());
            case "walletUpdates" -> Boolean.TRUE.equals(settings.getWalletUpdates());
            case "referEarnUpdates" -> Boolean.TRUE.equals(settings.getReferEarnUpdates());
            default -> true;
        };
    }

    private String normaliseMobile(String mobile) {
        return mobile.replaceAll("\\s+", "").replaceFirst("^\\+91", "");
    }

    private BookingDto toDto(ServiceBooking booking) {
        return BookingDto.builder()
                .id(booking.getId())
                .providerId(booking.getProviderId())
                .providerName(booking.getProviderName())
                .serviceName(booking.getServiceName())
                .skill(booking.getSkill())
                .customerName(booking.getCustomerName())
                .customerMobile(booking.getCustomerMobile())
                .address(booking.getAddress())
                .bookingDate(booking.getBookingDate())
                .timeSlot(booking.getTimeSlot())
                .amount(booking.getAmount())
                .status(booking.getStatus().name())
                .startOtp(booking.getStartOtp())
                .paymentMethod(booking.getPaymentMethod())
                .rating(booking.getRating())
                .review(booking.getReview())
                .build();
    }
}
