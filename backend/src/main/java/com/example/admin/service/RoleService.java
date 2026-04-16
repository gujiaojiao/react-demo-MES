package com.example.admin.service;

import com.example.admin.common.PageResult;
import com.example.admin.dto.RoleDTO;
import com.example.admin.entity.Role;

public interface RoleService {
    PageResult<Role> getRoleList(int page, int pageSize, String keyword);
    Role getRoleById(Long id);
    Role createRole(RoleDTO roleDTO);
    Role updateRole(Long id, RoleDTO roleDTO);
    void deleteRole(Long id);
}