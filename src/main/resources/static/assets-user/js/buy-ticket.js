document.addEventListener("DOMContentLoaded", () => {
    const ticketTrack = document.getElementById("ticketTrack");
    const dateFilter = document.querySelector(".date-filter");
    const locationFilter = document.querySelector(".location-filter");
    let allEvents = [];
  
    fetch("../assets/data/event-detail-data.txt")
      .then((response) => response.text())
      .then((text) => {
        allEvents = JSON.parse(text);
        renderTickets(allEvents);
  
        // Xử lý lọc theo ngày
        dateFilter.addEventListener("change", () => {
          let filteredEvents = [...allEvents];
          const dateValue = dateFilter.value;
  
          if (dateValue === "asc") {
            filteredEvents.sort((a, b) => new Date(a.event_info.date) - new Date(b.event_info.date));
          } else if (dateValue === "desc") {
            filteredEvents.sort((a, b) => new Date(b.event_info.date) - new Date(a.event_info.date));
          }
  
          const locationValue = locationFilter.value;
          if (locationValue) {
            filteredEvents = filteredEvents.filter(event => event.city === locationValue);
          }
  
          renderTickets(filteredEvents);
        });
  
        // Xử lý lọc theo địa điểm
        locationFilter.addEventListener("change", () => {
          let filteredEvents = [...allEvents];
          const locationValue = locationFilter.value;
  
          if (locationValue) {
            filteredEvents = filteredEvents.filter(event => event.city === locationValue);
          }
  
          const dateValue = dateFilter.value;
          if (dateValue === "asc") {
            filteredEvents.sort((a, b) => new Date(a.event_info.date) - new Date(b.event_info.date));
          } else if (dateValue === "desc") {
            filteredEvents.sort((a, b) => new Date(b.event_info.date) - new Date(a.event_info.date));
          }
  
          renderTickets(filteredEvents);
        });
      })
      .catch((error) => {
        console.error("Lỗi tải dữ liệu sự kiện:", error);
      });
  
    function renderTickets(events) {
      ticketTrack.innerHTML = "";
      events.forEach((event) => {
        const minPrice = Math.min(...event.tickets.map(ticket => ticket.price));
        const card = document.createElement("div");
        card.className = "ticket-card-wrapper";
        card.innerHTML = `
          <div class="ticket-card-image-wrapper">
            <div class="ticket-card-image">
              <img src="../${event.poster}" alt="${event.title}">
            </div>
          </div>
          <div class="ticket-card-footer">
            <div class="ticket-card-meta">
              <span class="event-title">${event.title}</span>
              <span class="event-info">${event.event_info.date} - ${event.city}</span>
              <span class="event-price">Giá: ${minPrice.toLocaleString()} VND</span>
              <button class="buy-ticket-btn">Mua vé ngay</button>
            </div>
          </div>
        `;
        card.addEventListener("click", (e) => {
          if (!e.target.classList.contains("buy-ticket-btn")) {
            window.open(`event-detail.html?eventId=${event.id}`, "_blank");
          }
        });
        ticketTrack.appendChild(card);
      });
    }
  });