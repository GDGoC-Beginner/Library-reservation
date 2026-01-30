package com.example.LMS.domain.reservation.dto;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ReservationCreateRequest {

    private Long seatId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
