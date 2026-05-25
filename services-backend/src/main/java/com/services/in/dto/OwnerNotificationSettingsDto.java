package com.services.in.dto;

import com.services.in.entity.OwnerAccount;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerNotificationSettingsDto {

    private Boolean bookingConfirmations;
    private Boolean bookingReminders;
    private Boolean bookingCancellations;
    private Boolean offersDiscounts;
    private Boolean newServices;
    private Boolean walletUpdates;
    private Boolean referEarnUpdates;

    public static OwnerNotificationSettingsDto defaults() {
        return OwnerNotificationSettingsDto.builder()
                .bookingConfirmations(true)
                .bookingReminders(true)
                .bookingCancellations(true)
                .offersDiscounts(true)
                .newServices(false)
                .walletUpdates(true)
                .referEarnUpdates(true)
                .build();
    }

    public static OwnerNotificationSettingsDto from(OwnerAccount owner) {
        OwnerNotificationSettingsDto defaults = defaults();
        return OwnerNotificationSettingsDto.builder()
                .bookingConfirmations(valueOrDefault(owner.getNotifyBookingConfirmations(), defaults.getBookingConfirmations()))
                .bookingReminders(valueOrDefault(owner.getNotifyBookingReminders(), defaults.getBookingReminders()))
                .bookingCancellations(valueOrDefault(owner.getNotifyBookingCancellations(), defaults.getBookingCancellations()))
                .offersDiscounts(valueOrDefault(owner.getNotifyOffersDiscounts(), defaults.getOffersDiscounts()))
                .newServices(valueOrDefault(owner.getNotifyNewServices(), defaults.getNewServices()))
                .walletUpdates(valueOrDefault(owner.getNotifyWalletUpdates(), defaults.getWalletUpdates()))
                .referEarnUpdates(valueOrDefault(owner.getNotifyReferEarnUpdates(), defaults.getReferEarnUpdates()))
                .build();
    }

    private static Boolean valueOrDefault(Boolean value, Boolean fallback) {
        return value == null ? fallback : value;
    }
}
