package com.example.LMS.config; // 본인의 패키지 경로에 맞게 수정하세요.

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt 암호화 알고리즘을 사용하는 빈을 등록합니다.
        return new BCryptPasswordEncoder();
    }
}