package com.example.admin.service;

import com.example.admin.common.PageResult;
import com.example.admin.dto.DeviceDTO;
import com.example.admin.entity.Device;

public interface DeviceService {
    PageResult<Device> getDeviceList(int page, int pageSize, String keyword, String type);
    Device getDeviceById(Long id);
    Device createDevice(DeviceDTO deviceDTO);
    Device updateDevice(Long id, DeviceDTO deviceDTO);
    void deleteDevice(Long id);
}