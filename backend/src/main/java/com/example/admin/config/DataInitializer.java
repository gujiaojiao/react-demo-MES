package com.example.admin.config;

import com.example.admin.entity.Dict;
import com.example.admin.entity.Role;
import com.example.admin.entity.User;
import com.example.admin.mapper.DictMapper;
import com.example.admin.mapper.RoleMapper;
import com.example.admin.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserMapper userMapper;
    private final RoleMapper roleMapper;
    private final DictMapper dictMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Initialize dictionary data
        initDicts();

        // Initialize roles
        initRoles();

        // Initialize users
        initUsers();
    }

    private void initRoles() {
        Long count = roleMapper.selectCount(null);
        if (count == 0) {
            // Create admin role
            Role adminRole = new Role();
            adminRole.setName("管理员");
            adminRole.setCode("admin");
            adminRole.setStatus(1);
            adminRole.setDescription("系统管理员，拥有所有权限");
            adminRole.setPermissions("user,role,dict,product,material,bom,process,route,device,order");
            adminRole.setCreatedAt(LocalDateTime.now());
            roleMapper.insert(adminRole);

            // Create user role
            Role userRole = new Role();
            userRole.setName("普通用户");
            userRole.setCode("user");
            userRole.setStatus(1);
            userRole.setDescription("普通用户，拥有基本权限");
            userRole.setPermissions("product,material,device");
            userRole.setCreatedAt(LocalDateTime.now());
            roleMapper.insert(userRole);

            // Create guest role
            Role guestRole = new Role();
            guestRole.setName("访客");
            guestRole.setCode("guest");
            guestRole.setStatus(0);
            guestRole.setDescription("访客角色，已禁用");
            guestRole.setPermissions("");
            guestRole.setCreatedAt(LocalDateTime.now());
            roleMapper.insert(guestRole);

            System.out.println("Default roles created successfully!");
        }
    }

    private void initUsers() {
        Long count = userMapper.selectCount(null);
        if (count == 0) {
            // Create default admin user
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@example.com");
            admin.setRole("admin");
            admin.setStatus(1);
            admin.setCreatedAt(LocalDateTime.now());
            userMapper.insert(admin);

            // Create default user
            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setEmail("user@example.com");
            user.setRole("user");
            user.setStatus(1);
            user.setCreatedAt(LocalDateTime.now());
            userMapper.insert(user);

            // Create test user
            User testUser = new User();
            testUser.setUsername("test");
            testUser.setPassword(passwordEncoder.encode("test123"));
            testUser.setEmail("test@example.com");
            testUser.setRole("user");
            testUser.setStatus(0);
            testUser.setCreatedAt(LocalDateTime.now());
            userMapper.insert(testUser);

            System.out.println("Default users created successfully!");
        }
    }

    private void initDicts() {
        Long count = dictMapper.selectCount(null);
        if (count == 0) {
            // 物料类型
            createDict("material_type", "raw", "原材料", 1);
            createDict("material_type", "part", "零部件", 2);
            createDict("material_type", "package", "包装材料", 3);

            // 设备类型
            createDict("device_type", "production", "生产设备", 1);
            createDict("device_type", "inspection", "检测设备", 2);
            createDict("device_type", "auxiliary", "辅助设备", 3);

            // 订单状态
            createDict("order_status", "0", "待产", 1);
            createDict("order_status", "1", "生产中", 2);
            createDict("order_status", "2", "已完成", 3);
            createDict("order_status", "3", "已取消", 4);

            // 通用状态
            createDict("common_status", "1", "启用", 1);
            createDict("common_status", "0", "禁用", 2);

            System.out.println("Default dictionaries created successfully!");
        }
    }

    private void createDict(String dictType, String dictCode, String dictLabel, int sort) {
        Dict dict = new Dict();
        dict.setDictType(dictType);
        dict.setDictCode(dictCode);
        dict.setDictLabel(dictLabel);
        dict.setSort(sort);
        dict.setStatus(1);
        dict.setCreatedAt(LocalDateTime.now());
        dictMapper.insert(dict);
    }
}