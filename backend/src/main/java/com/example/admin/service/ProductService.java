package com.example.admin.service;

import com.example.admin.common.PageResult;
import com.example.admin.dto.ProductDTO;
import com.example.admin.entity.Product;

public interface ProductService {
    PageResult<Product> getProductList(int page, int pageSize, String keyword);
    Product getProductById(Long id);
    Product createProduct(ProductDTO productDTO);
    Product updateProduct(Long id, ProductDTO productDTO);
    void deleteProduct(Long id);
}