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

// Hàm hiển thị popup đăng nhập
const showLoginPopup = () => {
  const popup = document.getElementById("loginPopup");
  if (popup) {
    popup.style.display = "flex";
  }
};
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
// Không cần thêm vì đã xử lí ở file html
document.addEventListener("DOMContentLoaded", async() => {
  // Khai báo các phần tử DOM
  const loginPopup = document.getElementById("loginPopup");
  const loginBtn = document.getElementById("loginBtn");
  const createEventBtn = document.getElementById("createEventBtn");
  const promoCreateEventBtn = document.getElementById("promoCreateEventBtn");
  const closeLoginPopup = document.getElementById("closePopup"); // Sửa ID để khớp với HTML

  const forgotPasswordPopup = document.getElementById("forgotPasswordPopup");
  const signupPopup = document.getElementById("signupPopup");
  const closeForgotPopup = document.getElementById("closeForgotPopup");
  const closeSignupPopup = document.getElementById("closeSignupPopup");
  const continueBtn = document.getElementById("continueBtn");
  const forgotPasswordLink = document.querySelector(".forgot-password"); // Sử dụng class thay vì ID
  const signupLink = document.querySelector(".signup-link a"); // Sử dụng class và thẻ a
  const backToLogin = document.getElementById("backToLogin");
  const backToLoginFromSignup = document.getElementById("backToLoginFromSignup");
  const resetPasswordBtn = document.getElementById("resetPasswordBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  let redirectAfterLogin = "/"; // Mặc định chuyển hướng về trang chính
  const isLoggedIn = await checkLoginStatus()
  if(!isLoggedIn) {
    loginPopup.style.display = "flex";
    console.log("Chưa đăng nhập, hãy đăng nhâp!!");
  }
  else
  {
    loginPopup.style.display = "none";
  }

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
  if (loginPopup && loginBtn && createEventBtn && promoCreateEventBtn && closeLoginPopup) {
    // Mở popup khi nhấn "Login"
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      redirectAfterLogin = "/";
      loginPopup.style.display = "flex";
      console.log("Login button clicked, popup should be visible");
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
      promoCreateEventBtn: !!promoCreateEventBtn,
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
                      window.location.reload();
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

    // Toggle mật khẩu cho đăng ký
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
    console.warn("Một hoặc nhiều phần tử popup liên quan không được tìm thấy, nhưng popup chính vẫn hoạt động.");
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

// preview ảnh & video
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll('.upload-area input[type="file"]')
    .forEach((input) => {
      const area = input.closest(".upload-area");
      const previewList = area.querySelector(".preview-list");

      input.addEventListener("change", (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        // Nếu là logo/seatmap/org-logo chỉ set background
        if (["logo", "seatmap", "org-logo"].includes(area.dataset.type)) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            area.style.backgroundImage = `url(${ev.target.result})`;
            area.classList.add("has-image");
          };
          reader.readAsDataURL(files[0]);
        }

        // Luôn clear và render lại preview-list
        previewList.innerHTML = "";
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            if (area.dataset.type === "video") {
              const video = document.createElement("video");
              video.src = ev.target.result;
              video.controls = true;
              previewList.appendChild(video);
            } else {
              const img = document.createElement("img");
              img.src = ev.target.result;
              previewList.appendChild(img);
            }
          };
          reader.readAsDataURL(file);
        });
      });
    });
});

// xử lí tạo vé
document.addEventListener("DOMContentLoaded", () => {
  const ticketsContainer = document.getElementById("tickets-container");
  const addBtn = document.getElementById("add-ticket-btn");

  function renumberTickets() {
    ticketsContainer.querySelectorAll(".ticket-item").forEach((item, i) => {
      const idx = i + 1;
      item.querySelectorAll("[id]").forEach((el) => {
        const base = el.id.replace(/-\d+$/, "");
        el.id = `${base}-${idx}`;
      });
      item.querySelectorAll("label[for]").forEach((lbl) => {
        const base = lbl.htmlFor.replace(/-\d+$/, "");
        lbl.htmlFor = `${base}-${idx}`;
      });
    });
  }

  function updateRemoveButtons() {
    const items = ticketsContainer.querySelectorAll(".ticket-item");
    items.forEach((item) => {
      const btn = item.querySelector(".remove-ticket-btn");
      btn.style.display = items.length > 1 ? "block" : "none";
    });
  }

  function updateDividers() {
    ticketsContainer
      .querySelectorAll(".ticket-divider")
      .forEach((hr) => hr.remove());
    const items = ticketsContainer.querySelectorAll(".ticket-item");
    items.forEach((item, idx) => {
      if (idx < items.length - 1) {
        const hr = document.createElement("hr");
        hr.className = "ticket-divider";
        item.insertAdjacentElement("afterend", hr);
      }
    });
  }

  // Khởi tạo
  renumberTickets();
  updateRemoveButtons();
  updateDividers();

  // Thêm vé
  addBtn.addEventListener("click", () => {
    const firstItem = ticketsContainer.querySelector(".ticket-item");
    const newItem = firstItem.cloneNode(true);
    newItem.querySelectorAll("input").forEach((el) => (el.value = ""));

    ticketsContainer.appendChild(newItem);

    renumberTickets();
    updateRemoveButtons();
    updateDividers();

    newItem.scrollIntoView({ behavior: "smooth" });
  });

  // Xóa vé (delegate)
  ticketsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-ticket-btn");
    if (!btn) return;

    const item = btn.closest(".ticket-item");
    item.remove();

    // Cập nhật
    renumberTickets();
    updateRemoveButtons();
    updateDividers();

    // Cuộn lên đầu section "Tạo vé", trừ header 81px
    const ticketSection = ticketsContainer.parentElement;
    const rect = ticketSection.getBoundingClientRect();
    const scrollY = window.pageYOffset + rect.top - 90;
    window.scrollTo({ top: scrollY, behavior: "smooth" });
  });
});

