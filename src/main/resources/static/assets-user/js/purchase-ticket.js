const buyBtn = document.getElementById("buy-ticket-btn");
if (buyBtn) {
  buyBtn.addEventListener("click", function(e) {
    e.preventDefault();
    showNotificationPopup("Bạn cần hoàn thiện hồ sơ tài khoản trước khi mua vé!");
  });
}

// Main ticket purchase logic
(async () => {
  // Kiểm tra login
  const isLoggedIn = await checkLoginStatus();
  if (!isLoggedIn) {
    alert("Vui lòng đăng nhập để mua vé!");
    window.location.href = "/";
    return;
  }

  // Lấy thông tin người dùng
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

  // Kiểm tra hồ sơ người dùng
  const isUserInfoComplete = userData.fullName && userData.email && userData.phoneNumber;
  const nextStep1Button = document.getElementById("next-step-1");
  if (!isUserInfoComplete) {
    nextStep1Button.disabled = true;
    nextStep1Button.style.opacity = "0.5";
    nextStep1Button.style.cursor = "not-allowed";
    showNotificationPopup(
      "Bạn cần hoàn thiện hồ sơ trước khi mua vé!",
      "Trở về", "javascript:history.back()",
      "Hoàn thiện hồ sơ", "/account"
    );
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
    document.getElementById("confirm-payment-method").textContent = "Thanh toán trực tuyến";
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
      paymentMethod: "CASH",
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
      window.location.href = "/account-ticket";
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