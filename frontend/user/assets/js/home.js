// ===== header =====
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

// ===== Login Popup and Related Popups =====
document.addEventListener("DOMContentLoaded", () => {
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

  let redirectAfterLogin = "home.html"; // Mặc định chuyển hướng về trang chính

  // Kiểm tra các phần tử cơ bản để mở popup
  if (loginPopup && loginBtn && createEventBtn && promoCreateEventBtn && closeLoginPopup) {
    // Mở popup khi nhấn "Login"
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      redirectAfterLogin = "home.html";
      loginPopup.style.display = "flex";
      console.log("Login button clicked, popup should be visible");
    });

    // Mở popup khi nhấn "Tạo sự kiện" trong header
    createEventBtn.addEventListener("click", (e) => {
      e.preventDefault();
      redirectAfterLogin = "pages/create-event.html";
      loginPopup.style.display = "flex";
      console.log("Create Event button clicked, popup should be visible");
    });

    // Mở popup khi nhấn "Tạo sự kiện" trong khung quảng cáo
    promoCreateEventBtn.addEventListener("click", (e) => {
      e.preventDefault();
      redirectAfterLogin = "pages/create-event.html";
      loginPopup.style.display = "flex";
      console.log("Promo Create Event button clicked, popup should be visible");
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

// ===== banner section =====
document.addEventListener("DOMContentLoaded", () => {
  const bannerVideo = document.getElementById("bannerVideo");
  const videoSource = bannerVideo.querySelector("source");
  const volumeToggle = document.getElementById("volumeToggle");
  const volumeIcon = volumeToggle.querySelector("span");
  const detailButton = document.getElementById("detailButton");
  const dots = document.querySelectorAll(".banner-dots .dot");

  let allEventData = [];
  let currentIndex = 0;

  const selectedIds = [
    "babymonster",
    "soobin-concert",
    "exid-live",
    "blackpink-encore",
  ];

  fetch("assets/data/event-detail-data.txt")
    .then((response) => response.text())
    .then((text) => {
      allEventData = JSON.parse(text);
      loadBanner(0);

      dots.forEach((dot) => {
        dot.addEventListener("click", () => {
          const index = parseInt(dot.dataset.index, 10);
          if (index !== currentIndex) {
            loadBanner(index);
          }
        });
      });
    })
    .catch((error) => {
      console.error("Lỗi khi tải file event data:", error);
    });

  function loadBanner(index) {
    const targetId = selectedIds[index];
    const eventItem = allEventData.find((event) => event.id === targetId);

    if (!eventItem) {
      console.error(`Không tìm thấy event với id: ${targetId}`);
      return;
    }

    if (videoSource) {
      videoSource.src = eventItem.video;
      bannerVideo.load();
    }

    bannerVideo.poster = eventItem.poster;
    bannerVideo.muted = true;
    volumeIcon.textContent = "volume_off";

    // Cập nhật href để mở tab mới
    detailButton.href = `pages/event-detail.html?eventId=${eventItem.id}`;
    detailButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(detailButton.href, "_blank");
    });

    dots.forEach((dot) => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");

    currentIndex = index;
  }

  volumeToggle.addEventListener("click", () => {
    bannerVideo.muted = !bannerVideo.muted;
    volumeIcon.textContent = bannerVideo.muted ? "volume_off" : "volume_up";
  });

  bannerVideo.addEventListener("mouseenter", () => {
    bannerVideo.play();
  });

  bannerVideo.addEventListener("mouseleave", () => {
    bannerVideo.pause();
  });
});

// ===== event upcoming section =====
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("eventGrid");
  const moreButtonWrapper = document.querySelector(".event-more-btn");
  const moreButton = document.querySelector(".event-more-btn .more-button");
  let buttonIcon = moreButton.querySelector(".button-icon");
  const buttonText = moreButton.querySelector(".button-text");
  const eventSection = document.querySelector(".event-upcoming-section");
  let allEvents = [];
  let displayedEvents = 6;
  const eventsPerLoad = 6;
  let isExpanded = false;
  const currentDate = new Date("2025-05-03"); // Ngày hiện tại

  if (
    !moreButton ||
    !moreButtonWrapper ||
    !buttonIcon ||
    !buttonText ||
    !eventSection
  ) {
    console.error(
      "Không tìm thấy nút 'Xem thêm', các thành phần của nó, hoặc section 'event-upcoming-section'."
    );
    return;
  }

  moreButtonWrapper.style.display = "block";

  fetch("assets/data/event-detail-data.txt")
    .then((response) => response.text())
    .then((text) => {
      allEvents = JSON.parse(text);

      // Lọc các sự kiện có ngày diễn ra trong tương lai
      allEvents = allEvents.filter((event) => {
        const eventDate = new Date(event.event_info.date);
        return eventDate >= currentDate;
      });

      // Sắp xếp theo ngày tăng dần (gần nhất trước)
      allEvents.sort((a, b) => {
        const dateA = new Date(a.event_info.date);
        const dateB = new Date(b.event_info.date);
        return dateA - dateB;
      });

      console.log(
        `Đã tải ${allEvents.length} sự kiện từ event-detail-data.txt (Sự kiện sắp tới)`
      );

      const renderEvents = (eventList) => {
        container.innerHTML = "";
        eventList.forEach((event) => {
          const eventDate = new Date(event.event_info.date);
          const month = eventDate
            .toLocaleString("default", { month: "short" })
            .toUpperCase();
          const day = eventDate.getDate();

          const card = document.createElement("div");
          card.className = "event-card";
          card.innerHTML = `
            <img src="${event.poster}" alt="${event.title}">
            <div class="event-info">
              <div class="event-date">
                <span class="month">${month}</span>
                <br/>
                <span class="day">${day}</span>
              </div>
              <div class="event-text">
                <h3 class="event-title">${event.title}</h3>
                <p class="event-desc">${event.intro}</p>
              </div>
            </div>
          `;
          card.addEventListener("click", () => {
            window.open(
              `pages/event-detail.html?eventId=${event.id}`,
              "_blank"
            );
          });
          container.appendChild(card);
        });
      };

      const initialEvents = allEvents.slice(0, displayedEvents);
      renderEvents(initialEvents);

      if (allEvents.length <= eventsPerLoad) {
        moreButtonWrapper.style.display = "none";
      } else {
        moreButtonWrapper.style.display = "block";
      }

      moreButton.addEventListener("click", () => {
        if (!isExpanded) {
          renderEvents(allEvents);

          const newIconExpand = document.createElement("span");
          newIconExpand.className = "material-symbols-rounded button-icon";
          newIconExpand.textContent = "expand_less";
          buttonIcon.replaceWith(newIconExpand);
          buttonIcon = newIconExpand;

          buttonText.textContent = "Thu gọn";
          moreButton.classList.add("collapsed");
          isExpanded = true;
        } else {
          const initialEvents = allEvents.slice(0, displayedEvents);
          renderEvents(initialEvents);

          const newIconCollapse = document.createElement("span");
          newIconCollapse.className = "material-symbols-rounded button-icon";
          newIconCollapse.textContent = "expand_more";
          buttonIcon.replaceWith(newIconCollapse);
          buttonIcon = newIconCollapse;

          buttonText.textContent = "Xem thêm";
          moreButton.classList.remove("collapsed");

          eventSection.scrollIntoView({ behavior: "smooth", block: "start" });

          isExpanded = false;
        }
      });
    })
    .catch((error) => {
      console.error("Lỗi tải dữ liệu sự kiện sắp diễn ra:", error);
      moreButtonWrapper.style.display = "block";
    });
});

