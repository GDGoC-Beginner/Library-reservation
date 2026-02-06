package com.example.LMS.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        //회원가입, 아이디 중복 확인은 인증 없이 접근 가능
                        .anyRequest().authenticated()
                        //나머지는 로그인 필요
                )

//                .formLogin(form -> form
//                        .loginProcessingUrl("/auth/login")
//                        // POST /auth/login 으로 로그인 처리
//
//                        .usernameParameter("username")
//                        .passwordParameter("password")
//
//
//                        .successHandler((request, response, authentication) -> {
//                            //로그인 성공 시
//                            //세션이 자동으로 생성되고 JSESSIONID 쿠키가 반환됨
//                            response.setStatus(200);
//                            response.setContentType("application/json;charset=UTF-8");
//                            response.getWriter().write("{\"message\":\"로그인 성공\"}");
//                        })
//
//                        .failureHandler((request, response, exception) -> {
//                            //로그인 실패 시
//                            response.setStatus(401);
//                            response.setContentType("application/json;charset=UTF-8");
//                            response.getWriter().write("{\"message\":\"로그인 실패: " + exception.getMessage() + "\"}");
//                        })
//
//                        .permitAll()
//                )
                .sessionManagement(session -> session
                                .maximumSessions(1)
                                //동시 세션 1개로 제한 (한 계정으로 중복 로그인 방지)
                                //(-1)로 설정 시 무한 로그인 가능
                                .maxSessionsPreventsLogin(false)
                        //false -> 새 로그인 시 기존 세션 만료
                        //true -> 기존 세션 있으면 새 로그인 차단
                )
                // ✅ 인증 실패 시 JSON 응답 (HTML 페이지 대신)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"message\":\"인증이 필요합니다\"}");
                        })
                )


                .logout(logout -> logout
                        .logoutUrl("/auth/logout")
                        // POST /auth/logout 으로 로그아웃

                        .invalidateHttpSession(true)
                        //로그 아웃 시 세션 무효화
                        .deleteCookies("JSESSIONID")
                        //JSESSIONID 쿠키 삭제
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(200);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"message\":\"로그아웃 성공\"}");
                        })
                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        //비밀번호 암호화
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

}

/*.maximumSessions(1)
// 한 계정당 동시 로그인 세션 개수 제한

.maxSessionsPreventsLogin(false)
// false: 새 로그인 시 기존 세션 강제 종료 (권장)
// true: 기존 세션 있으면 새 로그인 차단

.invalidateHttpSession(true)
// 로그아웃 시 세션 완전히 삭제

.deleteCookies("JSESSIONID")
// 로그아웃 시 세션 ID 쿠키도 삭제
*/