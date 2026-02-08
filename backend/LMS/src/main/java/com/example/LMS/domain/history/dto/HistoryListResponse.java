package com.example.LMS.domain.history.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class HistoryListResponse {

    private List<HistoryResponse> items;

    public static HistoryListResponse from(List<HistoryResponse> items) {
        return HistoryListResponse.builder()
                .items(items)
                .build();
    }
}