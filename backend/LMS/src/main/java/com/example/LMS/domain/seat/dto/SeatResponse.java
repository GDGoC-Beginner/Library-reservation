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
    private Boolean isAvailable;

    public static SeatResponse from(Seat seat) {
        return SeatResponse.builder()
                .seatId(seat.getSeatId())
                .roomId(seat.getRoom().getRoomId())
                .seatNumber(seat.getSeatNumber())
                .isAvailable("Y".equals(seat.getIsAvailable()))
                .build();
    }

}
