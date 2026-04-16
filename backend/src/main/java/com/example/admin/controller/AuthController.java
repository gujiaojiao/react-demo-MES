package com.example.admin.controller;

import com.example.admin.common.Result;
import com.example.admin.dto.LoginDTO;
import com.example.admin.entity.User;
import com.example.admin.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginDTO loginDTO) {
        Map<String, Object> data = authService.login(loginDTO);
        return Result.success(data);
    }

    @PostMapping("/logout")
    public Result<Void> logout() {
        authService.logout();
        return Result.success(null, "登出成功");
    }

    @GetMapping("/info")
    public Result<User> getCurrentUser() {
        User user = authService.getCurrentUser();
        return Result.success(user);
    }
}