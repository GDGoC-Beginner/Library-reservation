package com.example.LMS.domain.reservation.dto;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ReservationExtendRequest {

    private LocalDateTime newEndTime;
}

