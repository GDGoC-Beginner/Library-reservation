package com.example.LMS.domain.history;

import com.example.LMS.domain.reservation.Reservation;
import com.example.LMS.domain.seat.Seat;
import com.example.LMS.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "USAGE_HISTORIES")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HISTORY_ID")
    private Long historyId;

    /* 사용자 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    /* 좌석 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SEAT_ID", nullable = false)
    private Seat seat;

    /* 예약 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RESERVATION_ID", nullable = false)
    private Reservation reservation;

    @Column(name = "USE_DATE", nullable = false)
    private LocalDate useDate;

    @Column(name = "STATUS", length = 20, nullable = false)
    private String status;
    // USED, CANCELED, NO_SHOW, COMPLETED

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    /* ===== 상태 변경용 메서드 ===== */
    public void changeStatus(String status) {
        this.status = status;
    }
}