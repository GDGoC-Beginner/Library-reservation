package com.example.LMS.domain.seat.dto;

import com.example.LMS.domain.seat.Seat;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SeatResponse {

    private Long seatId;
    private Long roomId;
    private Integer seatNumber;
    private String isAvailable;

    public static SeatResponse from(Seat seat) {
        return SeatResponse.builder()
                .seatId(seat.getSeatId())
                .roomId(seat.getRoom().getRoomId())
                .seatNumber(seat.getSeatNumber())
                .isAvailable(seat.getIsAvailable())
                .build();
    }
}
