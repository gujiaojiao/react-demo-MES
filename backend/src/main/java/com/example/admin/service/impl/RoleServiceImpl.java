package com.example.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.admin.common.PageResult;
import com.example.admin.dto.RoleDTO;
import com.example.admin.entity.Role;
import com.example.admin.entity.User;
import com.example.admin.mapper.RoleMapper;
import com.example.admin.mapper.UserMapper;
import com.example.admin.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleMapper roleMapper;
    private final UserMapper userMapper;

    @Override
    public PageResult<Role> getRoleList(int page, int pageSize, String keyword) {
        LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w
                    .like(Role::getName, keyword)
                    .or()
                    .like(Role::getCode, keyword)
            );
        }

        wrapper.orderByAsc(Role::getId);

        Page<Role> pageResult = roleMapper.selectPage(new Page<>(page, pageSize), wrapper);

        return new PageResult<>(pageResult.getRecords(), pageResult.getTotal());
    }

    @Override
    public Role getRoleById(Long id) {
        Role role = roleMapper.selectById(id);
        if (role == null) {
            throw new RuntimeException("角色不存在");
        }
        return role;
    }

    @Override
    public Role createRole(RoleDTO roleDTO) {
        // Check if code already exists
        Long count = roleMapper.selectCount(
                new LambdaQueryWrapper<Role>()
                        .eq(Role::getCode, roleDTO.getCode())
        );
        if (count > 0) {
            throw new RuntimeException("角色编码已存在");
        }

        Role role = new Role();
        role.setName(roleDTO.getName());
        role.setCode(roleDTO.getCode());
        role.setStatus(roleDTO.getStatus() != null ? roleDTO.getStatus() : 1);
        role.setDescription(roleDTO.getDescription());
        role.setPermissions(roleDTO.getPermissions());
        role.setCreatedAt(LocalDateTime.now());

        roleMapper.insert(role);

        return role;
    }

    @Override
    public Role updateRole(Long id, RoleDTO roleDTO) {
        Role role = roleMapper.selectById(id);
        if (role == null) {
            throw new RuntimeException("角色不存在");
        }

        if (StringUtils.hasText(roleDTO.getName())) {
            role.setName(roleDTO.getName());
        }

        if (StringUtils.hasText(roleDTO.getCode())) {
            // Check if new code already exists
            Long count = roleMapper.selectCount(
                    new LambdaQueryWrapper<Role>()
                            .eq(Role::getCode, roleDTO.getCode())
                            .ne(Role::getId, id)
            );
            if (count > 0) {
                throw new RuntimeException("角色编码已存在");
            }
            role.setCode(roleDTO.getCode());
        }

        if (roleDTO.getStatus() != null) {
            role.setStatus(roleDTO.getStatus());
        }

        if (StringUtils.hasText(roleDTO.getDescription())) {
            role.setDescription(roleDTO.getDescription());
        }

        if (roleDTO.getPermissions() != null) {
            role.setPermissions(roleDTO.getPermissions());
        }

        roleMapper.updateById(role);

        return role;
    }

    @Override
    public void deleteRole(Long id) {
        Role role = roleMapper.selectById(id);
        if (role == null) {
            throw new RuntimeException("角色不存在");
        }

        // 检查是否有用户使用了该角色
        Long userCount = userMapper.selectCount(
                new LambdaQueryWrapper<User>()
                        .eq(User::getRole, role.getCode())
        );
        if (userCount > 0) {
            throw new RuntimeException("该角色已分配给 " + userCount + " 个用户，无法删除");
        }

        roleMapper.deleteById(id);
    }
}