package com.example.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.admin.common.PageResult;
import com.example.admin.dto.ProductDTO;
import com.example.admin.entity.Product;
import com.example.admin.mapper.ProductMapper;
import com.example.admin.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;

    @Override
    public PageResult<Product> getProductList(int page, int pageSize, String keyword) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w
                    .like(Product::getName, keyword)
                    .or()
                    .like(Product::getCode, keyword)
            );
        }

        wrapper.orderByAsc(Product::getId);

        Page<Product> pageResult = productMapper.selectPage(new Page<>(page, pageSize), wrapper);

        return new PageResult<>(pageResult.getRecords(), pageResult.getTotal());
    }

    @Override
    public Product getProductById(Long id) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            throw new RuntimeException("产品不存在");
        }
        return product;
    }

    @Override
    public Product createProduct(ProductDTO productDTO) {
        Long count = productMapper.selectCount(
                new LambdaQueryWrapper<Product>()
                        .eq(Product::getCode, productDTO.getCode())
        );
        if (count > 0) {
            throw new RuntimeException("产品编码已存在");
        }

        Product product = new Product();
        product.setName(productDTO.getName());
        product.setCode(productDTO.getCode());
        product.setSpec(productDTO.getSpec());
        product.setStatus(productDTO.getStatus() != null ? productDTO.getStatus() : 1);
        product.setCreatedAt(LocalDateTime.now());
        product.setDescription(productDTO.getDescription());

        productMapper.insert(product);

        return product;
    }

    @Override
    public Product updateProduct(Long id, ProductDTO productDTO) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            throw new RuntimeException("产品不存在");
        }

        if (StringUtils.hasText(productDTO.getName())) {
            product.setName(productDTO.getName());
        }

        if (StringUtils.hasText(productDTO.getCode())) {
            Long count = productMapper.selectCount(
                    new LambdaQueryWrapper<Product>()
                            .eq(Product::getCode, productDTO.getCode())
                            .ne(Product::getId, id)
            );
            if (count > 0) {
                throw new RuntimeException("产品编码已存在");
            }
            product.setCode(productDTO.getCode());
        }

        if (productDTO.getSpec() != null) {
            product.setSpec(productDTO.getSpec());
        }

        if (productDTO.getStatus() != null) {
            product.setStatus(productDTO.getStatus());
        }

        if (productDTO.getDescription() != null) {
            product.setDescription(productDTO.getDescription());
        }

        productMapper.updateById(product);

        return product;
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            throw new RuntimeException("产品不存在");
        }
        productMapper.deleteById(id);
    }
}