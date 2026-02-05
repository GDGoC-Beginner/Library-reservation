package com.example.LMS.domain.history;

import com.example.LMS.domain.history.dto.HistoryResponse;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Generated;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class HistoryService {
    private final HistoryRepository historyRepository;

    public List getUserHistories(Long userId) {
        return (List)this.historyRepository.findByUser_UserId(userId).stream().map(HistoryResponse::from).collect(Collectors.toList());
    }

    @Transactional
    public void updateStatus(Long historyId, String newStatus) {
        History history = (History)this.historyRepository.findById(historyId).orElseThrow(() -> {
            return new IllegalArgumentException("해당 이력이 존재하지 않습니다.");
        });
        history.changeStatus(newStatus);
    }

    @Generated
    public HistoryService(final HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }
}
   