package com.example.admin.controller;

import com.example.admin.common.PageResult;
import com.example.admin.common.Result;
import com.example.admin.dto.DeviceDTO;
import com.example.admin.entity.Device;
import com.example.admin.service.DeviceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/device")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    @GetMapping("/list")
    public Result<PageResult<Device>> getDeviceList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type) {
        PageResult<Device> result = deviceService.getDeviceList(page, pageSize, keyword, type);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Device> getDeviceById(@PathVariable Long id) {
        Device device = deviceService.getDeviceById(id);
        return Result.success(device);
    }

    @PostMapping
    public Result<Device> createDevice(@Valid @RequestBody DeviceDTO deviceDTO) {
        Device device = deviceService.createDevice(deviceDTO);
        return Result.success(device, "创建成功");
    }

    @PutMapping("/{id}")
    public Result<Device> updateDevice(@PathVariable Long id, @RequestBody DeviceDTO deviceDTO) {
        Device device = deviceService.updateDevice(id, deviceDTO);
        return Result.success(device, "更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteDevice(@PathVariable Long id) {
        deviceService.deleteDevice(id);
        return Result.success(null, "删除成功");
    }
}