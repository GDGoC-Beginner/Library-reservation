package com.example.LMS.domain.seat;

import com.example.LMS.domain.room.Room;
import com.example.LMS.domain.seat.dto.RoomSeatsResponse;
import com.example.LMS.domain.seat.dto.SeatResponse;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SeatService {

    private final SeatRepository seatRepository;

    public RoomSeatsResponse getSeatsByRoom(Long roomId) {

        List<Seat> seats = seatRepository.findByRoom_RoomId(roomId);

        if (seats.isEmpty()) {
            throw new IllegalArgumentException("해당 열람실 좌석 없음");
        }

        Room room = seats.get(0).getRoom();

        return RoomSeatsResponse.builder()
                .message("좌석 조회 성공")
                .roomId(room.getRoomId())
                .roomName(room.getRoomName())
                .seats(
                        seats.stream()
                                .map(SeatResponse::from)
                                .toList()
                )
                .build();
    }
}

