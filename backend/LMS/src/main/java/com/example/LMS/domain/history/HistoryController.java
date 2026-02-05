package com.example.LMS.domain.history;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/histories")
public class HistoryController {

    private final HistoryService historyService;

    // 내 이용 이력 조회
    @GetMapping("/me")
    public List getMyHistories(HttpSession session) {

        Long userId = (Long) session.getAttribute("USER_ID");

        if (userId == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        return historyService.getUserHistories(userId);
    }
}
