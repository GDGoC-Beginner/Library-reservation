package com.example.LMS.domain.reservation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    /* 사용자별 예약 목록 */
    List<Reservation> findByUser_UserId(Long userId);

    /* 좌석의 현재 활성 예약 */
    Optional<Reservation> findBySeat_SeatIdAndStatus(Long seatId, String status);

    /* 특정 시간대에 겹치는 예약 조회 (중복 예약 방지) */
    boolean existsBySeat_SeatIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
            Long seatId,
            String status,
            LocalDateTime endTime,
            LocalDateTime startTime
    );
}
