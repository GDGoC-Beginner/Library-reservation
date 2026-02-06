package com.example.LMS.domain.user;

import com.example.LMS.domain.user.dto.CheckIdResponse;
import com.example.LMS.domain.user.dto.LoginRequest;
import com.example.LMS.domain.user.dto.SignUpRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth") // 인증 + 유저 관련
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    // 아이디 중복 체크
    @GetMapping("/check")  // POST → GET으로 변경 (조회 작업이므로)
    public ResponseEntity<CheckIdResponse> checkUsername(@RequestParam String username) {
        CheckIdResponse response = userService.checkUsername(username);
        return ResponseEntity.ok(response);
    }

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequest request) {
        try {
            userService.signUp(request);
            return ResponseEntity.status(201)
                    .body("회원가입 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpServletRequest) {
        try {
            // 1. 인증 토큰 생성
            UsernamePasswordAuthenticationToken token =
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());

            // 2. 인증 매니저를 통해 검증 (이때 UserService.loadUserByUsername이 호출됨)
            Authentication authentication = authenticationManager.authenticate(token);

            // 3. 인증 정보를 세션에 저장 (중요: 이 코드가 있어야 로그인이 유지됨)
            SecurityContextHolder.getContext().setAuthentication(authentication);
            HttpSession session = httpServletRequest.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());

            return ResponseEntity.ok(Map.of("message", "로그인 성공"));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인 실패: " + e.getMessage()));
        }
    }
    // 로그인

//    @PostMapping("/login")
//    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
//        // AuthenticationManager를 통해 인증 시도
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
//        );
//
//        // 인증 성공 시 SecurityContext에 저장하거나 JWT 토큰 발급 로직 진행
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        return ResponseEntity.ok("로그인 성공!");
//    }
}
