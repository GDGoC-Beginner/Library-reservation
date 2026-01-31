package com.example.LMS.domain.room;

import com.example.LMS.domain.room.dto.RoomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {

    private final RoomRepository roomRepository;

    public List<RoomResponse> findAllRooms() {
        List<Room> rooms = roomRepository.findAll();

        return rooms.stream().map(room -> {
            // 1. 전체 좌석: 엔티티의 totalSeats 필드 사용
            int total = room.getTotalSeats();

            // 2. 사용 중인 좌석 계산: isAvailable이 "N"인 좌석 수
            int used = (int) room.getSeats().stream()
                    .filter(seat -> "N".equals(seat.getIsAvailable()))
                    .count();

            // 3. 이용 가능 좌석 계산
            int available = total - used;

            // 4. DTO 생성 (순서 주의: roomId, roomName, total, available, used)
            return new RoomResponse(
                    room.getRoomId(),
                    room.getRoomName(),
                    total,
                    available,
                    used
            );
        }).collect(Collectors.toList());
    }
}