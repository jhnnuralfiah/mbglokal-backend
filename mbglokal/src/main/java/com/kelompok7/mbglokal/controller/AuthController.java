package com.kelompok7.mbglokal.controller;

import com.kelompok7.mbglokal.entity.User;
import com.kelompok7.mbglokal.repository.UserRepository;
import com.kelompok7.mbglokal.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // 1. Cari user di database berdasarkan username yang diketik
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        // 2. Kalau usernamenya ketemu
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // 3. Cocokkan passwordnya
            if (user.getPassword().equals(request.getPassword())) {
                return ResponseEntity.ok("Login Berhasil! Selamat datang, " + user.getUsername());
            } else {
                return ResponseEntity.status(401).body("Error: Password salah!");
            }
        } else {
            // 4. Kalau usernamenya nggak ada di database
            return ResponseEntity.status(404).body("Error: Username tidak ditemukan!");
        }
    }
}