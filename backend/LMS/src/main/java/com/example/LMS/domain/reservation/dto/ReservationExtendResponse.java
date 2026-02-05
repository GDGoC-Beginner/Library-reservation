package com.example.LMS.domain.reservation.dto;

import com.example.LMS.domain.reservation.Reservation;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReservationExtendResponse {

    private String message;
    private int currentExtension;
    private int maxExtension;
    private boolean isExtendable;
    private LocalDateTime newEndTime;

    public static ReservationExtendResponse from(Reservation reservation) {
        boolean isExtendable =
                reservation.getExtendCount() < reservation.getExtendLimit();

        return ReservationExtendResponse.builder()
                .message(isExtendable
                        ? "연장이 완료되었습니다."
                        : "연장이 완료되었습니다. 이제 더 이상 연장할 수 없습니다.")
                .currentExtension(reservation.getExtendCount())
                .maxExtension(reservation.getExtendLimit())
                .isExtendable(isExtendable)
                .newEndTime(reservation.getEndTime())
                .build();
    }
}
