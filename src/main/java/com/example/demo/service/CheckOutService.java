package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.controller.CheckOutController;
import com.example.demo.entity.Product;
import com.example.demo.entity.Promotion;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.PromotionRepository;

import jakarta.transaction.Transactional;

@Service
public class CheckOutService {

	@Autowired
	private PromotionRepository promotionRepository;
	
	@Autowired
	private ProductRepository productRepository;
	
	public int getProductDiscount(String productName) {
		Promotion promotion = promotionRepository.findByProductName(productName);
		if(promotion == null)
			return 0;
		return promotion.getDiscount();
	}

	public int getQuantity(String productName) {
		Product product = productRepository.findByName(productName);
		if(product == null)
			return 0;
		return product.getQuantity();
	}
	
	public synchronized void reduceQuantity(String productName, int quantity) {
		Product product = productRepository.findByName(productName);
		product.setQuantity(product.getQuantity()-quantity);
		productRepository.save(product);
	}
	
}