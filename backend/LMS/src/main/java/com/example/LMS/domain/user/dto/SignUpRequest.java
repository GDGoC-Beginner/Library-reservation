package com.example.LMS.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    private String username; // 필수, UNIQUE
    private String email;    // 필수
    private String password; // 필수, 단방향 해시 적용 대상
    private String name;     // 필수
}