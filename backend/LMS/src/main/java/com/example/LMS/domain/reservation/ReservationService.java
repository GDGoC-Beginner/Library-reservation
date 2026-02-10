package com.example.LMS.domain.reservation;

import com.example.LMS.domain.history.History;
import com.example.LMS.domain.history.HistoryRepository;
import com.example.LMS.domain.reservation.dto.ReservationCancelResponse;
import com.example.LMS.domain.reservation.dto.ReservationCreateRequest;
import com.example.LMS.domain.reservation.dto.ReservationExtendResponse;
import com.example.LMS.domain.reservation.dto.ReservationResponse;
import com.example.LMS.domain.seat.Seat;
import com.example.LMS.domain.seat.SeatRepository;
import com.example.LMS.domain.user.User;
import com.example.LMS.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final UserRepository userRepository;
    private final SeatRepository seatRepository;
    private final ReservationRepository reservationRepository;
    private final HistoryRepository historyRepository;


    // 좌석 예약
    @Transactional
    public ReservationResponse createReservation(Long userId, ReservationCreateRequest request) {

        // 1. 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2. 좌석 조회
        Seat seat = seatRepository.findById(request.getSeatId())
                .orElseThrow(() -> new IllegalArgumentException("좌석을 찾을 수 없습니다."));

        // 3. 1인 1좌석 검증 (중복 예약 방지)
        // 현재 사용자가 'ACTIVE' 상태인 예약을 이미 가지고 있는 확인합니다.
        boolean hasActiveReservation = reservationRepository.existsByUserAndStatus(user, "ACTIVE");
        if (hasActiveReservation) {
            throw new IllegalStateException("이미 이용 중인 좌석이 있습니다. 1인당 1개의 좌석만 예약 가능합니다.");
        }

        // 4. 좌석 사용 가능 여부 확인
        if ("N".equals(seat.getIsAvailable())) {
            throw new IllegalStateException("이미 사용 중인 좌석입니다.");
        }

        // 4. 시간 계산
        LocalDateTime startTime = LocalDateTime.now();
        LocalDateTime endTime = startTime.plusHours(6);

        // 5. 좌석 점유
        seat.occupy();

        // 6. 예약 생성
        Reservation reservation = Reservation.builder()
                .user(user)
                .seat(seat)
                .startTime(startTime)
                .endTime(endTime)
                .extendCount(0)
                .extendLimit(1)
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build();

        reservationRepository.save(reservation);
        createUsageHistory(reservation);
        // 7. 응답 DTO 반환
        return ReservationResponse.from(reservation);
    }

    // 예약 취소
    @Transactional
    public ReservationCancelResponse cancelReservation(Long reservationId) {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

        if ("CANCELED".equals(reservation.getStatus())) {
            throw new IllegalStateException("이미 취소된 예약입니다.");
        }

        reservation.cancel();
        reservation.getSeat().release();

        //이력 상태를 CANCLED로 업데이트
        updateHistoryStatus(reservation, "CANCELED");
        return ReservationCancelResponse.from(reservation);
    }

    // 3. 시간 종료 → 기존 이력의 상태를 COMPLETED로 변경



    // 예약 연장
    @Transactional
    public ReservationExtendResponse extendReservation(Long reservationId) {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

        LocalDateTime newEndTime = reservation.getEndTime().plusHours(6);
        reservation.extend(newEndTime);

        return ReservationExtendResponse.from(reservation);
    }

    //내 예약 조회
    public ReservationResponse getCurrentReservation(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("사용자 ID가 없습니다.");
        }

        Reservation reservation = reservationRepository
                .findByUserIdAndStatusWithSeatAndRoom(userId, "ACTIVE")
                .orElse(null);

        if (reservation == null) {
            return null;
        }

        return ReservationResponse.from(reservation);
    }

    // 사용 이력 생성 (private 메서드)
    private void createUsageHistory(Reservation reservation) {
        History history = History.builder()
                .user(reservation.getUser())
                .seat(reservation.getSeat())
                .reservation(reservation)
                .useDate(LocalDate.now())
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build();
        historyRepository.save(history);
    }

    // 이력 상태 업데이트 (private 메서드)
    private void updateHistoryStatus(Reservation reservation, String newStatus) {
        historyRepository.findByReservation_ReservationId(reservation.getReservationId())
                .ifPresent(history -> history.changeStatus(newStatus));
    }
}
