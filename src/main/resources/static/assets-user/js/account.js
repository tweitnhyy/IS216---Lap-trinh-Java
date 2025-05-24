// xử lí header
document.addEventListener("DOMContentLoaded", () => {
  let lastScrollY = window.pageYOffset;
  const header = document.querySelector(".site-header");

  window.addEventListener("scroll", () => {
    const currentScrollY = window.pageYOffset;

    if (currentScrollY <= 0) {
      header.style.transform = "translateY(0)";
    } else if (currentScrollY > lastScrollY) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }

    lastScrollY = currentScrollY;
  });
});

// xử lí dropdown của avatar
document.addEventListener("DOMContentLoaded", () => {
  const avatarWrap = document.querySelector(".avatar-dropdown");
  if (!avatarWrap) return;
  const menu = avatarWrap.querySelector(".dropdown-menu");

  avatarWrap.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!avatarWrap.contains(e.target)) {
      menu.classList.remove("show");
    }
  });
});

document.querySelectorAll(".btn-save").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";
    this.appendChild(ripple);
    // remove sau khi animation hoàn tất
    setTimeout(() => ripple.remove(), 600);
  });
});

// ===== ACOUNT-TICKET =====
document.addEventListener("DOMContentLoaded", () => {
  fetch("/upload/event-detail-data.txt")
    .then((res) =>
      res.ok ? res.json() : Promise.reject("Không load được data")
    )
    .then((events) => {
      const grid = document.querySelector(".tickets-grid");
      events.forEach((ev) => {
        const card = document.createElement("div");
        const raw = ev.poster_sub || ev.poster;
        const imgPath = "../" + raw;
        card.className = "ticket-card";
        card.innerHTML = `
          <div class="card-image">
            <img src="${imgPath}" alt="${ev.title || ""}" />
          </div>
          <div class="card-details">
            <h3>${ev.title || ""}</h3>
            <ul class="ticket-info">
              <li>
                <span class="material-symbols-rounded">event</span>
                ${ev.event_info?.date || ""}${
          ev.event_info?.time ? ", " + ev.event_info.time : ""
        }
              </li>
              <li>
                <span class="material-symbols-rounded">location_on</span>
                ${ev.event_info?.location || ""}
              </li>
              <li>
                <span class="material-symbols-rounded">qr_code</span>
                ${ev["ticket-id"] || ""}
              </li>
              <li>
                <span class="material-symbols-rounded">confirmation_number</span>
                ${ev.type || ""}
              </li>
              <li>
                <span class="material-symbols-rounded">paid</span>
                ${ev.price ? ev.price + " VNĐ" : ""}
              </li>
            </ul>
            <button class="btn-details">Xem chi tiết</button>
          </div>
        `;
        grid.appendChild(card);
      });
    })
    .catch((err) => console.error(err));
});

// ===== ACOUNT-EVENT =====
document.addEventListener("DOMContentLoaded", () => {
  const currentDate = new Date("2025-05-11"); // Ngày hiện tại: 11/05/2025
  const eventsGrid = document.querySelector(".events-grid");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Fetch và phân loại dữ liệu
  fetch("/upload/event-detail-data.txt")
    .then((res) =>
      res.ok ? res.json() : Promise.reject("Không load được data")
    )
    .then((events) => {
      const categorizedEvents = {
        upcoming: [],
        past: [],
        pending: [],
        draft: [],
      };

      events.forEach((event) => {
        const eventDate = new Date(event.event_info.date);
        const eventId = event.id.toLowerCase();

        if (eventId.includes("babymonster") || eventId.includes("jack")) {
          categorizedEvents.pending.push(event); // Giả định "Chờ duyệt"
        } else if (eventId.includes("kara") || eventId.includes("aespa")) {
          categorizedEvents.draft.push(event); // Giả định "Nháp"
        } else {
          if (eventDate >= currentDate) {
            categorizedEvents.upcoming.push(event); // Sắp tới
          } else {
            categorizedEvents.past.push(event); // Đã qua
          }
        }
      });

      // Hàm render sự kiện
      function renderEvents(filter = "upcoming") {
        eventsGrid.innerHTML = "";
        const eventsToShow = categorizedEvents[filter] || [];

        if (eventsToShow.length === 0) {
          eventsGrid.innerHTML = `<p style="text-align: center;">Không có sự kiện ${filter === "upcoming" ? "sắp tới" : filter === "past" ? "đã qua" : filter === "pending" ? "chờ duyệt" : "nháp"}.</p>`;
          return;
        }

        eventsToShow.forEach((event) => {
          const card = document.createElement("div");
          const imgPath = "../" + (event.poster_sub || event.poster);
          card.className = "event-card";
          card.innerHTML = `
            <div class="card-image">
              <img src="${imgPath}" alt="${event.title || ""}" />
            </div>
            <div class="card-details">
              <h3>${event.title || ""}</h3>
              <ul class="event-info">
                <li>
                  <span class="material-symbols-rounded">event</span>
                  ${event.event_info?.date || ""}${
            event.event_info?.time ? ", " + event.event_info.time : ""
          }
                </li>
                <li>
                  <span class="material-symbols-rounded">location_on</span>
                  ${event.event_info?.location || ""}
                </li>
                <li>
                  <span class="material-symbols-rounded">person</span>
                  ${event.host || ""}
                </li>
                <li>
                  <span class="material-symbols-rounded">paid</span>
                  ${event.tickets && event.tickets[0]?.price ? event.tickets[0].price + " VNĐ" : ""}
                </li>
              </ul>
              
            </div>
          `;
          eventsGrid.appendChild(card);
        });
      }

      //<button class="btn-manage">Quản lý</button>

      // Xử lý filter buttons
      filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
          filterButtons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");
          const filter = button.textContent.toLowerCase().replace(" ", "");
          renderEvents(filter);
        });
      });

      // Render mặc định cho "Sắp tới"
      renderEvents("upcoming");
    })
    .catch((err) => console.error(err));
});
