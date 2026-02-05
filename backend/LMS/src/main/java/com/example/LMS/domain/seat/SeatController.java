package com.example.LMS.domain.seat;

import com.example.LMS.domain.seat.dto.RoomSeatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/search/reading-rooms")
public class SeatController {

    private final SeatService seatService;

    // 좌석 조회
    // GET /search/reading-rooms/{roomId}/seats
    @GetMapping("/{roomId}/seats")
    public RoomSeatsResponse getSeatsByRoom(
            @PathVariable Long roomId
    ) {
        return seatService.getSeatsByRoom(roomId);
    }
}
