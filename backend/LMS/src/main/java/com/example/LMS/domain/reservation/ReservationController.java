package com.example.LMS.domain.reservation;

import com.example.LMS.domain.reservation.dto.ReservationCreateRequest;
import com.example.LMS.domain.reservation.dto.ReservationResponse;
import com.example.LMS.domain.reservation.dto.ReservationCancelResponse;
import com.example.LMS.domain.reservation.dto.ReservationExtendResponse;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    //좌석 예약
    @PostMapping
    public ReservationResponse createReservation(
            @RequestBody ReservationCreateRequest request,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("USER_ID");
        return reservationService.createReservation(userId, request);
    }

    //좌석 예약 취소
    @DeleteMapping("/{reservationId}")
    public ReservationCancelResponse cancelReservation(
            @PathVariable Long reservationId
    ) {
        return reservationService.cancelReservation(reservationId);
    }

    //좌석 예약 연장
    @PatchMapping("/{reservationId}/extend")
    public ReservationExtendResponse extendReservation(
            @PathVariable Long reservationId
    ) {
        return reservationService.extendReservation(reservationId);
    }

    // 내 예약 조회
    @GetMapping("/me")
    public ReservationResponse getMyReservation(
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("USER_ID");
        return reservationService.getCurrentReservation(userId);
    }
}




