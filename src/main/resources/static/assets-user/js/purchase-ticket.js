// ===== Header Scroll Effect =====
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

// ===== Login Popup Logic (tương tự event-detail.js) =====
document.addEventListener("DOMContentLoaded", () => {
  const loginPopup = document.getElementById("loginPopup");
  const loginBtn = document.getElementById("loginBtn");
  const createEventBtn = document.getElementById("createEventBtn");
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

  let redirectAfterLogin = "/";

  if (loginPopup && loginBtn && createEventBtn && closeLoginPopup) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      redirectAfterLogin = "/";
      loginPopup.style.display = "flex";
    });

    createEventBtn.addEventListener("click", (e) => {
      e.preventDefault();
      redirectAfterLogin = "/create-event";
      loginPopup.style.display = "flex";
    });

    closeLoginPopup.addEventListener("click", () => {
      loginPopup.style.display = "none";
    });

    loginPopup.addEventListener("click", (e) => {
      if (e.target === loginPopup) {
        loginPopup.style.display = "none";
      }
    });
  }

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

    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginPopup.style.display = "none";
      forgotPasswordPopup.style.display = "flex";
    });

    signupLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginPopup.style.display = "none";
      signupPopup.style.display = "flex";
    });

    closeForgotPopup.addEventListener("click", () => {
      forgotPasswordPopup.style.display = "none";
    });

    closeSignupPopup.addEventListener("click", () => {
      signupPopup.style.display = "none";
    });

    forgotPasswordPopup.addEventListener("click", (e) => {
      if (e.target === forgotPasswordPopup) {
        forgotPasswordPopup.style.display = "none";
      }
    });

    signupPopup.addEventListener("click", (e) => {
      if (e.target === signupPopup) {
        signupPopup.style.display = "none";
      }
    });

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

    backToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      forgotPasswordPopup.style.display = "none";
      loginPopup.style.display = "flex";
    });

    backToLoginFromSignup.addEventListener("click", (e) => {
      e.preventDefault();
      signupPopup.style.display = "none";
      loginPopup.style.display = "flex";
    });

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
  }
});

