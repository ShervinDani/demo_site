package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.CheckOutService;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("checkout")
public class CheckOutController {
	
	@Autowired
	private CheckOutService checkOutService;
	
	@GetMapping("getDiscount/{productName}")
	public int getProductDiscount(@PathVariable String productName)
	{
		return checkOutService.getProductDiscount(productName);
	}
	
	@GetMapping("getQuantity/{productName}")
	public int getQuantity(@PathVariable String productName)
	{
		return checkOutService.getQuantity(productName);
	}
	
	@PutMapping("reduceQuantity/{productName}/{quantity}")
	public void reduceQuantity(@PathVariable String productName,@PathVariable int quantity)
	{
		System.out.println(productName+ " " +quantity);
		checkOutService.reduceQuantity(productName,quantity);
	}
}
