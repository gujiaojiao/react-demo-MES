package com.example.admin.controller;

import com.example.admin.common.PageResult;
import com.example.admin.common.Result;
import com.example.admin.dto.UserDTO;
import com.example.admin.entity.User;
import com.example.admin.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/list")
    public Result<PageResult<User>> getUserList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword) {
        PageResult<User> result = userService.getUserList(page, pageSize, keyword);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return Result.success(user);
    }

    @PostMapping
    public Result<User> createUser(@Valid @RequestBody UserDTO userDTO) {
        User user = userService.createUser(userDTO);
        return Result.success(user, "创建成功");
    }

    @PutMapping("/{id}")
    public Result<User> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        User user = userService.updateUser(id, userDTO);
        return Result.success(user, "更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success(null, "删除成功");
    }
}