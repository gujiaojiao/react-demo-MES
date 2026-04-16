package com.example.admin.controller;

import com.example.admin.common.PageResult;
import com.example.admin.common.Result;
import com.example.admin.dto.RoleDTO;
import com.example.admin.entity.Role;
import com.example.admin.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/role")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping("/list")
    public Result<PageResult<Role>> getRoleList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword) {
        PageResult<Role> result = roleService.getRoleList(page, pageSize, keyword);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Role> getRoleById(@PathVariable Long id) {
        Role role = roleService.getRoleById(id);
        return Result.success(role);
    }

    @PostMapping
    public Result<Role> createRole(@Valid @RequestBody RoleDTO roleDTO) {
        Role role = roleService.createRole(roleDTO);
        return Result.success(role, "创建成功");
    }

    @PutMapping("/{id}")
    public Result<Role> updateRole(@PathVariable Long id, @RequestBody RoleDTO roleDTO) {
        Role role = roleService.updateRole(id, roleDTO);
        return Result.success(role, "更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return Result.success(null, "删除成功");
    }
}