// ===== promotional section =====
const promoBtn = document.querySelector(".promo-button");

promoBtn.addEventListener("mouseenter", () => {
  // Hiệu ứng confetti trung tâm
  confetti({
    particleCount: 80,
    spread: 90,
    origin: { y: 0.6 },
    colors: ["#ff0a54", "#ff477e", "#ff7096", "#ff85a1", "#fbb1bd"],
    scalar: 1.2,
  });

  // Hiệu ứng nổ pháo bên trái
  confetti({
    particleCount: 50,
    angle: 60, // Điều chỉnh góc để nổ lệch sang trái
    spread: 60,
    origin: { x: 0.2, y: 0.6 }, // Vị trí lệch sang trái
    colors: ["#ff0a54", "#ff477e", "#ffd700", "#ffeb3b"],
    shapes: ["circle", "star"],
    scalar: 1.5,
    drift: 0.1,
  });

  // Hiệu ứng nổ pháo bên phải
  confetti({
    particleCount: 50,
    angle: 120, // Điều chỉnh góc để nổ lệch sang phải
    spread: 60,
    origin: { x: 0.8, y: 0.6 }, // Vị trí lệch sang phải
    colors: ["#ff0a54", "#ff477e", "#ffd700", "#ffeb3b"],
    shapes: ["circle", "star"],
    scalar: 1.5,
    drift: 0.1,
  });
});

