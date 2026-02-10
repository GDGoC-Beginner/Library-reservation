package com.example.LMS.domain.user;


import com.example.LMS.domain.reservation.ReservationService;
import com.example.LMS.domain.reservation.dto.ReservationResponse;
import com.example.LMS.domain.user.dto.UsernameCheckResponse;
import com.example.LMS.domain.user.dto.SignUpRequest;
import com.example.LMS.domain.user.dto.UserReservationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReservationService reservationService;

    // 1. 아이디 중복 확인 (화면용 API)
    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }


    //2. 회원 가입
    @Transactional
    public void signUp(SignUpRequest request) {
        if (!isUsernameAvailable(request.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .username(request.getUsername())  // 수정: getName() → getUsername()
                .email(request.getEmail())
                .password(encodedPassword)
                .name(request.getName())
                .build();
        userRepository.save(user);
    }

    // 3. Spring Security 로그인 처리 (자동 호출)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("존재하지 않는 사용자입니다."));

        return new CustomUserDetails(user);  // 커스텀 UserDetails 반환
    }

    // 4. 내 예약 조회
    public UserReservationResponse getMyReservation(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        ReservationResponse reservation = null;
        try {
            reservation = reservationService.getCurrentReservation(userId);
        } catch (IllegalArgumentException e) {
            // 예약 없음 → 그냥 null 유지
        }

        return new UserReservationResponse(
                user.getUsername(),
                user.getName(),
                reservation
        );
    }
}
