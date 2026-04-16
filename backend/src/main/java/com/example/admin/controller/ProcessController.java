package com.example.admin.controller;

import com.example.admin.common.PageResult;
import com.example.admin.common.Result;
import com.example.admin.dto.ProcessDTO;
import com.example.admin.entity.MesProcess;
import com.example.admin.service.ProcessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/process")
@RequiredArgsConstructor
public class ProcessController {

    private final ProcessService processService;

    @GetMapping("/list")
    public Result<PageResult<MesProcess>> getProcessList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword) {
        PageResult<MesProcess> result = processService.getProcessList(page, pageSize, keyword);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<MesProcess> getProcessById(@PathVariable Long id) {
        MesProcess process = processService.getProcessById(id);
        return Result.success(process);
    }

    @PostMapping
    public Result<MesProcess> createProcess(@Valid @RequestBody ProcessDTO processDTO) {
        MesProcess process = processService.createProcess(processDTO);
        return Result.success(process, "创建成功");
    }

    @PutMapping("/{id}")
    public Result<MesProcess> updateProcess(@PathVariable Long id, @RequestBody ProcessDTO processDTO) {
        MesProcess process = processService.updateProcess(id, processDTO);
        return Result.success(process, "更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteProcess(@PathVariable Long id) {
        processService.deleteProcess(id);
        return Result.success(null, "删除成功");
    }
}