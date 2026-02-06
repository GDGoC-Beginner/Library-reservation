package com.example.LMS.domain.seat;

import com.example.LMS.domain.room.Room;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "SEATS",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "UQ_ROOM_SEAT",
                        columnNames = {"ROOM_ID", "SEAT_NUMBER"}
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEAT_ID")
    private Long seatId;

    /* 좌석이 속한 열람실 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ROOM_ID", nullable = false)
    private Room room;

    @Column(name = "SEAT_NUMBER", nullable = false)
    private Integer seatNumber;

    @Column(name = "IS_AVAILABLE", length = 1, nullable = false)
    private String isAvailable; // Y / N

    /* ===== 비즈니스 메서드 ===== */
    public void occupy() {
        this.isAvailable = "N";
    }

    public void release() {
        this.isAvailable = "Y";
    }
}

