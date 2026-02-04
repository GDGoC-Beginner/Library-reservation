package com.example.LMS.domain.user;


import com.example.LMS.domain.user.dto.CheckIdResponse;
import com.example.LMS.domain.user.dto.LoginRequest;
import com.example.LMS.domain.user.dto.SignUpRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; //단방향 해시 함수 (BCrypt) 적용

    //1. 아이디 중복 확인
    public CheckIdResponse checkUsername(String username) {
        boolean isAvailable = !userRepository.existsByUsername(username);
        String message = isAvailable ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.";
        return new CheckIdResponse(message, isAvailable);
    }

    //2. 회원 가입 (단방향 해시 함수 적용하기)
    @Transactional
    public void signUp(SignUpRequest request) {
        //2-1. 아이디 중복 검증화
        if(userRepository.existsByUsername(request.getUsername())) { //exist -> 존재 여부만 검증 find -> data 조회
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }
        //2-2. 비밀번호 암호화 단방향 해시 함수 (BCrypt) 적용
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        //2-3. 엔티티 생성 및 저장
        User user = User.builder()
                .username(request.getName())
                .email(request.getEmail())
                .password(encodedPassword) //암호화된 비밀번호 저장
                .name(request.getName())
                .build();
        userRepository.save(user);
    }

    //3. 로그인
    public User login(LoginRequest request) {
        // 아이디로 사용자 조회
        String username = request.getUsername();
        String rawPassword = request.getPassword();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 해시된 비밀번호 비교
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        return user;
    }
}
