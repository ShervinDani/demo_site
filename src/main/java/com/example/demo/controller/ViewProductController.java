package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Product;
import com.example.demo.service.ViewProductService;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ViewProductController {

    @Autowired
    private ViewProductService service;
    
    @GetMapping
    public List<Product> getProducts() {
        return service.getAllProducts();
    }
}

