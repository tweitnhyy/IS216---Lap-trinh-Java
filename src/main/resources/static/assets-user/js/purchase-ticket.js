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
    const response = await fetchWithToken("/api/auth/user");
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

// ===== Login Popup Logic =====
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
    continueBtn.addEventListener("click", async () => {
      const emailInput = document.getElementById("emailInput").value;
      const passwordInput = document.getElementById("passwordInput").value;
      if (emailInput && passwordInput) {
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailInput, password: passwordInput }),
          });
          if (!response.ok) {
            throw new Error("Đăng nhập không thành công!");
          }
          const data = await response.json();
          localStorage.setItem("jwtToken", data.token);
          loginPopup.style.display = "none";
          window.location.href = redirectAfterLogin;
        } catch (error) {
          alert("Đăng nhập thất bại: " + error.message);
        }
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

    resetPasswordBtn.addEventListener("click", async () => {
      const forgotEmail = document.getElementById("forgotEmailInput").value;
      if (forgotEmail) {
        try {
          const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: forgotEmail }),
          });
          if (!response.ok) {
            throw new Error("Gửi yêu cầu đặt lại mật khẩu thất bại!");
          }
          alert("Yêu cầu đặt lại mật khẩu đã được gửi đến " + forgotEmail);
          forgotPasswordPopup.style.display = "none";
          loginPopup.style.display = "flex";
        } catch (error) {
          alert("Lỗi: " + error.message);
        }
      } else {
        alert("Vui lòng nhập email!");
      }
    });

    signupBtn.addEventListener("click", async () => {
      const signupEmail = document.getElementById("signupEmailInput").value;
      const signupPassword = document.getElementById("signupPasswordInput").value;
      const signupConfirmPassword = document.getElementById("signupConfirmPasswordInput").value;

      if (signupEmail && signupPassword && signupConfirmPassword) {
        if (signupPassword === signupConfirmPassword) {
          try {
            const response = await fetch("/api/auth/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: signupEmail, password: signupPassword }),
            });
            if (!response.ok) {
              throw new Error("Đăng ký không thành công!");
            }
            alert("Tài khoản cho " + signupEmail + " đã được tạo thành công!");
            signupPopup.style.display = "none";
            loginPopup.style.display = "flex";
          } catch (error) {
            alert("Đăng ký thất bại: " + error.message);
          }
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
        toggleBtn.setAttribute("aria-label", isPwd ? "Ẩn mật khẩu" : "Hiển thị mật khẩu");
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
        signupToggleBtn.setAttribute("aria-label", isPwd ? "Ẩn mật khẩu" : "Hiển thị mật khẩu");
      });
    }
  }
});

