package com.example.LMS.domain.room;

import com.example.LMS.domain.room.dto.RoomResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
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
    public Map<String, Object> getReadingRooms(HttpSession session) {

        //세션 체크 (인증 필수)
        Long userId = (Long) session.getAttribute("USER_ID");
        if (userId == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        //서비스 호출
        List<RoomResponse> rooms = roomService.findAllRooms();

        //응답 포맷 맞추기
        Map<String, Object> response = new HashMap<>();
        response.put("message", "목록 조회 성공");
        response.put("rooms", rooms);

        return response;
    }
}
