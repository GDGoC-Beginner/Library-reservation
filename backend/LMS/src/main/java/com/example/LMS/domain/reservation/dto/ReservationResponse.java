package com.example.LMS.domain.reservation.dto;

import com.example.LMS.domain.reservation.Reservation;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReservationResponse {

    private Long reservationId;
    private Long seatId;
    private Long userId;
    private String status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer extendCount;
    private Integer extendLimit;

    public static ReservationResponse from(Reservation reservation) {
        return ReservationResponse.builder()
                .reservationId(reservation.getReservationId())
                .seatId(reservation.getSeat().getSeatId())
                .userId(reservation.getUser().getUserid())
                .status(reservation.getStatus())
                .startTime(reservation.getStartTime())
                .endTime(reservation.getEndTime())
                .extendCount(reservation.getExtendCount())
                .extendLimit(reservation.getExtendLimit())
                .build();
    }
}
