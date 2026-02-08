package com.example.LMS.domain.reservation;

import com.example.LMS.domain.history.HistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReservationScheduler {

    private final ReservationRepository reservationRepository;
    private final HistoryRepository historyRepository;

    // 매 1분마다 실행
    @Scheduled(cron = "0 * * * * *")  // 매 분마다
    @Transactional
    public void completeExpiredReservations() {

        LocalDateTime now = LocalDateTime.now();

        // 종료 시간이 지난 ACTIVE 예약 조회
        List<Reservation> expiredReservations = reservationRepository
                .findByStatusAndEndTimeBefore("ACTIVE", now);

        if (expiredReservations.isEmpty()) {
            return;
        }

        log.info("만료된 예약 {} 건 처리 중...", expiredReservations.size());

        for (Reservation reservation : expiredReservations) {
            // 예약 상태를 COMPLETED로 변경
            reservation.complete();

            // 좌석 해제
            reservation.getSeat().release();

            // 이력 상태도 COMPLETED로 변경
            historyRepository.findByReservation_ReservationId(reservation.getReservationId())
                    .ifPresent(history -> history.changeStatus("COMPLETED"));

            log.info("예약 ID {} 완료 처리됨", reservation.getReservationId());
        }
    }
}