// ===== Purchase Ticket Logic =====
(async () => {
  // 1. Lấy eventId từ URL
  const params = new URLSearchParams(location.search);
  const eventId = params.get("eventId");
  if (!eventId) {
    console.error("Không tìm thấy eventId");
    return;
  }

  // 2. Lấy dữ liệu sự kiện từ file JSON
  let events;
  try {
    const res = await fetch("/upload/event-detail-data.txt");
    const text = await res.text();
    events = JSON.parse(text);
  } catch (err) {
    console.error("Lỗi khi tải hoặc parse JSON:", err);
    return;
  }

  const ev = events.find((e) => e.id === eventId);
  if (!ev) {
    console.error("Không tìm thấy sự kiện:", eventId);
    return;
  }

  // 3. Hiển thị thông tin sự kiện
  document.getElementById("event-title").textContent = ev.title;
  document.getElementById("event-date-time").textContent = `${ev.event_info.time}, ${ev.event_info.date}`;
  document.getElementById("event-location").textContent = ev.event_info.location;

  // 4. Hiển thị danh sách vé để chọn (Step 1)
  const ticketSelectionBody = document.getElementById("ticket-selection-body");
  const totalPriceEl = document.getElementById("total-price");
  let totalPrice = 0;
  let selectedTicket = null;
  let selectedQuantity = 0;

  ev.tickets.forEach((ticket, index) => {
    const tr = document.createElement("tr");
    if (ticket.quantity > 0) {
      tr.classList.add("ticket-available");
    } else {
      tr.classList.add("ticket-soldout");
      tr.innerHTML = `
        <td>${ticket.type}</td>
        <td class="ticket-price">${ticket.price.toLocaleString()}đ <span class="sold-out">Hết vé</span></td>
        <td>-</td>
      `;
      ticketSelectionBody.appendChild(tr);
      return;
    }

    tr.innerHTML = `
      <td>${ticket.type}</td>
      <td class="ticket-price">${ticket.price.toLocaleString()}đ</td>
      <td>
        <div class="quantity-selector" data-ticket-index="${index}">
          <button class="decrease">-</button>
          <input type="number" value="0" min="0" max="${ticket.quantity}" readonly />
          <button class="increase">+</button>
        </div>
      </td>
    `;
    ticketSelectionBody.appendChild(tr);

    const quantitySelector = tr.querySelector(".quantity-selector");
    const input = quantitySelector.querySelector("input");
    const decreaseBtn = quantitySelector.querySelector(".decrease");
    const increaseBtn = quantitySelector.querySelector(".increase");

    decreaseBtn.addEventListener("click", () => {
      let value = parseInt(input.value);
      if (value > 0) {
        value--;
        input.value = value;
        selectedQuantity = value;
        selectedTicket = value > 0 ? ticket : null;
        totalPrice = value * ticket.price;
        totalPriceEl.textContent = `${totalPrice.toLocaleString()}đ`;
      }
    });

    increaseBtn.addEventListener("click", () => {
      let value = parseInt(input.value);
      if (value < ticket.quantity) {
        value++;
        input.value = value;
        selectedQuantity = value;
        selectedTicket = ticket;
        totalPrice = value * ticket.price;
        totalPriceEl.textContent = `${totalPrice.toLocaleString()}đ`;
      }
    });
  });

  // 5. Quản lý các bước thanh toán
  let currentStep = 1;
  const steps = document.querySelectorAll(".step");
  const stepContents = document.querySelectorAll(".step-content");

  const updateStep = (step) => {
    steps.forEach((s) => s.classList.remove("active"));
    stepContents.forEach((c) => c.classList.remove("active"));

    steps[step - 1].classList.add("active");
    stepContents[step - 1].classList.add("active");
    currentStep = step;
  };

  // Step 1 -> Step 2
  document.getElementById("next-step-1").addEventListener("click", () => {
    if (!selectedTicket || selectedQuantity === 0) {
      alert("Vui lòng chọn ít nhất một vé!");
      return;
    }
    updateStep(2);
  });

  // Step 2 -> Step 1
  document.getElementById("prev-step-2").addEventListener("click", () => {
    updateStep(1);
  });

  // Step 2 -> Step 3
  document.getElementById("next-step-2").addEventListener("click", () => {
    const buyerName = document.getElementById("buyer-name").value;
    const buyerEmail = document.getElementById("buyer-email").value;
    const buyerPhone = document.getElementById("buyer-phone").value;

    if (!buyerName || !buyerEmail || !buyerPhone) {
      alert("Vui lòng điền đầy đủ thông tin người mua!");
      return;
    }

    updateStep(3);
  });

  // Step 3 -> Step 2
  document.getElementById("prev-step-3").addEventListener("click", () => {
    updateStep(2);
  });

  // Step 3 -> Step 4
  document.getElementById("next-step-3").addEventListener("click", () => {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    // Hiển thị thông tin xác nhận
    document.getElementById("confirm-event-title").textContent = ev.title;
    document.getElementById("confirm-ticket-type").textContent = selectedTicket.type;
    document.getElementById("confirm-ticket-quantity").textContent = selectedQuantity;
    document.getElementById("confirm-total-price").textContent = `${totalPrice.toLocaleString()}đ`;
    document.getElementById("confirm-buyer-name").textContent = document.getElementById("buyer-name").value;
    document.getElementById("confirm-buyer-email").textContent = document.getElementById("buyer-email").value;
    document.getElementById("confirm-buyer-phone").textContent = document.getElementById("buyer-phone").value;
    document.getElementById("confirm-payment-method").textContent = paymentMethod === "momo" ? "Thanh toán qua Momo" : "Thẻ tín dụng";

    updateStep(4);
  });

  // Step 4 -> Step 3
  document.getElementById("prev-step-4").addEventListener("click", () => {
    updateStep(3);
  });

  // Xác nhận đơn hàng
  document.getElementById("confirm-order").addEventListener("click", () => {
    alert("Đơn hàng của bạn đã được xác nhận thành công! Vui lòng kiểm tra email để nhận vé.");
    window.location.href = "/";
  });
})();

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