package com.example.admin.service;

import com.example.admin.common.PageResult;
import com.example.admin.dto.ProcessDTO;
import com.example.admin.entity.MesProcess;

public interface ProcessService {
    PageResult<MesProcess> getProcessList(int page, int pageSize, String keyword);
    MesProcess getProcessById(Long id);
    MesProcess createProcess(ProcessDTO processDTO);
    MesProcess updateProcess(Long id, ProcessDTO processDTO);
    void deleteProcess(Long id);
}