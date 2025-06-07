// Hàm chuyển đổi JSON từ backend thành định dạng mã gốc mong đợi
function transformEventData(json) {
  // Tách danh sách trải nghiệm đặc biệt từ description
  const descriptionLines = json.description.split("\n");
  const specialExperienceIndex = descriptionLines.findIndex(line => line.includes("Special Experience"));
  const specialExperiences = specialExperienceIndex !== -1
    ? descriptionLines.slice(specialExperienceIndex + 2).filter(line => line.trim().startsWith("-")).map(line => line.trim().slice(2))
    : [];

  // Chuyển đổi ngày giờ UTC sang múi giờ Việt Nam (UTC+7)
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    date.setHours(date.getHours()); // Điều chỉnh cho múi giờ Việt Nam
    return {
      date: date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }),
      time: date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
  };

  const startDateTime = formatDateTime(json.startDateTime);
  const ticketSaleStart = formatDateTime(json.ticketSaleStart).date;
  const ticketSaleEnd = formatDateTime(json.ticketSaleEnd).date;

  return {
    id: json.eventId,
    title: json.title,
    poster: json.poster,
    intro: descriptionLines[0], // Lấy dòng đầu tiên làm phần giới thiệu
    event_info: {
      time: startDateTime.time,
      date: startDateTime.date,
      location: json.location,
    },
    city: json.city,
    special_experience: specialExperiences,
    organizer: {
      name: json.organizerName,
      logo: json.organizerLogo,
    },
    ticket_sale: {
      start_date: ticketSaleStart,
      end_date: ticketSaleEnd,
    },
    tickets: json.tickets.map(ticket => ({
      type: ticket.type,
      price: ticket.price,
      quantity: ticket.quantity,
    })),
    promotion: null, // JSON không chứa thông tin khuyến mãi
  };
}

