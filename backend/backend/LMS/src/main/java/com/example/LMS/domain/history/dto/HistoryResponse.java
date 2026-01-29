package com.example.LMS.domain.history.dto;

import com.example.LMS.domain.history.History;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class HistoryResponse {

    private Long historyId;
    private Long userId;
    private Long seatId;
    private Long reservationId;
    private LocalDate useDate;
    private String status;
    private LocalDateTime createdAt;

    public static HistoryResponse from(History history) {
        return HistoryResponse.builder()
                .historyId(history.getHistoryId())
                .userId(history.getUser().getUserId())
                .seatId(history.getSeat().getSeatId())
                .reservationId(history.getReservation().getReservationId())
                .useDate(history.getUseDate())
                .status(history.getStatus())
                .createdAt(history.getCreatedAt())
                .build();
    }
}

