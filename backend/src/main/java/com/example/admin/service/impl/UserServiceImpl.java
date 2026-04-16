package com.example.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.admin.common.PageResult;
import com.example.admin.dto.UserDTO;
import com.example.admin.entity.User;
import com.example.admin.mapper.UserMapper;
import com.example.admin.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public PageResult<User> getUserList(int page, int pageSize, String keyword) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w
                    .like(User::getUsername, keyword)
                    .or()
                    .like(User::getEmail, keyword)
            );
        }

        wrapper.orderByAsc(User::getId);

        Page<User> pageResult = userMapper.selectPage(new Page<>(page, pageSize), wrapper);

        // Clear passwords
        pageResult.getRecords().forEach(user -> user.setPassword(null));

        return new PageResult<>(pageResult.getRecords(), pageResult.getTotal());
    }

    @Override
    public User getUserById(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        user.setPassword(null);
        return user;
    }

    @Override
    public User createUser(UserDTO userDTO) {
        // Check if username exists
        Long count = userMapper.selectCount(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUsername, userDTO.getUsername())
        );
        if (count > 0) {
            throw new RuntimeException("用户名已存在");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(passwordEncoder.encode(
                StringUtils.hasText(userDTO.getPassword()) ? userDTO.getPassword() : "default123"
        ));
        user.setEmail(userDTO.getEmail());
        user.setRole(StringUtils.hasText(userDTO.getRole()) ? userDTO.getRole() : "user");
        user.setStatus(userDTO.getStatus() != null ? userDTO.getStatus() : 1);
        user.setCreatedAt(LocalDateTime.now());

        userMapper.insert(user);
        user.setPassword(null);

        return user;
    }

    @Override
    public User updateUser(Long id, UserDTO userDTO) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        if (StringUtils.hasText(userDTO.getUsername())) {
            // Check if new username already exists
            Long count = userMapper.selectCount(
                    new LambdaQueryWrapper<User>()
                            .eq(User::getUsername, userDTO.getUsername())
                            .ne(User::getId, id)
            );
            if (count > 0) {
                throw new RuntimeException("用户名已存在");
            }
            user.setUsername(userDTO.getUsername());
        }

        if (StringUtils.hasText(userDTO.getEmail())) {
            user.setEmail(userDTO.getEmail());
        }

        if (StringUtils.hasText(userDTO.getRole())) {
            user.setRole(userDTO.getRole());
        }

        if (userDTO.getStatus() != null) {
            user.setStatus(userDTO.getStatus());
        }

        userMapper.updateById(user);
        user.setPassword(null);

        return user;
    }

    @Override
    public void deleteUser(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        userMapper.deleteById(id);
    }
}