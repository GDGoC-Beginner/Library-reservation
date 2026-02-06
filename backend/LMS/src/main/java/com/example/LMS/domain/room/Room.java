package com.example.LMS.domain.room;

import com.example.LMS.domain.seat.Seat;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ROOMS") // ERD 기준 스키마 명시
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ROOM_ID")
    private Long roomId;

    @Column(name = "ROOM_NAME", nullable = false, unique = true, length = 50)
    private String roomName;

    @Column(name = "TOTAL_SEATS")
    private Integer totalSeats;

    // 좌석과의 1:N 관계 (선택 사항)
    @OneToMany(mappedBy = "room")
    private final List<Seat> seats = new ArrayList<>();
}