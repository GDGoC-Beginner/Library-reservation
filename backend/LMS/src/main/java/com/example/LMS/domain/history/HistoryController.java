package com.example.LMS.domain.history;

import com.example.LMS.domain.history.dto.HistoryResponse;
import com.example.LMS.domain.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/histories")
public class HistoryController {

    private final HistoryService historyService;

    // 내 사용 이력 조회
    @GetMapping("/me")
    public List<HistoryResponse> getMyHistories(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        Long userId = userDetails.getUserId();
        List<HistoryResponse> items = historyService.getUserHistories(userId);

        return historyService.getUserHistories(userId);
    }

    // 이력 상태 변경 (관리자 기능)
    @PatchMapping("/{historyId}/status")
    public void updateHistoryStatus(
            @PathVariable Long historyId,
            @RequestParam String status,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }
        // TODO: 관리자 권한 체크 추가
        historyService.updateStatus(historyId, status);
    }
}