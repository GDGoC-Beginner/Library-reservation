package com.example.LMS.domain.reservation;

import com.example.LMS.domain.reservation.dto.ReservationCreateRequest;
import com.example.LMS.domain.reservation.dto.ReservationResponse;
import com.example.LMS.domain.seat.Seat;
import com.example.LMS.domain.seat.SeatRepository;
import com.example.LMS.domain.user.User;
import com.example.LMS.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final UserRepository userRepository;
    private final SeatRepository seatRepository;
    private final ReservationRepository reservationRepository;

    // 좌석 예약
    @Transactional
    public ReservationResponse createReservation(Long userId, ReservationCreateRequest request) {

        // 1. 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2. 좌석 조회
        Seat seat = seatRepository.findById(request.getSeatId())
                .orElseThrow(() -> new IllegalArgumentException("좌석을 찾을 수 없습니다."));

        // 3. 좌석 사용 가능 여부 확인
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

        // 7. 응답 DTO 반환
        return ReservationResponse.from(reservation);
    }

    // 예약 취소
    @Transactional
    public void cancelReservation(Long reservationId) {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

        // 예약 취소
        reservation.cancel();

        // 좌석 해제
        reservation.getSeat().release();
    }

    // 예약 연장
    @Transactional
    public void extendReservation(Long reservationId) {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

        LocalDateTime newEndTime = reservation.getEndTime().plusHours(6);

        reservation.extend(newEndTime);
    }
}