// ===== Event Detail Content =====
(async () => {
  // Lấy eventId từ URL
  const params = new URLSearchParams(location.search);
  const eventId = params.get("eventId");
  if (!eventId) {
    console.error("Không tìm thấy eventId");
    document.getElementById("event-info-title").textContent = "Sự kiện không tồn tại.";
    return;
  }

  let event;
  try {
    // Gọi API để lấy dữ liệu sự kiện (thay thế cho file txt)
    const res = await fetch(`/api/events/no-auth/${eventId}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const rawData = await res.json();
    console.log("Raw payload:", rawData);

    // Chuyển đổi dữ liệu
    event = transformEventData(rawData);
    console.log("Transformed event:", event);
    document.title = event.title;
    const titleEl = document.querySelector("head title");
    if (titleEl) titleEl.textContent = event.title;
  } catch (err) {
    console.error("Lỗi khi tải hoặc xử lý JSON:", err);
    document.getElementById("event-info-title").textContent = "Không thể tải dữ liệu sự kiện.";
    return;
  }

  // Điền dữ liệu vào DOM
  document.getElementById("event-poster").src = event.poster;
  document.getElementById("event-info-title").textContent = event.title;
  document.getElementById("event-info-title").setAttribute("aria-label", `Sự kiện: ${event.title}`);
  document.getElementById("event-intro").textContent = event.intro;

  // Danh sách thông tin sự kiện
  const infoList = document.getElementById("event-info-list");
  infoList.innerHTML = "";
  [
    `Thời gian: ${event.event_info.time}, ${event.event_info.date}`,
    `Địa điểm: ${event.event_info.location}`,
    `Tỉnh/Thành phố: ${event.city}`,
  ].forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    infoList.appendChild(li);
  });

  // Trải nghiệm đặc biệt
  const expUl = document.getElementById("special-experience-list");
  expUl.innerHTML = "";
  event.special_experience.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    expUl.appendChild(li);
  });

  // Khuyến mãi
  const promoSec = document.getElementById("promotion-section");
  if (event.promotion && event.promotion.description) {
    document.getElementById("promotion-desc").textContent = event.promotion.description;
    document.getElementById("promotion-cond").textContent = `(${event.promotion.condition})`;
  } else {
    promoSec.style.display = "none";
  }

  // Đơn vị tổ chức
  document.getElementById("organizer-logo").src = event.organizer.logo;
  document.getElementById("organizer-logo").setAttribute("alt", `Logo của ${event.organizer.name}`);
  document.getElementById("organizer-name").textContent = event.organizer.name;

  // Quảng cáo (giữ nguyên mã gốc)
  const adEl = document.getElementById("event-ad");
  adEl.src = "/upload/other/qc-portrait.jpg";
  adEl.setAttribute("alt", "Quảng cáo sự kiện");
  document.querySelector(".event-info-right").style.display = "flex";

  // Bảng vé
  const saleTimeEl = document.getElementById("ticket-sale-time");
  saleTimeEl.textContent = `${event.ticket_sale.start_date} đến ${event.ticket_sale.end_date}`;

  const tbody = document.getElementById("tickets-body");
  tbody.innerHTML = "";
  event.tickets.forEach((t) => {
    const tr = document.createElement("tr");
    if (t.quantity > 0) {
      tr.classList.add("ticket-available");
    } else {
      tr.classList.add("ticket-soldout");
    }
    const soldOutBadge = t.quantity > 0 ? "" : '<span class="sold-out">Hết vé</span>';
    tr.innerHTML = `
      <td>${t.type}</td>
      <td class="ticket-price">${t.price.toLocaleString()}đ ${soldOutBadge}</td>
    `;
    tbody.appendChild(tr);
  });

  // Nút mua vé
  document.getElementById("buy-ticket-btn").href = `/purchase-ticket?eventId=${event.id}`;
  document.getElementById("buy-ticket-btn").setAttribute("aria-label", `Mua vé cho sự kiện ${event.title}`);

  // Chuyển đổi tab
  document.querySelectorAll(".event-tabs .tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelector(".event-tabs .tab.active").classList.remove("active");
      tab.classList.add("active");
      document.querySelector(".tab-content.active").classList.remove("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // ===== Event Suggestion Section =====
  const suggestionTrack = document.getElementById("suggestionTrack");
  const nextBtn = document.querySelector(".event-suggestion-section .carousel-nav.next");
  const prevBtn = document.querySelector(".event-suggestion-section .carousel-nav.prev");
  let scrollPosition = 0;
  const cardWidth = 270;
  const gap = 16;
  const cardsToScroll = 3;
  const scrollAmount = (cardWidth + gap) * cardsToScroll;

  let suggestedEvents;
  try {
    // Gọi API để lấy danh sách sự kiện gợi ý
    const res = await fetch("/api/events/no-auth/random");
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const events = await res.json();
    console.log("Danh sách sự kiện:", events);

    // Chuyển đổi dữ liệu
    const transformedEvents = events.map(transformEventData);

    // Lọc sự kiện gợi ý
    suggestedEvents = transformedEvents.filter((e) => e.city === event.city && e.id !== eventId);
    if (suggestedEvents.length < 5) {
      const otherEvents = transformedEvents.filter((e) => e.city !== event.city && e.id !== eventId);
      for (let i = otherEvents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [otherEvents[i], otherEvents[j]] = [otherEvents[j], otherEvents[i]];
      }
      suggestedEvents = [...suggestedEvents, ...otherEvents.slice(0, 5 - suggestedEvents.length)];
    }
    suggestedEvents = suggestedEvents.slice(0, 5);
  } catch (err) {
    console.error("Lỗi khi tải sự kiện gợi ý:", err);
    suggestionTrack.innerHTML = "<p>Không có sự kiện gợi ý nào.</p>";
    return;
  }

  // Hiển thị thẻ gợi ý
  if (suggestedEvents.length === 0) {
    suggestionTrack.innerHTML = "<p>Không có sự kiện gợi ý nào.</p>";
    return;
  }

  suggestedEvents.forEach((event) => {
    const card = document.createElement("div");
    card.className = "trend-card-wrapper";
    card.innerHTML = `
      <img src="${event.poster}" alt="${event.title}" />
      <div class="trend-caption">
        <div class="trend-title">${event.title}</div>
        <div class="trend-date">${event.event_info.date}</div>
      </div>
    `;
    card.addEventListener("click", () => {
      window.location.href = `/event-detail?eventId=${event.id}`;
    });
    card.setAttribute("aria-label", `Xem chi tiết sự kiện ${event.title}`);
    suggestionTrack.appendChild(card);
  });

  // Chức năng carousel
  const maxScroll = suggestionTrack.scrollWidth - suggestionTrack.clientWidth;
  nextBtn.addEventListener("click", () => {
    scrollPosition += scrollAmount;
    if (scrollPosition > maxScroll) scrollPosition = maxScroll;
    suggestionTrack.scrollTo({ left: scrollPosition, behavior: "smooth" });
  });
  prevBtn.addEventListener("click", () => {
    scrollPosition -= scrollAmount;
    if (scrollPosition < 0) scrollPosition = 0;
    suggestionTrack.scrollTo({ left: scrollPosition, behavior: "smooth" });
  });
})();

// ===== Buy Ticket Button =====
const btn = document.getElementById("buy-ticket-btn");
if (btn) {
  btn.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    this.appendChild(ripple);
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";
    ripple.addEventListener("animationend", () => ripple.remove());
  });
}