package com.example.LMS.domain.room.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor // 기본 생성자 추가 (Jackson 라이브러리용)
@AllArgsConstructor // 모든 필드를 포함한 생성자 생성
public class RoomResponse {
    private Long roomId;       // Room 엔티티의 Long과 타입 맞춤
    private String roomName;
    private Integer totalSeats;
    private Integer availableSeats;
    private Integer usedSeats;
}