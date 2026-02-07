package com.example.LMS.domain.history;

import com.example.LMS.domain.history.dto.HistoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HistoryService {

    private final HistoryRepository historyRepository;

    // 사용자별 이력 조회
    public List<HistoryResponse> getUserHistories(Long userId) {
        //null 체크 추가
        if (userId == null) {
            throw new IllegalArgumentException("사용자 ID가 없습니다.");
        }

        return historyRepository.findByUser_UserId(userId)
                .stream()
                .map(HistoryResponse::from)
                .collect(Collectors.toList());
    }


    //이력 상태 변경
    @Transactional
    public void updateStatus(Long historyId, String newStatus) {
        History history = historyRepository.findById(historyId)
                .orElseThrow(() -> new IllegalArgumentException("해당 이력이 존재하지 않습니다."));

        history.changeStatus(newStatus);
    }
}