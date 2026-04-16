package com.example.admin.service;

import com.example.admin.common.PageResult;
import com.example.admin.dto.LoginDTO;
import com.example.admin.dto.UserDTO;
import com.example.admin.entity.User;

import java.util.Map;

public interface AuthService {
    Map<String, Object> login(LoginDTO loginDTO);
    void logout();
    User getCurrentUser();
}