// ===== event trend section =====
document.addEventListener("DOMContentLoaded", async () => {
  const track = document.getElementById("carouselTrack");
  const nextBtn = document.querySelector(
    ".event-trend-section .carousel-nav.next"
  );
  const prevBtn = document.querySelector(
    ".event-trend-section .carousel-nav.prev"
  );
  let scrollPosition = 0;
  const cardWidth = 230;
  const gap = 16;
  const cardsToScroll = 3;
  const scrollAmount = (cardWidth + gap) * cardsToScroll;
  const currentDate = new Date("2025-05-01");

  try {
    const response = await fetch("assets/data/event-detail-data.txt");
    let trendEvents = await response.json();

    trendEvents.sort((a, b) => {
      const dateA = new Date(a.event_info.date);
      const dateB = new Date(b.event_info.date);
      return Math.abs(dateA - currentDate) - Math.abs(dateB - currentDate);
    });

    trendEvents = trendEvents.slice(0, 10);

    trendEvents.forEach((event, i) => {
      const card = document.createElement("div");
      card.className = "trend-card-wrapper";
      card.innerHTML = `
        <div class="trend-card-image-wrapper">
          <div class="trend-card-image">
            <img src="${event.poster_sub}" alt="${event.title}" />
          </div>
        </div>
        <div class="trend-card-footer">
          <div class="trend-card-index">${i + 1}</div>
          <div class="trend-card-meta">
            <span>${event.title}</span>
            <span>${event.event_info.date}</span>
          </div>
        </div>
      `;
      card.addEventListener("click", () => {
        window.open(`pages/event-detail.html?eventId=${event.id}`, "_blank");
      });
      track.appendChild(card);

      // Thêm class .opposite-frame cho các rank 2, 4, 6, 8, 10 sau khi append
      if ((i + 1) % 2 === 0) {
        card.querySelector(".trend-card-image").classList.add("opposite-frame");
      }
    });

    const maxScroll = track.scrollWidth - track.clientWidth;
    nextBtn.addEventListener("click", () => {
      scrollPosition += scrollAmount;
      if (scrollPosition > maxScroll) scrollPosition = maxScroll;
      track.scrollTo({ left: scrollPosition, behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
      scrollPosition -= scrollAmount;
      if (scrollPosition < 0) scrollPosition = 0;
      track.scrollTo({ left: scrollPosition, behavior: "smooth" });
    });
  } catch (error) {
    console.error("Lỗi tải dữ liệu sự kiện xu hướng:", error);
  }
});

// ===== event special section =====
document.addEventListener("DOMContentLoaded", async () => {
  const track = document.getElementById("specialTrack");
  const nextBtn = document.querySelector(
    ".event-special-section .carousel-nav.next"
  );
  const prevBtn = document.querySelector(
    ".event-special-section .carousel-nav.prev"
  );
  let scrollPosition = 0;
  const cardWidth = 270;
  const gap = 16;
  const cardsToScroll = 3;
  const scrollAmount = (cardWidth + gap) * cardsToScroll;

  try {
    const response = await fetch("assets/data/event-detail-data.txt");
    let events = await response.json();

    events = events.filter((event) => {
      return event.tickets.some(
        (ticket) =>
          ticket.type.toLowerCase().includes("vip") || ticket.price >= 5000000
      );
    });

    events.sort((a, b) => {
      const maxPriceA = Math.max(...a.tickets.map((t) => t.price));
      const maxPriceB = Math.max(...b.tickets.map((t) => t.price));
      return maxPriceB - maxPriceA;
    });

    events = events.slice(0, 5);

    events.forEach((event) => {
      const card = document.createElement("div");
      card.className = "trend-card-wrapper";
      card.innerHTML = `
        <img src="${event.poster}" alt="${event.title}" class="main-banner" />
        <img src="${event.poster_sub}" alt="${event.title}" class="sub-poster" />
        <div class="trend-caption">
          <div class="trend-title">${event.title}</div>
          <div class="trend-date">${event.event_info.date}</div>
        </div>
      `;
      card.addEventListener("click", () => {
        window.open(`pages/event-detail.html?eventId=${event.id}`, "_blank");
      });
      track.appendChild(card);
    });

    const maxScroll = track.scrollWidth - track.clientWidth;
    nextBtn.addEventListener("click", () => {
      scrollPosition += scrollAmount;
      if (scrollPosition > maxScroll) scrollPosition = maxScroll;
      track.scrollTo({ left: scrollPosition, behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
      scrollPosition -= scrollAmount;
      if (scrollPosition < 0) scrollPosition = 0;
      track.scrollTo({ left: scrollPosition, behavior: "smooth" });
    });
  } catch (error) {
    console.error("Lỗi tải dữ liệu sự kiện đặc biệt:", error);
  }
});
