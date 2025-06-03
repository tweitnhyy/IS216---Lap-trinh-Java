package com.example.webve.dto;

import lombok.Data;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Data
public class EventDTO {
    private String eventId;
    private String title;
    private String userId;
    private String format; // Hình thức sự kiện (offline/online)
    private String location; // Gộp số nhà, đường, phường/xã, quận/huyện, tên địa điểm
    private String city; // Tỉnh/Thành để truy vấn
    private Timestamp startDateTime; // Gộp ngày & giờ bắt đầu
    private Timestamp endDateTime; // Gộp ngày & giờ kết thúc
    private Timestamp ticketSaleStart; // Thời gian mở bán vé chung cho sự kiện
    private Timestamp ticketSaleEnd; // Thời gian đóng bán vé chung cho sự kiện
    private String poster;
    private String posterSub;
    private String video;
    private String description; // Gộp mô tả sự kiện và sơ đồ chỗ ngồi
    private String organizerName;
    private String organizerLogo;
    private String organizerDescription;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private List<TicketTypeDTO> tickets; // Thêm trường này để chứa danh sách vé
}