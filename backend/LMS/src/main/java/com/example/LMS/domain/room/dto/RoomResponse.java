package com.example.LMS.domain.room.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RoomResponse {
    private Integer roomId;
    private String roomName;
    private Integer totalSeats;
    private Integer availableSeats; // 실시간 계산 필요
    private Integer usedSeats;      // 실시간 계산 필요
}