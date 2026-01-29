package com.example.LMS.domain.room;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Entity
@Table(name = "ROOMS", schema = "SCOTT") // ERD 기준 스키마 명시
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "room_seq_gen")
    @SequenceGenerator(name = "room_seq_gen", sequenceName = "ROOM_SEQ", allocationSize = 1)
    @Column(name = "ROOM_ID")
    private Integer roomId;

    @Column(name = "ROOM_NAME", nullable = false, unique = true, length = 50)
    private String roomName;

    @Column(name = "TOTAL_SEATS")
    private Integer totalSeats;

    // 좌석과의 1:N 관계 (선택 사항)
    @OneToMany(mappedBy = "room")
    private List<Seat> seats = new ArrayList<>();
}