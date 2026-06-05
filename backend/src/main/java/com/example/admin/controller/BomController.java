package com.example.admin.controller;

import com.example.admin.common.Result;
import com.example.admin.dto.BomDTO;
import com.example.admin.dto.BomVO;
import com.example.admin.entity.Bom;
import com.example.admin.service.BomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bom")
@RequiredArgsConstructor
public class BomController {

    private final BomService bomService;

    @GetMapping("/list")
    public Result<List<BomVO>> getBomList(@RequestParam Long productId) {
        List<BomVO> result = bomService.getBomListByProductId(productId);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Bom> getBomById(@PathVariable Long id) {
        Bom bom = bomService.getBomById(id);
        return Result.success(bom);
    }

    @GetMapping("/by-product/{productId}")
    public Result<List<BomVO>> getBomByProductId(@PathVariable Long productId) {
        List<BomVO> result = bomService.getBomListByProductId(productId);
        return Result.success(result);
    }

    @PostMapping
    public Result<Bom> createBom(@Valid @RequestBody BomDTO bomDTO) {
        Bom bom = bomService.createBom(bomDTO);
        return Result.success(bom, "创建成功");
    }

    @PutMapping("/{id}")
    public Result<Bom> updateBom(@PathVariable Long id, @RequestBody BomDTO bomDTO) {
        Bom bom = bomService.updateBom(id, bomDTO);
        return Result.success(bom, "更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteBom(@PathVariable Long id) {
        bomService.deleteBom(id);
        return Result.success(null, "删除成功");
    }
}
