package com.example.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.admin.common.PageResult;
import com.example.admin.dto.DeviceDTO;
import com.example.admin.entity.Device;
import com.example.admin.mapper.DeviceMapper;
import com.example.admin.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DeviceServiceImpl implements DeviceService {

    private final DeviceMapper deviceMapper;

    @Override
    public PageResult<Device> getDeviceList(int page, int pageSize, String keyword, String type) {
        LambdaQueryWrapper<Device> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w
                    .like(Device::getName, keyword)
                    .or()
                    .like(Device::getCode, keyword)
            );
        }

        if (StringUtils.hasText(type)) {
            wrapper.eq(Device::getType, type);
        }

        wrapper.orderByAsc(Device::getId);

        Page<Device> pageResult = deviceMapper.selectPage(new Page<>(page, pageSize), wrapper);

        return new PageResult<>(pageResult.getRecords(), pageResult.getTotal());
    }

    @Override
    public Device getDeviceById(Long id) {
        Device device = deviceMapper.selectById(id);
        if (device == null) {
            throw new RuntimeException("设备不存在");
        }
        return device;
    }

    @Override
    public Device createDevice(DeviceDTO deviceDTO) {
        Long count = deviceMapper.selectCount(
                new LambdaQueryWrapper<Device>()
                        .eq(Device::getCode, deviceDTO.getCode())
        );
        if (count > 0) {
            throw new RuntimeException("设备编码已存在");
        }

        Device device = new Device();
        device.setName(deviceDTO.getName());
        device.setCode(deviceDTO.getCode());
        device.setType(deviceDTO.getType());
        device.setLocation(deviceDTO.getLocation());
        device.setStatus(deviceDTO.getStatus() != null ? deviceDTO.getStatus() : 1);
        device.setCreatedAt(LocalDateTime.now());

        deviceMapper.insert(device);

        return device;
    }

    @Override
    public Device updateDevice(Long id, DeviceDTO deviceDTO) {
        Device device = deviceMapper.selectById(id);
        if (device == null) {
            throw new RuntimeException("设备不存在");
        }

        if (StringUtils.hasText(deviceDTO.getName())) {
            device.setName(deviceDTO.getName());
        }

        if (StringUtils.hasText(deviceDTO.getCode())) {
            Long count = deviceMapper.selectCount(
                    new LambdaQueryWrapper<Device>()
                            .eq(Device::getCode, deviceDTO.getCode())
                            .ne(Device::getId, id)
            );
            if (count > 0) {
                throw new RuntimeException("设备编码已存在");
            }
            device.setCode(deviceDTO.getCode());
        }

        if (StringUtils.hasText(deviceDTO.getType())) {
            device.setType(deviceDTO.getType());
        }

        if (deviceDTO.getLocation() != null) {
            device.setLocation(deviceDTO.getLocation());
        }

        if (deviceDTO.getStatus() != null) {
            device.setStatus(deviceDTO.getStatus());
        }

        deviceMapper.updateById(device);

        return device;
    }

    @Override
    public void deleteDevice(Long id) {
        Device device = deviceMapper.selectById(id);
        if (device == null) {
            throw new RuntimeException("设备不存在");
        }
        deviceMapper.deleteById(id);
    }
}