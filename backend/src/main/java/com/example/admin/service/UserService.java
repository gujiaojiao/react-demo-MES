package com.example.admin.service;

import com.example.admin.common.PageResult;
import com.example.admin.dto.UserDTO;
import com.example.admin.entity.User;

public interface UserService {
    PageResult<User> getUserList(int page, int pageSize, String keyword);
    User getUserById(Long id);
    User createUser(UserDTO userDTO);
    User updateUser(Long id, UserDTO userDTO);
    void deleteUser(Long id);
}