package com.example.LMS.domain.user;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "USERS")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq_gen")
    @SequenceGenerator(name = "user_seq_gen", sequenceName = "USER_SEQ", allocationSize = 1)
    @Column(name = "USER_ID")
    private Long userid;

    @Column(nullable = false, unique = true, length = 20)
    private String username;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(nullable = false, length = 100)
    private String password; //암호화된 해시값이 저장됨

    @Column(nullable = false, length = 30)
    private String name;

    @Column(name = "CREATED_AT", updatable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();
}
