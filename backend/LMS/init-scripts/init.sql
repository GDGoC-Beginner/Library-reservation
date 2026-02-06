-- init.sql
-- 좌석 예약 시스템 데이터베이스 초기화

ALTER SESSION SET CONTAINER = FREEPDB1;
ALTER SESSION SET CURRENT_SCHEMA = MYAPP;

-- 1. 사용자 테이블
CREATE TABLE users (
                       user_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                       username VARCHAR2(20) NOT NULL UNIQUE,
                       email VARCHAR2(50) NOT NULL UNIQUE,
                       password VARCHAR2(100) NOT NULL,
                       name VARCHAR2(30),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 열람실 테이블
CREATE TABLE rooms (
                       room_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                       room_name VARCHAR2(50) NOT NULL UNIQUE,
                       total_seats NUMBER NOT NULL
);

-- 3. 좌석 테이블
CREATE TABLE seats (
                       seat_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                       room_id NUMBER NOT NULL,
                       seat_number NUMBER NOT NULL,
                       is_available VARCHAR2(1) DEFAULT 'Y' CHECK (is_available IN ('Y', 'N')),
                       CONSTRAINT fk_seat_room FOREIGN KEY (room_id) REFERENCES rooms(room_id),
                       CONSTRAINT uq_room_seat UNIQUE (room_id, seat_number)
);

-- 4. 예약 테이블
CREATE TABLE reservations (
                              reservation_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                              user_id NUMBER NOT NULL,
                              seat_id NUMBER NOT NULL,
                              start_time TIMESTAMP NOT NULL,
                              end_time TIMESTAMP NOT NULL,
                              extend_count NUMBER DEFAULT 0,
                              extend_limit NUMBER DEFAULT 2,
                              status VARCHAR2(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELED')),
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              canceled_at TIMESTAMP,
                              CONSTRAINT fk_res_user FOREIGN KEY (user_id) REFERENCES users(user_id),
                              CONSTRAINT fk_res_seat FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
);

-- 5. 사용 이력 테이블
CREATE TABLE usage_histories (
                                 history_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                 user_id NUMBER NOT NULL,
                                 seat_id NUMBER NOT NULL,
                                 reservation_id NUMBER,
                                 use_date DATE NOT NULL,
                                 status VARCHAR2(20) NOT NULL,
                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 CONSTRAINT fk_uh_user FOREIGN KEY (user_id) REFERENCES users(user_id),
                                 CONSTRAINT fk_uh_seat FOREIGN KEY (seat_id) REFERENCES seats(seat_id),
                                 CONSTRAINT fk_uh_reservation FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
);

-- 인덱스 생성 -- 검색 효율을 위한 것듯
CREATE INDEX idx_seats_room ON seats(room_id);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_seat ON reservations(seat_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_usage_histories_user ON usage_histories(user_id);

-- 초기 데이터: 열람실
INSERT INTO rooms (room_name, total_seats) VALUES ('제1열람실', 50);
INSERT INTO rooms (room_name, total_seats) VALUES ('제2열람실', 40);
INSERT INTO rooms (room_name, total_seats) VALUES ('제3열람실', 30);

-- 초기 데이터: 좌석 (제1열람실 - 직접 INSERT)
INSERT INTO seats (room_id, seat_number, is_available) VALUES (1, 1, 'Y');
INSERT INTO seats (room_id, seat_number, is_available) VALUES (1, 2, 'Y');
INSERT INTO seats (room_id, seat_number, is_available) VALUES (1, 3, 'Y');
INSERT INTO seats (room_id, seat_number, is_available) VALUES (1, 4, 'Y');
INSERT INTO seats (room_id, seat_number, is_available) VALUES (1, 5, 'Y');
INSERT INTO seats (room_id, seat_number, is_available) VALUES (1, 6, 'Y');
INSERT INTO seats (room_id, seat_number, is_available) VALUES (1, 7, 'Y');
INSERT INTO seats (room_id, seat_number, is_available) VALUES (1, 8, 'Y');
INSERT INTO seats (room_id, seat_number, is_available) VALUES (1, 9, 'Y');
INSERT INTO seats (room_id, seat_number, is_available) VALUES (1, 10, 'Y');

-- 초기 데이터: 제2열람실 좌석
INSERT INTO seats (room_id, seat_number, is_available) VALUES (2, 1, 'Y');
INSERT INTO seats (room_id, seat_number, is_available) VALUES (2, 2, 'Y');
INSERT INTO seats (room_id, seat_number, is_available) VALUES (2, 3, 'Y');

-- 초기 데이터: 테스트 사용자
INSERT INTO users (username, email, password, name)
VALUES ('admin', 'admin@library.com', 'admin123', '관리자');

INSERT INTO users (username, email, password, name)
VALUES ('user01', 'user01@library.com', 'pass123', '홍길동');

INSERT INTO users (username, email, password, name)
VALUES ('user02', 'user02@library.com', 'pass123', '김철수');

COMMIT;

SELECT 'Database initialization completed!' FROM DUAL;