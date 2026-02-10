package com.example.LMS.domain.reservation.dto;

import com.example.LMS.domain.reservation.Reservation;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReservationResponse {

    private Long reservationId;
    private Long seatId;
    private Long userId;
    private Long roomId;
    private Integer seatNumber;
    private String roomName;
    private String status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer extendCount;
    private Integer extendLimit;

    public static ReservationResponse from(Reservation reservation) {
        return ReservationResponse.builder()
                .reservationId(reservation.getReservationId())
                .seatId(reservation.getSeat().getSeatId())
                .seatNumber(reservation.getSeat().getSeatNumber())
                .roomId(reservation.getSeat().getRoom().getRoomId())
                .roomName(reservation.getSeat().getRoom().getRoomName())
                .userId(reservation.getUser().getUserId())
                .status(reservation.getStatus())
                .startTime(reservation.getStartTime())
                .endTime(reservation.getEndTime())
                .extendCount(reservation.getExtendCount())
                .extendLimit(reservation.getExtendLimit())
                .build();
    }
}
