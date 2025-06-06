//  ===== Header =====
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwtToken");
  console.log("Token:", token);

  if (!token && (window.location.pathname === "/create-event" || window.location.pathname === "/account" || window.location.pathname === "/account-ticket" || window.location.pathname === "/account-event")) {
    window.location.href = "/";
    return;
  }

  const headerGuest = document.getElementById("headerGuest");
  const headerUser  = document.getElementById("headerUser");

  if (!headerGuest && !headerUser) {
    console.error("Không tìm thấy #headerGuest và #headerUser trong DOM!");
    return;
  }

  // Bật headerUser nếu đã login (có token), ngược lại bật headerGuest
  let activeHeaderOuter;
  if (token) {
    headerUser.style.display  = "block";
    headerGuest.style.display = "none";
    activeHeaderOuter = headerUser;
  } else {
    headerGuest.style.display = "block";
    headerUser.style.display  = "none";
    activeHeaderOuter = headerGuest;
  }
  console.log("activeHeaderOuter =", activeHeaderOuter);

  // Bên trong thẻ outer (headerUser hoặc headerGuest), sẽ có 1 node con class="site-header"
  const activeHeaderInner = activeHeaderOuter.querySelector(".site-header");
  if (!activeHeaderInner) {
    console.warn("Không tìm thấy thẻ .site-header bên trong header đang hiển thị.");
    return;
  }

  // Lấy vị trí scroll ban đầu
  let lastScrollY = window.pageYOffset;

  // Gắn listener để ẩn/hiện header khi cuộn
  window.addEventListener("scroll", () => {
    const currentScrollY = window.pageYOffset;
    if (currentScrollY <= 0) {
      // Ở top page → luôn hiển thị
      activeHeaderInner.style.transform = "translateY(0)";
    } else if (currentScrollY > lastScrollY) {
      // Cuộn xuống → ẩn header (lên trên)
      activeHeaderInner.style.transform = "translateY(-100%)";
    } else {
      // Cuộn lên → hiện header
      activeHeaderInner.style.transform = "translateY(0)";
    }
    lastScrollY = currentScrollY;
  });
});

