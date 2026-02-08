package com.example.LMS.domain.reservation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // 유저의 모든 예약 (히스토리용)
    List<Reservation> findByUser_UserId(Long userId);

    List<Reservation> findByStatusAndEndTimeBefore(
            ReservationStatus status,
            LocalDateTime time
    );


    // 유저의 현재 활성 예약 (한 명당 하나만 허용)
    Optional<Reservation> findByUser_UserIdAndStatus(
            Long userId,
            ReservationStatus status
    );

    // 특정 좌석의 활성 예약
    Optional<Reservation> findBySeat_SeatIdAndStatus(
            Long seatId,
            ReservationStatus status
    );

    boolean existsBySeat_SeatIdAndStatus(
            Long seatId,
            ReservationStatus status
    );

    // 해당 좌석에 겹치는 ACTIVE 예약이 존재하는지
    boolean existsBySeat_SeatIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
            Long seatId,
            ReservationStatus status,
            LocalDateTime endTime,
            LocalDateTime startTime
    );
}
