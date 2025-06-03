package com.example.webve.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class TicketTypeDTO {
    private String type; // Tên vé
    private Integer price; // Giá vé
    private Integer quantity; // Tổng số vé
    private Integer maxPerOrder; // Số vé tối đa / lượt order
    private Timestamp ticketSaleStart; // Thời gian mở bán vé riêng cho loại vé này
    private Timestamp ticketSaleEnd; // Thời gian đóng bán vé riêng cho loại vé này
    private Timestamp createdAt;
    private Timestamp updatedAt;
}