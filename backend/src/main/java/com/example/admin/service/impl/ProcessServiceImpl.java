package com.example.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.admin.common.PageResult;
import com.example.admin.dto.ProcessDTO;
import com.example.admin.entity.MesProcess;
import com.example.admin.mapper.ProcessMapper;
import com.example.admin.service.ProcessService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProcessServiceImpl implements ProcessService {

    private final ProcessMapper processMapper;

    @Override
    public PageResult<MesProcess> getProcessList(int page, int pageSize, String keyword) {
        LambdaQueryWrapper<MesProcess> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w
                    .like(MesProcess::getName, keyword)
                    .or()
                    .like(MesProcess::getCode, keyword)
            );
        }

        wrapper.orderByAsc(MesProcess::getId);

        Page<MesProcess> pageResult = processMapper.selectPage(new Page<>(page, pageSize), wrapper);

        return new PageResult<>(pageResult.getRecords(), pageResult.getTotal());
    }

    @Override
    public MesProcess getProcessById(Long id) {
        MesProcess process = processMapper.selectById(id);
        if (process == null) {
            throw new RuntimeException("工序不存在");
        }
        return process;
    }

    @Override
    public MesProcess createProcess(ProcessDTO processDTO) {
        Long count = processMapper.selectCount(
                new LambdaQueryWrapper<MesProcess>()
                        .eq(MesProcess::getCode, processDTO.getCode())
        );
        if (count > 0) {
            throw new RuntimeException("工序编码已存在");
        }

        MesProcess process = new MesProcess();
        process.setName(processDTO.getName());
        process.setCode(processDTO.getCode());
        process.setDescription(processDTO.getDescription());
        process.setStatus(processDTO.getStatus() != null ? processDTO.getStatus() : 1);
        process.setCreatedAt(LocalDateTime.now());

        processMapper.insert(process);

        return process;
    }

    @Override
    public MesProcess updateProcess(Long id, ProcessDTO processDTO) {
        MesProcess process = processMapper.selectById(id);
        if (process == null) {
            throw new RuntimeException("工序不存在");
        }

        if (StringUtils.hasText(processDTO.getName())) {
            process.setName(processDTO.getName());
        }

        if (StringUtils.hasText(processDTO.getCode())) {
            Long count = processMapper.selectCount(
                    new LambdaQueryWrapper<MesProcess>()
                            .eq(MesProcess::getCode, processDTO.getCode())
                            .ne(MesProcess::getId, id)
            );
            if (count > 0) {
                throw new RuntimeException("工序编码已存在");
            }
            process.setCode(processDTO.getCode());
        }

        if (processDTO.getDescription() != null) {
            process.setDescription(processDTO.getDescription());
        }

        if (processDTO.getStatus() != null) {
            process.setStatus(processDTO.getStatus());
        }

        processMapper.updateById(process);

        return process;
    }

    @Override
    public void deleteProcess(Long id) {
        MesProcess process = processMapper.selectById(id);
        if (process == null) {
            throw new RuntimeException("工序不存在");
        }
        processMapper.deleteById(id);
    }
}