package com.example.LMS.domain.user.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CheckIdResponse {
    private String message;
    private boolean noDuplicate;
}