// ===== Login Popup and Related Popups =====
document.addEventListener("DOMContentLoaded", () => {
  const loginPopup            = document.getElementById("loginPopup");
  const loginBtn              = document.getElementById("loginBtn");
  const closeLoginPopup       = document.getElementById("closePopup");
  const createEventBtn        = document.getElementById("createEventBtn");
  const promoCreateEventBtn   = document.getElementById("promoCreateEventBtn");
  const forgotPasswordPopup   = document.getElementById("forgotPasswordPopup");
  const signupPopup           = document.getElementById("signupPopup");
  const closeForgotPopup      = document.getElementById("closeForgotPopup");
  const closeSignupPopup      = document.getElementById("closeSignupPopup");
  const continueBtn           = document.getElementById("continueBtn");
  const forgotPasswordLink    = document.querySelector(".forgot-password");
  const signupLink            = document.querySelector(".signup-link a");
  const backToLogin           = document.getElementById("backToLogin");
  const backToLoginFromSignup = document.getElementById("backToLoginFromSignup");
  const resetPasswordBtn      = document.getElementById("resetPasswordBtn");
  const signupBtn             = document.getElementById("signupBtn");
  const logoutBtn             = document.getElementById("logoutBtn");

  let redirectAfterLogin = "/"; // Mặc định chuyển hướng về trang chính

  // ==== 1) LOGOUT ====
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      fetchWithToken("/api/auth/logout", { method: "POST" })
        .then((response) => {
          if (response.ok) {
            // Logout thành công
            localStorage.removeItem("jwtToken");
            window.location.reload();
          } else if (response.status === 401) {
            localStorage.removeItem("jwtToken");
            window.location.href = "/";
          } else {
            return response.text().then((text) => {
              throw new Error(text || `Logout failed! Status: ${response.status}`);
            });
          }
        })
        .catch((error) => {
          console.error("Logout error:", error);
          alert("Đăng xuất thất bại: " + error.message);
        });
    });
  }

  // ==== 2) LOGIN & CLOSE POPUP ====
  if (loginBtn && loginPopup && closeLoginPopup) {
    // Khi nhấn “Login”
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      redirectAfterLogin = "/";
      loginPopup.style.display = "flex";
      console.log("Login button clicked, popup should be visible");
    });

    // Khi nhấn dấu “×” (đóng popup)
    closeLoginPopup.addEventListener("click", () => {
      loginPopup.style.display = "none";
    });

    // Khi click ra ngoài vùng nội dung popup → đóng popup
    loginPopup.addEventListener("click", (e) => {
      if (e.target === loginPopup) {
        loginPopup.style.display = "none";
      }
    });
  } else {
    console.warn("Không tìm thấy loginBtn hoặc loginPopup hoặc closeLoginPopup → bỏ qua logic Login.");
  }

  // ==== 3) EVENT DELEGATION CHO “TẠO SỰ KIỆN” VÀ “PROMO CREATE EVENT” ====
  document.addEventListener("click", (e) => {
    // Nếu click đến #createEventBtn
    const btn = e.target.closest("#createEventBtn");
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      btn.blur(); // ngăn CSS pseudo-element ::after giữ gạch chân
      const token = localStorage.getItem("jwtToken");
      if (token) {
        window.location.href = "/create-event";
      } else {
        redirectAfterLogin = "/create-event";
        if (loginPopup) loginPopup.style.display = "flex";
      }
      return;
    }

    // Nếu click đến #promoCreateEventBtn
    const promo = e.target.closest("#promoCreateEventBtn");
    if (promo) {
      e.preventDefault();
      e.stopPropagation();
      promo.blur();
      const token = localStorage.getItem("jwtToken");
      if (token) {
        window.location.href = "/create-event";
      } else {
        redirectAfterLogin = "/create-event";
        if (loginPopup) loginPopup.style.display = "flex";
      }
      return;
    }
  });

  // ==== 4) XỬ LÝ CÁC POPUP LIÊN QUAN (Quên mật khẩu, Đăng ký) ====
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
    // 4.1) Xử lý nút “Tiếp tục” (đăng nhập thật)
    continueBtn.addEventListener("click", () => {
      const email = document.getElementById("emailInput").value.trim();
      const password = document.getElementById("passwordInput").value;
      if (!email || !password) {
        alert("Vui lòng điền đầy đủ!");
        return;
      }
      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => {
          console.log("Login response:", res);
          if (!res.ok) return res.text().then((txt) => { throw new Error(txt); });
          return res.json();
        })
        .then((data) => {
          console.log("Login data:", data);
          const token = data.token;
          if (!token || token.split(".").length !== 3) {
            throw new Error("Token không hợp lệ");
          }
          localStorage.setItem("jwtToken", token);
          setTimeout(() => {
            checkLoginStatus()
              .then(() => {
                window.location.href = redirectAfterLogin;
              })
              .catch((err) => {
                console.error("Post-login check failed:", err);
                alert("Không thể xác thực tài khoản: " + err.message);
                window.location.href = "/";
              });
          }, 0);
        })
        .catch((err) => {
          console.error("Login error:", err);
          alert("Đăng nhập thất bại: " + err.message);
        });
    });

    // 4.2) Mở popup “Quên mật khẩu”
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginPopup.style.display = "none";
      forgotPasswordPopup.style.display = "flex";
    });
    closeForgotPopup.addEventListener("click", () => {
      forgotPasswordPopup.style.display = "none";
    });
    forgotPasswordPopup.addEventListener("click", (e) => {
      if (e.target === forgotPasswordPopup) {
        forgotPasswordPopup.style.display = "none";
      }
    });

    // 4.3) Mở popup “Tạo tài khoản”
    signupLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginPopup.style.display = "none";
      signupPopup.style.display = "flex";
    });
    closeSignupPopup.addEventListener("click", () => {
      signupPopup.style.display = "none";
    });
    signupPopup.addEventListener("click", (e) => {
      if (e.target === signupPopup) {
        signupPopup.style.display = "none";
      }
    });

    // 4.4) Xử lý gửi yêu cầu “Quên mật khẩu”
    resetPasswordBtn.addEventListener("click", () => {
      const forgotEmail = document.getElementById("forgotEmailInput").value.trim();
      if (!forgotEmail) {
        alert("Vui lòng nhập email!");
        return;
      }
      fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      })
        .then((res) => {
          if (res.ok) {
            alert("Yêu cầu đặt lại mật khẩu đã được gửi đến " + forgotEmail);
            forgotPasswordPopup.style.display = "none";
            loginPopup.style.display = "flex";
          } else if (res.status === 404) {
            alert("Email không tồn tại trong hệ thống.");
          } else {
            alert("Lỗi, vui lòng thử lại.");
          }
        })
        .catch((err) => {
          console.error("Forgot password error:", err);
          alert("Không thể kết nối tới máy chủ.");
        });
    });

    // 4.5) Xử lý Đăng ký (Sign up)
    signupBtn.addEventListener("click", () => {
      const signupEmail           = document.getElementById("signupEmailInput").value.trim();
      const signupPassword        = document.getElementById("signupPasswordInput").value;
      const signupConfirmPassword = document.getElementById("signupConfirmPasswordInput").value;
      if (!signupEmail || !signupPassword || !signupConfirmPassword) {
        alert("Điền đầy đủ!");
        return;
      }
      if (signupPassword !== signupConfirmPassword) {
        alert("Mật khẩu không khớp!");
        return;
      }
      const username = signupEmail.split("@")[0];
      fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email: signupEmail, password: signupPassword }),
      })
        .then((res) => {
          console.log("Signup response:", res);
          if (!res.ok) return res.text().then((txt) => { throw new Error(txt); });
          return res.text();
        })
        .then(() => {
          alert("Đăng ký thành công!");
          signupPopup.style.display = "none";
          loginPopup.style.display = "flex";
        })
        .catch((err) => {
          console.error("Signup error:", err);
          alert("Đăng ký thất bại: " + err.message);
        });
    });

    // 4.6) Quay lại từ “Quên mật khẩu” hoặc “Tạo tài khoản”
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

    // 4.7) Toggle hiển thị/ẩn mật khẩu (đăng nhập)
    const pwdInput  = document.getElementById("passwordInput");
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

    // 4.8) Toggle hiển thị/ẩn mật khẩu (đăng ký)
    const signupPwdInput        = document.getElementById("signupPasswordInput");
    const signupConfirmPwdInput = document.getElementById("signupConfirmPasswordInput");
    const signupToggleBtn       = document.querySelector(".toggle-signup-password");
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
  } else {
    console.warn("Một hoặc nhiều phần tử popup liên quan không được tìm thấy → bỏ qua phần xử lý Quên mật khẩu / Đăng ký.");
  }
});


