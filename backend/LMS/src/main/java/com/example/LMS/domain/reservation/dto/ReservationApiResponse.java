package com.example.LMS.domain.reservation.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReservationApiResponse {

    private Long reservationId;
    private Long roomId;
    private String roomName;
    private Long seatId;
    private String seatNumber;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer extendCount;
    private Integer extendLimit;
    private String status;
}
