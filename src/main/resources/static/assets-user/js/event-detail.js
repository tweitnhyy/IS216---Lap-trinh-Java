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

// ===== Header =====
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwtToken");
  console.warn("Token:", token);
  const headerUser = document.getElementById("headerUser");
  const headerGuest = document.getElementById("headerGuest");

  let activeHeader = document.querySelector('header');

  console.log("headerUser:", headerUser);
  console.log("headerGuest:", headerGuest);
  console.log("activeHeader:", activeHeader);

  if (headerUser && headerGuest) {
    if (token) {
      headerUser.style.display = "block";
      headerGuest.style.display = "none";
    } else {
      headerUser.style.display = "none";
      headerGuest.style.display = "block";
    }
  } else {
    console.warn("Không tìm thấy headerUser hoặc headerGuest trong DOM. Vui lòng kiểm tra ID trong HTML!");
  }

  if (activeHeader) {
    let lastScrollY = window.pageYOffset;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.pageYOffset;

      if (currentScrollY <= 0) {
        activeHeader.style.transform = "translateY(0)";
      } else if (currentScrollY > lastScrollY) {
        activeHeader.style.transform = "translateY(-100%)";
      } else {
        activeHeader.style.transform = "translateY(0)";
      }
      lastScrollY = currentScrollY;
    });
  } else {
    console.warn("Không tìm thấy phần tử 'activeHeader' để thực hiện hiệu ứng cuộn.");
  }
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
  const logoutBtn = document.getElementById("logoutBtn");

  let redirectAfterLogin = "/"; // Mặc định chuyển hướng về trang chính


  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    redirectAfterLogin = "/";
    fetchWithToken("/api/auth/logout", { method: "POST" })
        .then(response => {
          console.log("Logout response:", response);
          if (!response.ok) throw new Error(`Logout failed! Status: ${response.status}`);
          localStorage.removeItem("jwtToken");
          window.location.reload();
        })
        .catch(error => {
          console.error("Logout error:", error);
          alert("Đăng xuất thất bại: " + error.message);
        });
  });
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
      const token = localStorage.getItem("jwtToken");
      if (token) {
        window.location.href = "/create-event";
      }
      else {
        redirectAfterLogin = "/create-event";
        loginPopup.style.display = "flex";
        console.log("Create Event button clicked, popup should be visible");
      }
    });

    // Mở popup khi nhấn "Mua vé ngay"
    buyTicketBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const eventId = new URLSearchParams(location.search).get("eventId");
      const redirectUrl = eventId ? `/purchase-ticket?eventId=${eventId}` : "/purchase-ticket";

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

      // Kiểm tra trạng thái đăng nhập
      const isLoggedIn = await checkLoginStatus();
      if (isLoggedIn) {
        // Nếu đã đăng nhập, chuyển hướng trực tiếp đến trang mua vé
        window.location.href = redirectUrl;
      } else {
        // Nếu chưa đăng nhập, hiển thị popup đăng nhập
        redirectAfterLogin = redirectUrl;
        loginPopup.style.display = "flex";
      }
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
      const email = document.getElementById("emailInput").value.trim();
      const password = document.getElementById("passwordInput").value;
      if (email && password) {
        fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
            .then(response => {
              console.log("Login response:", response);
              if (!response.ok) return response.text().then(text => { throw new Error(`Status: ${response.status}, Message: ${text}`); });
              return response.json();
            })
            .then(data => {
              console.log("Login data:", data);
              const token = data.token;
              if (!token || token.split(".").length !== 3) throw new Error("Invalid token format");
              localStorage.setItem("jwtToken", token);
              setTimeout(() => {
                checkLoginStatus()
                    .then(() => {
                      window.location.href = redirectAfterLogin;
                    })
                    .catch(error => {
                      console.error("Post-login check failed:", error);
                      alert("Không thể xác thực tài khoản: " + error.message);
                      window.location.href = "/";
                    });
              }, 0);
            })
            .catch(error => {
              console.error("Login error:", error);
              alert("Đăng nhập thất bại: " + error.message);
            });
      } else alert("Vui lòng điền đầy đủ!");
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
      const forgotEmail = document.getElementById("forgotEmailInput").value.trim();
      if (!forgotEmail) {
        alert("Vui lòng nhập email!");
        return;
      }

      fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: forgotEmail })
      })
          .then(response => {
            if (response.ok) {
              alert("Yêu cầu đặt lại mật khẩu đã được gửi đến " + forgotEmail);
              forgotPasswordPopup.style.display = "none";
              loginPopup.style.display = "flex";
            } else if (response.status === 404) {
              alert("Email không tồn tại trong hệ thống.");
            } else {
              alert("Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.");
            }
          })
          .catch(error => {
            console.error("Lỗi khi gửi yêu cầu forgot password:", error);
            alert("Không thể kết nối tới máy chủ.");
          });
    });

    // Xử lý đăng ký tài khoản (ảo)
    signupBtn.addEventListener("click", () => {
      const signupEmail = document.getElementById("signupEmailInput").value;
      const signupPassword = document.getElementById("signupPasswordInput").value;
      const signupConfirmPassword = document.getElementById("signupConfirmPasswordInput").value;

      if (signupEmail && signupPassword && signupConfirmPassword) {
        if (signupPassword === signupConfirmPassword) {
          const username = signupEmail.split("@")[0];
          fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email: signupEmail, password: signupPassword }),
          })

              .then(response => {
                console.log("Signup response:", response);
                if (!response.ok) return response.text().then(text => { throw new Error(`Status: ${response.status}, Message: ${text}`); });
                return response.text();
              })
              .then(() => {
                alert("Đăng ký thành công!");
                signupPopup.style.display = "none";
                loginPopup.style.display = "flex";
              })
              .catch(error => {
                console.error("Signup error:", error);
                alert("Đăng ký thất bại: " + error.message);
              });
        } else alert("Mật khẩu không khớp!");
      } else alert("Điền đầy đủ!");
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
