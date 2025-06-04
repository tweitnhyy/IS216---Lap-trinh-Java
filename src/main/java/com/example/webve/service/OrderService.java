package com.example.webve.service;

import com.example.webve.dto.OrderDTO;
import com.example.webve.model.Order;
import com.example.webve.model.Ticket;
import com.example.webve.model.TicketType;
import com.example.webve.model.User;
import com.example.webve.repository.OrderRepository;
import com.example.webve.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private EventService eventService;

    @Autowired
    private TicketTypeService ticketTypeService;

    @Autowired
    private AuthService userService;

    @Transactional
    public Order createOrder(OrderDTO orderDTO) {
        // Tìm thông tin liên quan
        TicketType ticketType = ticketTypeService.findById(orderDTO.getTicketTypeId());
        User user = userService.findById(orderDTO.getUserId());
        eventService.findById(orderDTO.getEventId()); // Kiểm tra sự kiện tồn tại

        // Kiểm tra thời gian bán vé
        if (!ticketTypeService.isTicketSaleActive(ticketType)) {
            throw new RuntimeException("Ticket type " + ticketType.getType() + " is not available for sale at this time.");
        }

        // Kiểm tra số lượng vé hợp lệ
        if (!ticketTypeService.isValidQuantityForOrder(ticketType, orderDTO.getQuantity())) {
            throw new RuntimeException("Requested quantity exceeds available tickets or max per order limit for ticket type: " + ticketType.getType());
        }

        // Tạo đơn hàng
        Order order = new Order();
        order.setOrderId(UUID.randomUUID().toString());
        order.setUser(user);
        order.setEvent(eventService.findById(orderDTO.getEventId()));
        order.setTicketType(ticketType);
        order.setQuantity(orderDTO.getQuantity());
        order.setPrice(new BigDecimal(ticketType.getPrice())); // Chuyển Integer sang BigDecimal
        order.setDiscount(orderDTO.getDiscount() != null ? orderDTO.getDiscount() : BigDecimal.ZERO);
        order.setTotalAmount(new BigDecimal(ticketType.getPrice())
                .multiply(BigDecimal.valueOf(orderDTO.getQuantity()))
                .subtract(order.getDiscount()));
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING"); // Trạng thái ban đầu là PENDING
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setPaymentStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    @Transactional
    public void confirmOrderAndCreateTickets(String orderId) {
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not completed: " + orderId));

        order.setStatus("COMPLETED"); // Cập nhật trạng thái thành COMPLETED
        order.setPaymentStatus("SUCCESS");
        order.setUpdatedAt(LocalDateTime.now());

        // Tạo vé tương ứng với quantity
        List<Ticket> tickets = new ArrayList<>();
        for (int i = 0; i < order.getQuantity(); i++) {
            Ticket ticket = new Ticket();
            ticket.setTicketId(UUID.randomUUID().toString());
            ticket.setTicketType(order.getTicketType());
            ticket.setEvent(order.getEvent());
            ticket.setUser(order.getUser());
            ticket.setStatus("ACTIVE");
            ticket.setPurchaseDate(new Timestamp(System.currentTimeMillis()));
            tickets.add(ticket);
        }
        ticketRepository.saveAll(tickets);

        orderRepository.save(order);
    }
}