package com.example.LMS.domain.reservation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUser_UserId(Long userId);

    Optional<Reservation> findBySeat_SeatIdAndStatus(Long seatId, String status);

    Optional<Reservation> findByUser_UserIdAndStatus(Long userId, String status);

    boolean existsBySeat_SeatIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
            Long seatId,
            String status,
            LocalDateTime endTime,
            LocalDateTime startTime
    );

    List<Reservation> findByStatusAndEndTimeBefore(String active, LocalDateTime now);

}