// Nút back & next
// document.addEventListener("DOMContentLoaded", () => {
//   const formSteps = document.querySelectorAll(".form-step");
//   const wizSteps = document.querySelectorAll(".wizard-step");
//   let currentStep = 1;

//   function showStep(step) {
//     formSteps[currentStep - 1].classList.remove("active");
//     wizSteps[currentStep - 1].classList.remove("active");
//     currentStep = step;
//     formSteps[currentStep - 1].classList.add("active");
//     wizSteps[currentStep - 1].classList.add("active");
//     document
//       .querySelectorAll(".btn-prev")
//       .forEach(
//         (b) => (b.style.display = currentStep > 1 ? "inline-flex" : "none")
//       );
//     document
//       .querySelectorAll(".btn-next")
//       .forEach(
//         (b) =>
//           (b.style.display =
//             currentStep < formSteps.length ? "inline-flex" : "none")
//       );
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }

//   function nextStep() {
//     if (currentStep < formSteps.length) showStep(currentStep + 1);
//   }
//   function prevStep() {
//     if (currentStep > 1) showStep(currentStep - 1);
//   }

//   // gắn listener cho _tất cả_ Prev/Next
//   document
//     .querySelectorAll(".btn-next")
//     .forEach((b) => b.addEventListener("click", nextStep));
//   document
//     .querySelectorAll(".btn-prev")
//     .forEach((b) => b.addEventListener("click", prevStep));

//   // khởi tạo step đầu
//   showStep(1);
// });
document.addEventListener("DOMContentLoaded", () => {
  const formSteps = document.querySelectorAll(".form-step");
  const wizardSteps = document.querySelectorAll(".wizard-step");
  const wizLine = document.querySelector(".wizard-steps");
  let currentStep = 1;

  function showStep(step) {
    formSteps[currentStep - 1].classList.remove("active");
    wizardSteps[currentStep - 1].classList.remove("active");

    currentStep = step;
    formSteps[currentStep - 1].classList.add("active");
    wizardSteps[currentStep - 1].classList.add("active");

    wizardSteps.forEach((el, idx) => {
      if (idx < currentStep - 1) el.classList.add("completed");
      else el.classList.remove("completed");
    });

    wizLine.classList.remove("step-1", "step-2", "step-3");
    wizLine.classList.add(`step-${currentStep}`);

    document
      .querySelectorAll(".btn-prev")
      .forEach(
        (b) => (b.style.display = currentStep > 1 ? "inline-flex" : "none")
      );
    document
      .querySelectorAll(".btn-next")
      .forEach(
        (b) =>
          (b.style.display =
            currentStep < formSteps.length ? "inline-flex" : "none")
      );

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // gán listener Prev/Next
  document.querySelectorAll(".btn-next").forEach((b) =>
    b.addEventListener("click", () => {
      if (currentStep < formSteps.length) showStep(currentStep + 1);
    })
  );
  document.querySelectorAll(".btn-prev").forEach((b) =>
    b.addEventListener("click", () => {
      if (currentStep > 1) showStep(currentStep - 1);
    })
  );

  // lần đầu hiển thị
  showStep(1);
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn-confirm").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      // tạo vòng tròn
      const circle = document.createElement("span");
      circle.classList.add("ripple");
      // tính kích thước
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${size}px`;
      // đặt tâm vòng tròn tại vị trí click
      circle.style.left = `${e.clientX - rect.left - size / 2}px`;
      circle.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });
});
