package com.example.LMS.domain.user;

import com.example.LMS.domain.user.User;
import com.example.LMS.domain.user.dto.CheckIdResponse;
import com.example.LMS.domain.user.dto.LoginRequest;
import com.example.LMS.domain.user.dto.SignUpRequest;
import com.example.LMS.domain.user.dto.UserReservationResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth") // 인증 + 유저 관련
public class UserController {

    private final UserService userService;

    // 아이디 중복 체크
    @PostMapping("/check")
    public CheckIdResponse checkUsername(@RequestParam String username) {
        return userService.checkUsername(username);
    }

    // 회원가입
    @PostMapping("/register")
    public void signUp(@RequestBody SignUpRequest request) {
        userService.signUp(request);
    }

    // 로그인
    @PostMapping("/login")
    public User login(
            @RequestBody LoginRequest request,
            HttpSession session
    ) {
        User user = userService.login(request);

        session.setAttribute("USER_ID", user.getUserId());

        return user;
    }


    // 로그아웃 (세션 기반이면 여기서 invalidate)
    @PostMapping("/logout")
    public void logout(HttpSession session) {
        session.invalidate();
    }
}
