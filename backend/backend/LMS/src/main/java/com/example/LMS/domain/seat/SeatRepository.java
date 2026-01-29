package com.example.LMS.domain.seat;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    /* 열람실별 좌석 목록 */
    List<Seat> findByRoom_RoomId(Long roomId);

    /* 특정 열람실의 특정 좌석 */
    Optional<Seat> findByRoom_RoomIdAndSeatNumber(Long roomId, Integer seatNumber);

    /* 사용 가능한 좌석만 조회 */
    List<Seat> findByRoom_RoomIdAndIsAvailable(Long roomId, String isAvailable);
}
