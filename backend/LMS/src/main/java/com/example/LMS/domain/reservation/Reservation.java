package com.example.LMS.domain.reservation;

import com.example.LMS.domain.user.User;
import com.example.LMS.domain.seat.Seat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "RESERVATIONS")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RESERVATION_ID")
    private Long reservationId;

    /* 예약한 사용자 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    /* 예약한 좌석 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SEAT_ID", nullable = false)
    private Seat seat;

    @Column(name = "START_TIME", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "END_TIME", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "EXTEND_COUNT", nullable = false)
    private Integer extendCount;

    @Column(name = "EXTEND_LIMIT", nullable = false)
    private Integer extendLimit;

    @Column(name = "STATUS", length = 20, nullable = false)
    @Enumerated(EnumType.STRING)
    private ReservationStatus status; // ACTIVE, CANCELED, COMPLETED

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CANCELED_AT")
    private LocalDateTime canceledAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /* ===== 비즈니스 메서드 ===== */

    public void cancel() {
        this.status = ReservationStatus.CANCELED;
        this.canceledAt = LocalDateTime.now();
    }

    public void extend(LocalDateTime newEndTime) {
        if (extendCount >= extendLimit) {
            throw new IllegalStateException("연장 횟수를 초과했습니다.");
        }
        this.endTime = newEndTime;
        this.extendCount++;
    }

    public void complete() {
        this.status = ReservationStatus.COMPLETED;
    }

    public boolean isExpired(LocalDateTime now) {
        return this.endTime.isBefore(now);
    }
}

