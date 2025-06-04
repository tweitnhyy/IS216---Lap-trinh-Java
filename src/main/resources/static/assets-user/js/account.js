document.addEventListener('DOMContentLoaded', async function() {
  // Kiểm tra trạng thái đăng nhập
  const isLoggedIn = await checkLoginStatus();
  if (!isLoggedIn) {
    window.location.href = '/'; // Điều chỉnh URL nếu cần
    return;
  }

  // Hàm lấy thông tin người dùng
  async function fetchUserInfo() {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch("/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }

      const userData = await response.json();
      populateForm(userData);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      alert('Không thể tải thông tin người dùng. Vui lòng thử lại.');
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDTO)
      });

      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }

      const updatedUser = await response.json();
      alert('Cập nhật thông tin thành công!');
      populateForm(updatedUser); // Cập nhật lại form với dữ liệu mới
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      alert('Cập nhật thông tin thất bại. Vui lòng thử lại.');
    }
  }

  // Khởi tạo: Lấy thông tin người dùng khi tải trang
  fetchUserInfo();

  // Thêm sự kiện cho nút Lưu
  const form = document.querySelector('.account-form');
  form.addEventListener('submit', updateUserProfile);
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

const fetchWithToken = (url, options = {}) => {
  if (!options.headers) options.headers = {};
  const token = localStorage.getItem("jwtToken");
  if (token) options.headers["Authorization"] = `Bearer ${token}`;
  return fetch(url, options);
};


const checkLoginStatus = async () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    console.log("Chưa đăng nhập (không có token).");
    return false;
  }
  try {
    const response = await fetch("/api/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) {
      console.log("Token không hợp lệ hoặc đã hết hạn.");
      localStorage.removeItem("jwtToken");
      return false;
    }
    console.log("Đã đăng nhập.");
    return true;
  } catch (error) {
    console.error("Lỗi kiểm tra đăng nhập:", error);
    return false;
  }
};