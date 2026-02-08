package com.example.LMS.domain.history;

import com.example.LMS.domain.history.dto.HistoryResponse;
import com.example.LMS.domain.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reservations")
public class HistoryController {

    private final HistoryService historyService;

    // 내 사용 이력 조회
    @GetMapping("/history")
    public List<HistoryResponse> getMyHistories(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        Long userId = userDetails.getUserId();
        return historyService.getUserHistories(userId);
    }


}