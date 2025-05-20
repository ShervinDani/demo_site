package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Promotion;
import java.util.List;


@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer>{
	
	public Promotion findByProductName(String productName);

}
