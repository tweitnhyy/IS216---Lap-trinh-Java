
// ===== header =====
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

// ===== Login Popup (cho cả header và nút "Mua vé ngay") =====
document.addEventListener("DOMContentLoaded", () => {
  // Khai báo các phần tử DOM
  const loginPopup = document.getElementById("loginPopup");
  const loginBtn = document.getElementById("loginBtn");
  const createEventBtn = document.getElementById("createEventBtn");
  const buyTicketBtn = document.getElementById("buy-ticket-btn");
  const closeLoginPopup = document.getElementById("closePopup");

  const forgotPasswordPopup = document.getElementById("forgotPasswordPopup");
  const signupPopup = document.getElementById("signupPopup");
  const closeForgotPopup = document.getElementById("closeForgotPopup");
  const closeSignupPopup = document.getElementById("closeSignupPopup");
  const continueBtn = document.getElementById("continueBtn");
  const forgotPasswordLink = document.querySelector(".forgot-password");
  const signupLink = document.querySelector(".signup-link a");
  const backToLogin = document.getElementById("backToLogin");
  const backToLoginFromSignup = document.getElementById("backToLoginFromSignup");
  const resetPasswordBtn = document.getElementById("resetPasswordBtn");
  const signupBtn = document.getElementById("signupBtn");

  let redirectAfterLogin = "/home"; // Mặc định chuyển hướng về trang chính

  // Kiểm tra các phần tử cơ bản để mở popup
  if (loginPopup && loginBtn && createEventBtn && closeLoginPopup && buyTicketBtn) {
    // Mở popup khi nhấn "Login"
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      redirectAfterLogin = "/";
      loginPopup.style.display = "flex";
      console.log("Login button clicked, popup should be visible");
    });

    // Mở popup khi nhấn "Tạo sự kiện" trong header
    createEventBtn.addEventListener("click", (e) => {
      e.preventDefault();
      redirectAfterLogin = "/create-event";
      loginPopup.style.display = "flex";
      console.log("Create Event button clicked, popup should be visible");
    });

    // Mở popup khi nhấn "Mua vé ngay"
    buyTicketBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const eventId = new URLSearchParams(location.search).get("eventId");
      redirectAfterLogin = eventId ? `/buy-ticket?eventId=${eventId}` : "/buy-ticket";
      loginPopup.style.display = "flex";

      // Hiệu ứng ripple
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      buyTicketBtn.appendChild(ripple);

      const rect = buyTicketBtn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";

      ripple.addEventListener("animationend", () => ripple.remove());
    });

    // Đóng popup đăng nhập khi nhấn "X"
    closeLoginPopup.addEventListener("click", () => {
      loginPopup.style.display = "none";
    });

    // Đóng popup khi nhấn ra ngoài nội dung popup
    loginPopup.addEventListener("click", (e) => {
      if (e.target === loginPopup) {
        loginPopup.style.display = "none";
      }
    });
  } else {
    console.error("Một hoặc nhiều phần tử cơ bản để mở popup không được tìm thấy!");
    console.log({
      loginPopup: !!loginPopup,
      loginBtn: !!loginBtn,
      createEventBtn: !!createEventBtn,
      buyTicketBtn: !!buyTicketBtn,
      closeLoginPopup: !!closeLoginPopup,
    });
  }

  // Xử lý các popup liên quan (Quên mật khẩu, Tạo tài khoản)
  if (
    forgotPasswordPopup &&
    signupPopup &&
    closeForgotPopup &&
    closeSignupPopup &&
    continueBtn &&
    forgotPasswordLink &&
    signupLink &&
    backToLogin &&
    backToLoginFromSignup &&
    resetPasswordBtn &&
    signupBtn
  ) {
    // Xử lý đăng nhập ảo
    continueBtn.addEventListener("click", () => {
      const emailInput = document.getElementById("emailInput").value;
      const passwordInput = document.getElementById("passwordInput").value;
      if (emailInput && passwordInput) {
        loginPopup.style.display = "none";
        window.location.href = redirectAfterLogin;
      } else {
        alert("Vui lòng điền đầy đủ email và mật khẩu!");
      }
    });

    // Mở popup "Quên mật khẩu"
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginPopup.style.display = "none";
      forgotPasswordPopup.style.display = "flex";
    });

    // Mở popup "Tạo tài khoản ngay"
    signupLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginPopup.style.display = "none";
      signupPopup.style.display = "flex";
    });

    // Đóng popup "Quên mật khẩu" khi nhấn "X"
    closeForgotPopup.addEventListener("click", () => {
      forgotPasswordPopup.style.display = "none";
    });

    // Đóng popup "Tạo tài khoản" khi nhấn "X"
    closeSignupPopup.addEventListener("click", () => {
      signupPopup.style.display = "none";
    });

    // Đóng popup "Quên mật khẩu" khi nhấn ra ngoài
    forgotPasswordPopup.addEventListener("click", (e) => {
      if (e.target === forgotPasswordPopup) {
        forgotPasswordPopup.style.display = "none";
      }
    });

    // Đóng popup "Tạo tài khoản" khi nhấn ra ngoài
    signupPopup.addEventListener("click", (e) => {
      if (e.target === signupPopup) {
        signupPopup.style.display = "none";
      }
    });

    // Xử lý gửi yêu cầu quên mật khẩu (ảo)
    resetPasswordBtn.addEventListener("click", () => {
      const forgotEmail = document.getElementById("forgotEmailInput").value;
      if (forgotEmail) {
        alert("Yêu cầu đặt lại mật khẩu đã được gửi đến " + forgotEmail);
        forgotPasswordPopup.style.display = "none";
        loginPopup.style.display = "flex";
      } else {
        alert("Vui lòng nhập email!");
      }
    });

    // Xử lý đăng ký tài khoản (ảo)
    signupBtn.addEventListener("click", () => {
      const signupEmail = document.getElementById("signupEmailInput").value;
      const signupPassword = document.getElementById("signupPasswordInput").value;
      const signupConfirmPassword = document.getElementById("signupConfirmPasswordInput").value;

      if (signupEmail && signupPassword && signupConfirmPassword) {
        if (signupPassword === signupConfirmPassword) {
          alert("Tài khoản cho " + signupEmail + " đã được tạo thành công!");
          signupPopup.style.display = "none";
          loginPopup.style.display = "flex";
        } else {
          alert("Mật khẩu và xác nhận mật khẩu không khớp!");
        }
      } else {
        alert("Vui lòng điền đầy đủ thông tin!");
      }
    });

    // Quay lại đăng nhập từ "Quên mật khẩu"
    backToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      forgotPasswordPopup.style.display = "none";
      loginPopup.style.display = "flex";
    });

    // Quay lại đăng nhập từ "Tạo tài khoản"
    backToLoginFromSignup.addEventListener("click", (e) => {
      e.preventDefault();
      signupPopup.style.display = "none";
      loginPopup.style.display = "flex";
    });

    // Toggle mật khẩu cho đăng nhập
    const pwdInput = document.getElementById("passwordInput");
    const toggleBtn = document.querySelector(".toggle-password");
    if (pwdInput && toggleBtn) {
      const icon = toggleBtn.querySelector(".material-symbols-rounded");
      toggleBtn.addEventListener("click", () => {
        const isPwd = pwdInput.type === "password";
        pwdInput.type = isPwd ? "text" : "password";
        icon.textContent = isPwd ? "visibility" : "visibility_off";
        toggleBtn.setAttribute(
          "aria-label",
          isPwd ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
        );
      });
    }

    // Toggle mật khẩu cho đăng ký (đồng bộ cả hai ô)
    const signupPwdInput = document.getElementById("signupPasswordInput");
    const signupConfirmPwdInput = document.getElementById("signupConfirmPasswordInput");
    const signupToggleBtn = document.querySelector(".toggle-signup-password");
    if (signupPwdInput && signupConfirmPwdInput && signupToggleBtn) {
      const signupIcon = signupToggleBtn.querySelector(".material-symbols-rounded");
      signupToggleBtn.addEventListener("click", () => {
        const isPwd = signupPwdInput.type === "password";
        signupPwdInput.type = isPwd ? "text" : "password";
        signupConfirmPwdInput.type = isPwd ? "text" : "password";
        signupIcon.textContent = isPwd ? "visibility" : "visibility_off";
        signupToggleBtn.setAttribute(
          "aria-label",
          isPwd ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
        );
      });
    }
  } else {
    console.warn("Một hoặc nhiều phần tử popup liên quan không được tìm thấy.");
    console.log({
      forgotPasswordPopup: !!forgotPasswordPopup,
      signupPopup: !!signupPopup,
      closeForgotPopup: !!closeForgotPopup,
      closeSignupPopup: !!closeSignupPopup,
      continueBtn: !!continueBtn,
      forgotPasswordLink: !!forgotPasswordLink,
      signupLink: !!signupLink,
      backToLogin: !!backToLogin,
      backToLoginFromSignup: !!backToLoginFromSignup,
      resetPasswordBtn: !!resetPasswordBtn,
      signupBtn: !!signupBtn,
    });
  }
});

