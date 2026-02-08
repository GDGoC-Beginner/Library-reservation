package com.example.LMS.scheduler;

import com.example.LMS.domain.history.HistoryService;
import com.example.LMS.domain.reservation.Reservation;
import com.example.LMS.domain.reservation.ReservationRepository;
import com.example.LMS.domain.reservation.ReservationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ReservationScheduler {

    private final ReservationRepository reservationRepository;
    private final HistoryService historyService;

    /**
     * ACTIVE 상태이면서 endTime 지난 예약을 COMPLETED 처리
     */
    @Transactional
    @Scheduled(fixedRate = 60_000) // 1분마다
    public void completeExpiredReservations() {

        LocalDateTime now = LocalDateTime.now();

        List<Reservation> expiredReservations =
                reservationRepository.findByStatusAndEndTimeBefore(
                        ReservationStatus.ACTIVE,
                        now
                );

        for (Reservation reservation : expiredReservations) {
            reservation.complete();
            reservation.getSeat().release();
            historyService.saveFromReservation(reservation);
        }
    }
}
