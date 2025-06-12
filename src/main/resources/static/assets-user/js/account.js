document.addEventListener('DOMContentLoaded', async function() {
  // Kiểm tra trạng thái đăng nhập
  const isLoggedIn = await checkLoginStatus();
  if (!isLoggedIn) {
    window.location.href = '/';
    return;
  }

  // Hàm lấy thông tin người dùng
  async function fetchUserInfo() {
    try {
      const response = await fetchWithToken("/api/auth/user");
      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }
      const userData = await response.json();
      populateForm(userData);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      console.error('Không thể tải thông tin người dùng. Vui lòng thử lại.');
    }
  }

  // Hàm điền dữ liệu vào form
  function populateForm(userData) {
    document.getElementById('fullName').value = userData.fullName || '';
    document.getElementById('phoneNumber').value = userData.phoneNumber || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('dob').value = userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : '';
    const genderRadios = document.getElementsByName('gender');
    for (const radio of genderRadios) {
      if (radio.value === userData.gender) {
        radio.checked = true;
      }
    }
  }

  // Hàm xử lý gửi form cập nhật
  async function updateUserProfile(event) {
    event.preventDefault();
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Vui lòng đăng nhập lại.');
      window.location.href = '/';
      return;
    }

    const userDTO = {
      fullName: document.getElementById('fullName').value,
      phoneNumber: document.getElementById('phoneNumber').value,
      email: document.getElementById('email').value,
      dob: document.getElementById('dob').value ? new Date(document.getElementById('dob').value).toISOString() : null,
      gender: document.querySelector('input[name="gender"]:checked')?.value || ''
    };

    try {
      const response = await fetchWithToken(`/api/auth/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDTO)
      });

      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }

      const updatedUser = await response.json();
      alert('Cập nhật thông tin thành công!');
      populateForm(updatedUser);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      alert('Cập nhật thông tin thất bại. Vui lòng thử lại.');
    }
  }

  // Trong account.js

// Hàm định dạng ngày giờ
  function formatDateTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Ho_Chi_Minh'
    });
  }

// ===== ACCOUNT-TICKET =====
  async function fetchAndRenderTickets(filter = "all") {
    const ticketsGrid = document.querySelector(".tickets-grid");
    try {
      const response = await fetchWithToken("/api/tickets/my-tickets");
      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }
      const tickets = await response.json();
      ticketsGrid.innerHTML = '';

      const filteredTickets = tickets.filter(ticket => {
        if (filter === "all") return true;
        return ticket.status.toLowerCase() === filter;
      });

      if (filteredTickets.length === 0) {
        const filterText = {
          all: "",
          approved: "đã duyệt",
          pending: "chờ xác nhận",
          canceled: "đã hủy"
        }[filter] || filter;
        ticketsGrid.innerHTML = `<p style="text-align: center; color: #666;">Không có vé ${filterText}.</p>`;
        return;
      }

      filteredTickets.forEach(ticket => {
        const card = document.createElement("div");
        card.className = "ticket-card";
        card.innerHTML = `
        <div class="card-image">
          <img src="${ticket.event?.posterSub || ticket.event?.poster || '/images/placeholder.jpg'}" alt="${ticket.eventTitle || 'Sự kiện không xác định'}" />
        </div>
        <div class="card-details">
          <h3>${ticket.eventTitle || 'Không có tiêu đề'}</h3>
          <ul class="ticket-info">
            <li>
              <span class="material-symbols-rounded">event</span>
              ${formatDateTime(ticket.event?.startDateTime) || 'Không có ngày'}
            </li>
            <li>
              <span class="material-symbols-rounded">location_on</span>
              ${ticket.event?.location || 'Không có địa điểm'}
            </li>
            <li>
              <span class="material-symbols-rounded">qr_code</span>
              ${ticket.ticketId || 'Không có mã'}
            </li>
            <li>
              <span class="material-symbols-rounded">confirmation_number</span>
              ${ticket.ticketTypeName || 'Không có hạng vé'}
            </li>
            <li>
              <span class="material-symbols-rounded">paid</span>
              ${ticket.ticketType?.price ? ticket.ticketType.price.toLocaleString('vi-VN') + ' VNĐ' : 'Miễn phí'}
            </li>
          </ul>
          <button class="btn-details">Xem chi tiết</button>
        </div>
      `;
        ticketsGrid.appendChild(card);
      });
    } catch (error) {
      console.error('Lỗi khi lấy vé:', error);
      ticketsGrid.innerHTML = `<p style="text-align: center; color: #666;">Lỗi khi tải vé. Vui lòng thử lại.</p>`;
    }
  }


// Khởi tạo
  if (document.querySelector(".tickets-grid")) {
    fetchAndRenderTickets("all");
    filterButtons.forEach(btn => {
      if (btn.textContent.toLowerCase().trim() === "tất cả") {
        btn.classList.add("active");
      }
    });
  }

  // ===== ACCOUNT-EVENT =====
  async function fetchAndRenderEvents(filter = "upcoming") {
    const eventsGrid = document.querySelector(".events-grid");
    try {
      const response = await fetchWithToken("/api/events/my-events");
      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }
      const events = await response.json();
      const currentDate = new Date();

      const categorizedEvents = {
        upcoming: [],
        past: [],
        pending: [],
        draft: []
      };

      events.forEach(event => {
        const eventDate = new Date(event.startDateTime);
        // Logic giả định cho pending và draft (cần điều chỉnh nếu có trường status)
        if (event.eventId.toLowerCase().includes("babymonster") || event.eventId.toLowerCase().includes("jack")) {
          categorizedEvents.pending.push(event);
        } else if (event.eventId.toLowerCase().includes("kara") || event.eventId.toLowerCase().includes("aespa")) {
          categorizedEvents.draft.push(event);
        } else {
          if (eventDate >= currentDate) {
            categorizedEvents.upcoming.push(event);
          } else {
            categorizedEvents.past.push(event);
          }
        }
      });

      eventsGrid.innerHTML = '';
      const eventsToShow = categorizedEvents[filter] || [];

      if (eventsToShow.length === 0) {
        eventsGrid.innerHTML = `<p style="text-align: center;">Không có sự kiện ${filter === "upcoming" ? "sắp tới" : filter === "past" ? "đã qua" : filter === "pending" ? "chờ duyệt" : "nháp"}.</p>`;
        return;
      }

      eventsToShow.forEach(event => {
        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
          <div class="card-image">
            <img src="${event.posterSub || event.poster || ''}" alt="${event.title || ''}" />
          </div>
          <div class="card-details">
            <h3>${event.title || ''}</h3>
            <ul class="event-info">
              <li>
                <span class="material-symbols-rounded">event</span>
                ${formatDateTime(event.startDateTime) || ''}
              </li>
              <li>
                <span class="material-symbols-rounded">location_on</span>
                ${event.location || ''}
              </li>
              <li>
                <span class="material-symbols-rounded">person</span>
                ${event.organizerName || ''}
              </li>
              <li>
                <span class="material-symbols-rounded">paid</span>
                ${event.tickets && event.tickets[0]?.price ? event.tickets[0].price + " VNĐ" : ''}
              </li>
            </ul>
            <button class="btn-manage" data-event-id="${event.eventId}">Quản lý</button>
          </div>
        `;
        eventsGrid.appendChild(card);

        // Thêm sự kiện click cho nút Quản lý
        card.querySelector(".btn-manage").addEventListener("click", () => {
          window.location.href = `/event-detail?eventId=${event.eventId}`;
        });
      });
    } catch (error) {
      console.error('Lỗi khi lấy sự kiện:', error);
      eventsGrid.innerHTML = `<p style="text-align: center;">Lỗi khi tải sự kiện. Vui lòng thử lại.</p>`;
    }
  }

  // Xử lý filter buttons
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      const filter = button.textContent.toLowerCase().replace(" ", "");
      if (document.querySelector(".events-grid")) {
        fetchAndRenderEvents(filter);
      } else if (document.querySelector(".tickets-grid")) {
        fetchAndRenderTickets(filter);
      }
    });
  });

  // Khởi tạo
  fetchUserInfo();
  if (document.querySelector(".events-grid")) {
    fetchAndRenderEvents("upcoming");
  }
  if (document.querySelector(".tickets-grid")) {
    fetchAndRenderTickets("all");
  }

  // Thêm sự kiện cho nút Lưu
  const form = document.querySelector('.account-form');
  if (form) {
    form.addEventListener('submit', updateUserProfile);
  }

  // Hiệu ứng ripple cho nút Lưu
  document.querySelectorAll(".btn-save").forEach(btn => {
    btn.addEventListener("click", function(e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
});