// Main ticket purchase logic
(async () => {
  // Check login status
  const isLoggedIn = await checkLoginStatus();
  if (!isLoggedIn) {
    alert("Vui lòng đăng nhập để mua vé!");
    window.location.href = "/";
    return;
  }

  // Get user information
  let userData;
  try {
    const response = await fetchWithToken("/api/auth/user");
    if (!response.ok) {
      throw new Error(`Lỗi khi lấy thông tin người dùng: ${response.status}`);
    }
    userData = await response.json();
    if (!userData.userId) {
      throw new Error("Không tìm thấy userId trong thông tin người dùng");
    }
  } catch (err) {
    console.error("Lỗi lấy thông tin người dùng:", err);
    alert("Có lỗi xảy ra khi lấy thông tin người dùng. Vui lòng đăng nhập lại!");
    localStorage.removeItem("jwtToken");
    window.location.href = "/";
    return;
  }

  // Check if user info is complete
  const isUserInfoComplete = userData.fullName && userData.email && userData.phoneNumber;
  const nextStep1Button = document.getElementById("next-step-1");
  if (!isUserInfoComplete) {
    nextStep1Button.disabled = true;
    nextStep1Button.style.opacity = "0.5";
    nextStep1Button.style.cursor = "not-allowed";
    alert("Thông tin tài khoản của bạn chưa đầy đủ (họ tên, email, số điện thoại). Vui lòng cập nhật thông tin trước khi mua vé!");
    return;
  }

  // Get eventId from URL
  const params = new URLSearchParams(location.search);
  const eventId = params.get("eventId");
  if (!eventId) {
    console.error("Không tìm thấy eventId");
    alert("Không tìm thấy sự kiện!");
    window.location.href = "/";
    return;
  }

  // Fetch event data
  let event;
  try {
    const res = await fetch(`/api/events/no-auth/${eventId}`);
    if (!res.ok) {
      throw new Error(`Lỗi khi tải dữ liệu sự kiện: ${res.status}`);
    }
    event = await res.json();
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu sự kiện:", err);
    alert("Không thể tải thông tin sự kiện. Vui lòng thử lại!");
    window.location.href = "/";
    return;
  }

  // Display event information
  document.getElementById("event-title").textContent = event.title;
  document.getElementById("event-date-time").textContent = new Date(event.startDateTime).toLocaleString("vi-VN");
  document.getElementById("event-location").textContent = event.location;

  // Display ticket selection
  const ticketSelectionBody = document.getElementById("ticket-selection-body");
  const totalPriceEl = document.getElementById("total-price");
  let totalPrice = 0;
  let selectedTicket = null;
  let selectedQuantity = 0;

  event.tickets.forEach((ticket, index) => {
    const tr = document.createElement("tr");
    const now = new Date();
    const saleStart = ticket.ticketSaleStart ? new Date(ticket.ticketSaleStart) : null;
    const saleEnd = ticket.ticketSaleEnd ? new Date(ticket.ticketSaleEnd) : null;
    const isSaleActive = (!saleStart || saleStart <= now) && (!saleEnd || saleEnd >= now);

    if (ticket.quantity > 0 && isSaleActive) {
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
          <input type="number" value="0" min="0" max="${Math.min(ticket.maxPerOrder || 10, ticket.quantity)}" readonly />
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
        updateTicketSelectors(index, value);
      }
    });

    increaseBtn.addEventListener("click", () => {
      let value = parseInt(input.value);
      const maxAllowed = Math.min(ticket.maxPerOrder || 10, ticket.quantity);
      if (value < maxAllowed) {
        value++;
        input.value = value;
        selectedQuantity = value;
        selectedTicket = ticket;
        totalPrice = value * ticket.price;
        totalPriceEl.textContent = `${totalPrice.toLocaleString()}đ`;
        updateTicketSelectors(index, value);
      }
    });
  });

  // Disable other ticket types when one is selected
  const updateTicketSelectors = (selectedIndex, selectedValue) => {
    const selectors = document.querySelectorAll(".quantity-selector");
    selectors.forEach((selector, index) => {
      if (index !== selectedIndex) {
        const input = selector.querySelector("input");
        const decreaseBtn = selector.querySelector(".decrease");
        const increaseBtn = selector.querySelector(".increase");
        input.value = 0;
        decreaseBtn.disabled = selectedValue > 0;
        increaseBtn.disabled = selectedValue > 0;
        selector.style.opacity = selectedValue > 0 ? "0.5" : "1";
      }
    });
  };

  // Manage payment steps
  let currentStep = 1;
  const steps = document.querySelectorAll(".progress-steps .step");
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
    document.getElementById("buyer-name").value = userData.fullName || "";
    document.getElementById("buyer-email").value = userData.email || "";
    document.getElementById("buyer-phone").value = userData.phoneNumber || "";
    document.getElementById("buyer-name").setAttribute("readonly", true);
    document.getElementById("buyer-email").setAttribute("readonly", true);
    document.getElementById("buyer-phone").setAttribute("readonly", true);
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
    document.getElementById("confirm-event-title").textContent = event.title;
    document.getElementById("confirm-ticket-type").textContent = selectedTicket.type;
    document.getElementById("confirm-ticket-quantity").textContent = selectedQuantity;
    document.getElementById("confirm-total-price").textContent = `${totalPrice.toLocaleString()}đ`;
    document.getElementById("confirm-buyer-name").textContent = document.getElementById("buyer-name").value;
    document.getElementById("confirm-buyer-email").textContent = document.getElementById("buyer-email").value;
    document.getElementById("confirm-buyer-phone").textContent = document.getElementById("buyer-phone").value;
    document.getElementById("confirm-payment-method").textContent = paymentMethod === "vnpay" ? "Thanh toán qua VNPay" : "Thanh toán qua Momo";
    updateStep(4);
  });

  // Step 4 -> Step 3
  document.getElementById("prev-step-4").addEventListener("click", () => {
    updateStep(3);
  });

  // Confirm order
  document.getElementById("confirm-order").addEventListener("click", async () => {
    if (!selectedTicket || !userData.userId) {
      alert("Thông tin đơn hàng hoặc người dùng không hợp lệ!");
      return;
    }

    // Fetch ticketTypeId
    let ticketTypeId;
    try {
      const res = await fetch(`/api/ticket-types?eventId=${eventId}&type=${encodeURIComponent(selectedTicket.type)}`);
      if (!res.ok) {
        throw new Error(`Lỗi khi lấy ticketTypeId: ${res.status}`);
      }
      const ticketType = await res.json();
      ticketTypeId = ticketType.ticketTypeId;
      if (!ticketTypeId) {
        throw new Error("Không tìm thấy ticketTypeId");
      }
    } catch (err) {
      console.error("Lỗi khi lấy ticketTypeId:", err);
      alert("Không thể xác định loại vé. Vui lòng thử lại!");
      return;
    }

    const orderData = {
      userId: userData.userId,
      eventId: eventId,
      ticketTypeId: ticketTypeId,
      quantity: selectedQuantity,
      price: selectedTicket.price,
      discount: 0,
      paymentMethod: paymentMethod.toUpperCase(),
    };

    try {
      // Create order
      const createResponse = await fetchWithToken("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.errorMessage || `Lỗi khi tạo đơn hàng: ${createResponse.status}`);
      }

      const createResult = await createResponse.json();
      const orderId = createResult.orderId;

      // Confirm order
      const confirmResponse = await fetchWithToken(`/api/payment/confirm-order?orderId=${orderId}`, {
        method: "POST",
      });

      if (!confirmResponse.ok) {
        const errorData = await confirmResponse.json();
        throw new Error(errorData.errorMessage || `Lỗi khi xác nhận đơn hàng: ${confirmResponse.status}`);
      }

      const confirmResult = await confirmResponse.json();
      alert(confirmResult.errorMessage || "Đơn hàng đã được xác nhận thành công! Vé đã được tạo.");
      window.location.href = "/order-success?orderId=" + orderId;
    } catch (err) {
      console.error("Lỗi khi xác nhận đơn hàng:", err);
      if (err.message.includes("exceeds available tickets")) {
        alert("Không đủ vé khả dụng! Vui lòng thử lại.");
        location.reload();
      } else if (err.message.includes("not available for sale")) {
        alert("Loại vé này hiện không được bán!");
        location.reload();
      } else {
        alert("Có lỗi xảy ra khi tạo hoặc xác nhận đơn hàng: " + err.message);
      }
    }
  });
})();