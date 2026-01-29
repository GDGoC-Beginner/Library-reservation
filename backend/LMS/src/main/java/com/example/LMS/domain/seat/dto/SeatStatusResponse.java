package com.example.LMS.domain.seat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SeatStatusResponse {

    private Long seatId;
    private String isAvailable; // Y / N
}
