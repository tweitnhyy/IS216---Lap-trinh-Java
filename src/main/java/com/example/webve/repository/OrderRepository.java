package com.example.webve.repository;

import com.example.webve.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


public interface OrderRepository extends JpaRepository<Order, String> {

    Optional<Order> findByOrderId(String orderId);
}
