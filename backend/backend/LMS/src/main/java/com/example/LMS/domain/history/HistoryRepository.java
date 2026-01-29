package com.example.LMS.domain.history;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {

    /* 사용자별 이용 이력 */
    List<History> findByUser_UserId(Long userId);

    /* 특정 날짜 사용자 이력 */
    List<History> findByUser_UserIdAndUseDate(Long userId, LocalDate useDate);

    /* 좌석별 이력 */
    List<History> findBySeat_SeatId(Long seatId);
}