package com.example.LMS.domain.room;

import com.example.LMS.domain.room.dto.RoomResponse;
import com.example.LMS.domain.user.CustomUserDetails;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/search")
public class RoomController {

    private final RoomService roomService;

    // 열람실 조회
    @GetMapping("/reading-rooms")
    public Map<String, Object> getReadingRooms(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        // 로그인 체크
        if (userDetails == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }
        // userId 가져오기
        Long userId = userDetails.getUserId();
        // 또는 User 엔티티 전체가 필요하면
        // User user = userDetails.getUser();
        // 서비스 호출
        List<RoomResponse> rooms = roomService.findAllRooms();
        // 응답 포맷 맞추기
        Map<String, Object> response = new HashMap<>();
        response.put("message", "목록 조회 성공");
        response.put("rooms", rooms);
        return response;
    }
}