// Hàm hỗ trợ fetch kèm Authorization header
const fetchWithToken = (url, options = {}) => {
  if (!options.headers) options.headers = {};
  const token = localStorage.getItem("jwtToken");
  if (token) options.headers["Authorization"] = `Bearer ${token}`;
  return fetch(url, options);
};

// Hàm kiểm tra login status (trả về Promise<boolean>)
const checkLoginStatus = async () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    console.log("Chưa đăng nhập (không có token).");
    return false;
  }
  try {
    const res = await fetch("/api/auth/user", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      console.log("Token không hợp lệ hoặc đã hết hạn.");
      localStorage.removeItem("jwtToken");
      return false;
    }
    console.log("Đã đăng nhập.");
    return true;
  } catch (err) {
    console.error("Lỗi khi kiểm tra login status:", err);
    return false;
  }
};


document.addEventListener("DOMContentLoaded", () => {
  // Xử lý dropdown avatar
  const avatarWrap = document.querySelector(".avatar-dropdown");
  if (avatarWrap) {
    const menu = avatarWrap.querySelector(".dropdown-menu");

    // Toggle dropdown khi click vào avatar
    avatarWrap.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("show");
    });

    // Đóng dropdown khi click ra ngoài
    document.addEventListener("click", (e) => {
      if (!avatarWrap.contains(e.target)) {
        menu.classList.remove("show");
      }
    });

    // Đóng dropdown khi cuộn trang
    window.addEventListener("scroll", () => {
      menu.classList.remove("show");
    });
  }
});