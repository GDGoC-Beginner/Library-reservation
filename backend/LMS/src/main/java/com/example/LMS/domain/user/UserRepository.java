package com.example.LMS.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository
        extends JpaRepository<User,Integer> { //User의 Id의 자료형이 Integer

    //API에 필요한 함수를 추가해야 함 -> 선행 과정으로 User 엔티티를 먼저 구현해야 함

    //1. 로그인 시에 아이디와 비밀번호를 조회
    //2. 회원가입 시에 아이디의 중복 유무를 검증
}
