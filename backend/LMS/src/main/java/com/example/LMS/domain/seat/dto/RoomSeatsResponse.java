package com.example.LMS.domain.seat.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class RoomSeatsResponse {

    private String message;
    private Long roomId;
    private String roomName;
    private List<SeatResponse> seats;
}

