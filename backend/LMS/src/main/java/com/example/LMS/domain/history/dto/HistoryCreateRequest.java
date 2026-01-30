package com.example.LMS.domain.history.dto;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class HistoryCreateRequest {

    private Long reservationId;
    private LocalDate useDate;
    private String status;
}
