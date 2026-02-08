package com.example.LMS.domain.reservation.dto;

import com.example.LMS.domain.reservation.Reservation;
import com.example.LMS.domain.reservation.ReservationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReservationCancelResponse {

    private Long reservationId;
    private ReservationStatus status;
    private LocalDateTime canceledAt;
    private String message;

    public static ReservationCancelResponse from(Reservation reservation) {
        return ReservationCancelResponse.builder()
                .reservationId(reservation.getReservationId())
                .status(ReservationStatus.CANCELED)
                .canceledAt(LocalDateTime.now())
                .message("예약이 취소되었습니다.")
                .build();
    }
}