// ===== event detail content =====
(async () => {
  // 1. Lấy eventId từ URL
  const params = new URLSearchParams(location.search);
  const eventId = params.get("eventId");
  if (!eventId) {
    console.error("Không tìm thấy eventId");
    return;
  }

  let events;
  try {
    const res = await fetch("/upload/event-detail-data.txt");
    console.log("Fetch status:", res.status, res.statusText);

    const text = await res.text();
    console.log("Raw payload:", text);

    events = JSON.parse(text);
    console.log("Parsed JSON:", events);
  } catch (err) {
    console.error("Lỗi khi tải hoặc parse JSON:", err);
    return;
  }

  const ev = events.find((e) => e.id === eventId);
  if (!ev) {
    console.error("Không tìm thấy sự kiện:", eventId);
    return;
  }

  document.getElementById("event-poster").src = `../${ev.poster}`;

  // 1. Tên
  document.getElementById("event-info-title").textContent = ev.title;

  // 2. Giới thiệu
  document.getElementById("event-intro").textContent = ev.intro;

  // 3. Thông tin sự kiện (date, time, location, city)
  const infoList = document.getElementById("event-info-list");
  infoList.innerHTML = "";
  [
    `Thời gian: ${ev.event_info.time}, ${ev.event_info.date} `,
    `Địa điểm: ${ev.event_info.location}`,
    `Thành phố: ${ev.city}`,
  ].forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    infoList.appendChild(li);
  });

  // 4. Trải nghiệm đặc biệt
  const expUl = document.getElementById("special-experience-list");
  expUl.innerHTML = "";
  ev.special_experience.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    expUl.appendChild(li);
  });

  // 5. Khuyến mãi (nếu có)
  const promoSec = document.getElementById("promotion-section");
  if (ev.promotion && ev.promotion.description) {
    document.getElementById("promotion-desc").textContent =
      ev.promotion.description;
    document.getElementById(
      "promotion-cond"
    ).textContent = `(${ev.promotion.condition})`;
  } else {
    promoSec.style.display = "none";
  }

  // 6. Ban tổ chức
  document.getElementById("organizer-logo").src = `../${ev.organizer.logo}`;
  document.getElementById("organizer-name").textContent = ev.organizer.name;

  // 7. Hình quảng cáo bên phải (hard-coded link)
  const adEl = document.getElementById("event-ad");
  adEl.src = "../assets/img/qcao.jpg";
  // Hiển thị quảng cáo
  document.querySelector(".event-info-right").style.display = "flex";

  // 9. Tickets table
  const saleTimeEl = document.getElementById("ticket-sale-time");
  saleTimeEl.textContent = `${ev.ticket_sale.start_date} đến ${ev.ticket_sale.end_date}`;

  const tbody = document.getElementById("tickets-body");
  tbody.innerHTML = "";
  ev.tickets.forEach((t) => {
    const tr = document.createElement("tr");
    if (t.quantity > 0) {
      tr.classList.add("ticket-available");
    } else {
      tr.classList.add("ticket-soldout");
    }

    const soldOutBadge =
      t.quantity > 0 ? "" : '<span class="sold-out">Hết vé</span>';
    tr.innerHTML = `
      <td>${t.type}</td>
      <td class="ticket-price">${t.price.toLocaleString()}đ ${soldOutBadge}</td>
    `;
    tbody.appendChild(tr);
  });

  // 10. Nút mua vé
  document.getElementById(
    "buy-ticket-btn"
  ).href = `/buy-ticket?eventId=${ev.id}`;

  // 11. Tab switcher
  document.querySelectorAll(".event-tabs .tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelector(".event-tabs .tab.active")
        .classList.remove("active");
      tab.classList.add("active");
      document.querySelector(".tab-content.active").classList.remove("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // ===== event suggetion section =====
  // 1. Lấy eventId từ URL
  if (!eventId) {
    console.error("Không tìm thấy eventId cho section Gợi ý");
    return;
  }

  // Lấy các phần tử DOM cho section Gợi ý
  const suggestionTrack = document.getElementById("suggestionTrack");
  const nextBtn = document.querySelector(
    ".event-suggestion-section .carousel-nav.next"
  );
  const prevBtn = document.querySelector(
    ".event-suggestion-section .carousel-nav.prev"
  );
  let scrollPosition = 0;
  const cardWidth = 270; // Width of each card
  const gap = 16; // Gap between cards
  const cardsToScroll = 3; // Number of cards to scroll at a time
  const scrollAmount = (cardWidth + gap) * cardsToScroll;

  // Lọc các sự kiện gợi ý
  // 1. Lấy các sự kiện cùng thành phố (trừ sự kiện hiện tại)
  let suggestedEvents = events.filter(
    (e) => e.city === ev.city && e.id !== eventId
  );

  // 2. Nếu không đủ 5 sự kiện, lấy thêm ngẫu nhiên từ các sự kiện khác
  if (suggestedEvents.length < 5) {
    const otherEvents = events.filter(
      (e) => e.city !== ev.city && e.id !== eventId
    );
    // Xáo trộn mảng otherEvents
    for (let i = otherEvents.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherEvents[i], otherEvents[j]] = [otherEvents[j], otherEvents[i]];
    }
    // Thêm đủ để có tối đa 5 sự kiện
    const additionalEvents = otherEvents.slice(0, 5 - suggestedEvents.length);
    suggestedEvents = [...suggestedEvents, ...additionalEvents];
  }

  // 3. Chỉ lấy tối đa 5 sự kiện
  suggestedEvents = suggestedEvents.slice(0, 5);

  // Render các sự kiện gợi ý
  suggestedEvents.forEach((event) => {
    const card = document.createElement("div");
    card.className = "trend-card-wrapper";
    card.innerHTML = `
      <img src="../${event.poster}" alt="${event.title}" />
      <div class="trend-caption">
        <div class="trend-title">${event.title}</div>
        <div class="trend-date">${event.event_info.date}</div>
      </div>
    `;
    card.addEventListener("click", () => {
      window.location.href = `/event-detail?eventId=${event.id}`;
    });
    suggestionTrack.appendChild(card);
  });

  // Thêm chức năng carousel
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

// ===== #buy-ticket-btn =====
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
