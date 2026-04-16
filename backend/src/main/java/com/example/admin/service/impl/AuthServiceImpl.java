package com.example.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.admin.dto.LoginDTO;
import com.example.admin.entity.User;
import com.example.admin.mapper.UserMapper;
import com.example.admin.security.JwtUtils;
import com.example.admin.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public Map<String, Object> login(LoginDTO loginDTO) {
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUsername, loginDTO.getUsername())
        );

        if (user == null) {
            throw new RuntimeException("用户名或密码错误");
        }

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }

        String token = jwtUtils.generateToken(user.getId(), user.getUsername(), user.getRole());

        Map<String, Object> result = new HashMap<>();
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("role", user.getRole());

        result.put("token", token);
        result.put("userInfo", userInfo);

        return result;
    }

    @Override
    public void logout() {
        // JWT is stateless, so logout is handled client-side
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("未授权");
        }

        Long userId = (Long) authentication.getPrincipal();
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // Clear password before returning
        user.setPassword(null);
        return user;
    }
}