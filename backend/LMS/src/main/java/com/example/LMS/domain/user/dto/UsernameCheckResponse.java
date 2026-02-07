package com.example.LMS.domain.user.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UsernameCheckResponse {
    private boolean isAvailable;
    private String message;
}