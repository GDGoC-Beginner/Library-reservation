package com.example.LMS.domain.reservation;

import com.example.LMS.domain.reservation.dto.*;
import com.example.LMS.domain.user.CustomUserDetails;
import com.example.LMS.domain.user.UserService;
import com.example.LMS.domain.user.dto.UserReservationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final UserService userService;

    // 좌석 예약
    @PostMapping
    public ReservationResponse createReservation(
            @RequestBody ReservationCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        Long userId = userDetails.getUserId();
        return reservationService.createReservation(userId, request);
    }

    // 좌석 예약 취소
    @DeleteMapping("/{reservationId}")
    public ReservationCancelResponse cancelReservation(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        return reservationService.cancelReservation(reservationId);
    }

    // 좌석 예약 연장
    @PatchMapping("/{reservationId}/extend")
    public ReservationExtendResponse extendReservation(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        return reservationService.extendReservation(reservationId);
    }

    // 내 예약 조회
    @GetMapping("/me")
    public UserReservationResponse getMyReservation(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        Long userId = userDetails.getUserId();
        return userService.getMyReservation(userId);
    }

}
