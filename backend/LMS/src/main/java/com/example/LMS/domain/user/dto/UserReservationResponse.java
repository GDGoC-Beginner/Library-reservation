package com.example.LMS.domain.user.dto;

import com.example.LMS.domain.reservation.dto.ReservationResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserReservationResponse {

    private Long userId;
    private String name;
    private ReservationResponse currentReservation;
}
