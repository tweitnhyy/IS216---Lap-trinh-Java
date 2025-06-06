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

        newItem.scrollIntoView({behavior: "smooth"});
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
        window.scrollTo({top: scrollY, behavior: "smooth"});
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

// Thu thập và gửi dữ liệu sự kiện qua API
    document.addEventListener("DOMContentLoaded", () => {
      const formSteps = document.querySelectorAll(".form-step");
      const wizardSteps = document.querySelectorAll(".wizard-step");
      const wizLine = document.querySelector(".wizard-steps");
      let currentStep = 1;

      // Khai báo biến chọn phần tử HTML
      const provinceSelect = document.getElementById("province");
      const districtSelect = document.getElementById("district");
      const wardSelect = document.getElementById("ward");

// Hiển thị loading tạm thời khi fetch dữ liệu
      function setLoading(select, loading) {
        if (loading) {
          select.innerHTML = '<option value="">Đang tải...</option>';
          select.disabled = true;
        } else {
          select.disabled = false;
        }
      }

      async function loadProvinces() {
        console.log("Bắt đầu loadProvinces()");
        setLoading(provinceSelect, true);
        try {
          const response = await fetch("/api/location/provinces");
          if (!response.ok) throw new Error("Không thể tải tỉnh/thành");
          const provinces = await response.json();
          provinceSelect.innerHTML = '<option value="">--Chọn--</option>';
          provinces.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.provinceId;
            opt.textContent = p.name;
            provinceSelect.appendChild(opt);
          });
        } catch (err) {
          alert(err.message);
          provinceSelect.innerHTML = '<option value="">Lỗi tải dữ liệu</option>';
        } finally {
          setLoading(provinceSelect, false);
        }
      }

// Tải danh sách quận/huyện
      async function loadDistricts(provinceId) {
        districtSelect.innerHTML = '<option value="">--Chọn--</option>';
        wardSelect.innerHTML = '<option value="">--Chọn--</option>';
        if (!provinceId) return;

        setLoading(districtSelect, true);
        try {
          const response = await fetch(`/api/location/districts?provinceId=${provinceId}`);
          if (!response.ok) throw new Error("Không thể tải quận/huyện");
          const districts = await response.json();
          districts.forEach(d => {
            const opt = document.createElement("option");
            opt.value = d.districtId;
            opt.textContent = d.name;
            districtSelect.appendChild(opt);
          });
          districtSelect.disabled = false;
        } catch (err) {
          alert(err.message);
          districtSelect.innerHTML = '<option value="">Lỗi tải dữ liệu</option>';
        } finally {
          setLoading(districtSelect, false);
        }
      }

// Tải danh sách phường/xã
      async function loadWards(districtId) {
        wardSelect.innerHTML = '<option value="">--Chọn--</option>';
        if (!districtId) return;

        setLoading(wardSelect, true);
        try {
          const response = await fetch(`/api/location/wards?districtId=${districtId}`);
          if (!response.ok) throw new Error("Không thể tải phường/xã");
          const wards = await response.json();
          wards.forEach(w => {
            const opt = document.createElement("option");
            opt.value = w.wardId;
            opt.textContent = w.name;
            wardSelect.appendChild(opt);
          });
          wardSelect.disabled = false;
        } catch (err) {
          alert(err.message);
          wardSelect.innerHTML = '<option value="">Lỗi tải dữ liệu</option>';
        } finally {
          setLoading(wardSelect, false);
        }
      }

      loadProvinces();
// Gán sự kiện cho các dropdown
      provinceSelect.addEventListener("change", () => {
        const provinceId = provinceSelect.value;
        loadDistricts(provinceId);
      });

      districtSelect.addEventListener("change", () => {
        const districtId = districtSelect.value;
        loadWards(districtId);
      });

      // Hàm tải file lên Cloudinary
      async function uploadFile(file, category) {
        if (!file) return null;
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("category", category);
          const response = await fetchWithToken("/api/upload", {
            method: "POST",
            body: formData
          });
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload ${category} failed: ${response.status} - ${errorText}`);
          }
          return await response.text();
        } catch (error) {
          console.error(`Error uploading ${category}:`, error);
          alert(`Không thể tải lên ${category}: ${error.message}`);
          return null;
        }
      }

      // Hàm thu thập dữ liệu từ form
      async function collectEventData() {
        const eventData = {
          "eventDTO": {
            title: "",
            format: "",
            location: "",
            city: "",
            startDateTime: "",
            endDateTime: "",
            ticketSaleStart: null,
            ticketSaleEnd: null,
            poster: "",
            posterSub: "",
            video: "",
            description: "",
            organizerName: "",
            organizerLogo: "",
            organizerDescription: ""
          },
          "ticketTypeDTOs": []
        };

        // Hàm hiển thị thông báo lỗi
        const showError = (id, message) => {
          const errorElement = document.getElementById(id);
          if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = message ? "block" : "none";
          }
        };

        // Xóa thông báo lỗi cũ
        ["start-date-error", "start-time-error", "end-date-error", "end-time-error"].forEach(id => showError(id, ""));
        document.querySelectorAll(".ticket-item").forEach((_, index) => {
          const idx = index + 1;
          ["ticket-name-error", "ticket-qty-error", "ticket-price-error", "ticket-max-error",
            "open-date-error", "open-time-error", "close-date-error", "close-time-error"].forEach(field => {
            showError(`${field}-${idx}`, "");
          });
        });
        // Thu thập thông tin sự kiện
        eventData.eventDTO.title = document.querySelector('input[placeholder="Tên sự kiện"]')?.value || "";
        eventData.eventDTO.format = document.querySelector('input[name="eventType"]:checked')?.value || "Offline";
        const venueName = document.querySelector('input[placeholder="Tên địa điểm"]')?.value.trim() || "";
        const address = document.querySelector('input[placeholder="Số nhà, đường"]')?.value.trim() || "";
        const district = districtSelect.options[districtSelect.selectedIndex]?.textContent.trim() || "";
        const ward = wardSelect.options[wardSelect.selectedIndex]?.textContent.trim() || "";
        const province = provinceSelect.options[provinceSelect.selectedIndex]?.textContent.trim() || "";
        const locationParts = [venueName, address, ward, district, province].filter(part => part !== "");
        eventData.eventDTO.location = locationParts.join(", ");
        eventData.eventDTO.city = provinceSelect.options[provinceSelect.selectedIndex]?.textContent || "";
        eventData.eventDTO.description = document.querySelector('textarea[placeholder="Nhập mô tả..."]')?.value || "";

        // Thu thập ngày và giờ
        const startDate = document.getElementById("start-date")?.value;
        const startTime = document.getElementById("start-time")?.value;
        console.log("startDate:", startDate);
        console.log("startTime:", startTime);
        if (!startDate) {
          showError("start-date-error", "Vui lòng nhập ngày bắt đầu");
          throw new Error("Vui lòng nhập ngày bắt đầu");
        }
        if (!startTime) {
          showError("start-time-error", "Vui lòng nhập giờ bắt đầu");
          throw new Error("Vui lòng nhập giờ bắt đầu");
        }
        const dateTimeString = `${startDate}T${startTime}:00`;
        const parsedDate = new Date(dateTimeString);
        if (isNaN(parsedDate.getTime())) {
          showError("start-date-error", "Định dạng ngày giờ không hợp lệ");
          throw new Error("Định dạng ngày giờ không hợp lệ");
        }
        eventData.eventDTO.startDateTime = parsedDate.toISOString();

        const endDate = document.getElementById("end-date")?.value;
        const endTime = document.getElementById("end-time")?.value;
        if (endDate && endTime) {
          const endDateTimeString = `${endDate}T${endTime}:00`;
          const parsedEndDate = new Date(endDateTimeString);
          if (isNaN(parsedEndDate.getTime())) {
            showError("end-date-error", "Định dạng ngày kết thúc không hợp lệ");
            throw new Error("Định dạng ngày kết thúc không hợp lệ");
          }
          eventData.eventDTO.endDateTime = parsedEndDate.toISOString();
        } else if (endDate || endTime) {
          showError("end-date-error", endDate ? "" : "Vui lòng nhập ngày kết thúc");
          showError("end-time-error", endTime ? "" : "Vui lòng nhập giờ kết thúc");
          throw new Error("Vui lòng nhập đầy đủ ngày và giờ kết thúc");
        }

        // Thu thập thông tin ban tổ chức
        eventData.eventDTO.organizerName = document.querySelector('input[placeholder="Tên Ban tổ chức"]')?.value || "";
        eventData.eventDTO.organizerDescription = document.querySelector('textarea[placeholder="Thông tin về ban tổ chức"]')?.value || "";


        const seatmapFile = document.querySelector('.upload-area[data-type="seatmap"] input[type="file"]')?.files[0];
        const seatmapUrl = await uploadFile(seatmapFile, "seatmap") || "";
        if (seatmapUrl) {
          eventData.eventDTO.description = eventData.eventDTO.description
              ? `${eventData.eventDTO.description}\n\nSơ đồ chỗ ngồi: ${seatmapUrl}`
              : `Sơ đồ chỗ ngồi: ${seatmapUrl}`;
        }

        // Thu thập thông tin vé
        document.querySelectorAll(".ticket-item").forEach((item, index) => {
          const idx = index + 1;
          const ticket = {
            type: item.querySelector(`#ticket-name-${idx}`)?.value || "",
            price: parseFloat(item.querySelector(`#ticket-price-${idx}`)?.value) || 0,
            quantity: parseInt(item.querySelector(`#ticket-qty-${idx}`)?.value) || 0,
            maxPerOrder: parseInt(item.querySelector(`#ticket-max-${idx}`)?.value) || 0,
            ticketSaleStart: null,
            ticketSaleEnd: null
          };
          const ticketOpenDate = item.querySelector(`#open-date-${idx}`)?.value;
          const ticketOpenTime = item.querySelector(`#open-time-${idx}`)?.value;
          const ticketCloseDate = item.querySelector(`#close-date-${idx}`)?.value;
          const ticketCloseTime = item.querySelector(`#close-time-${idx}`)?.value;

          console.log(`Ticket ${idx} - ticketOpenDate:`, ticketOpenDate);
          console.log(`Ticket ${idx} - ticketOpenTime:`, ticketOpenTime);
          console.log(`Ticket ${idx} - ticketCloseDate:`, ticketCloseDate);
          console.log(`Ticket ${idx} - ticketCloseTime:`, ticketCloseTime);

          if (!ticket.type) {
            showError(`ticket-name-error-${idx}`, "Vui lòng nhập tên loại vé");
          }
          if (!ticket.price) {
            showError(`ticket-price-error-${idx}`, "Vui lòng nhập giá vé lớn hơn 0");
          }
          if (!ticket.quantity) {
            showError(`ticket-qty-error-${idx}`, "Vui lòng nhập số lượng vé lớn hơn 0");
          }

          if (ticketOpenDate && ticketOpenTime) {
            const openDateTimeString = `${ticketOpenDate}T${ticketOpenTime}:00`;
            const parsedOpenDate = new Date(openDateTimeString);
            if (isNaN(parsedOpenDate.getTime())) {
              showError(`open-date-error-${idx}`, "Định dạng ngày mở vé không hợp lệ");
            } else {
              ticket.ticketSaleStart = parsedOpenDate.toISOString();
            }
          } else if (ticketOpenDate || ticketOpenTime) {
            showError(`open-date-error-${idx}`, ticketOpenDate ? "" : "Vui lòng nhập ngày mở vé");
            showError(`open-time-error-${idx}`, ticketOpenTime ? "" : "Vui lòng nhập giờ mở vé");
          }

          if (ticketCloseDate && ticketCloseTime) {
            const closeDateTimeString = `${ticketCloseDate}T${ticketCloseTime}:00`;
            const parsedCloseDate = new Date(closeDateTimeString);
            if (isNaN(parsedCloseDate.getTime())) {
              showError(`close-date-error-${idx}`, "Định dạng ngày đóng vé không hợp lệ");
            } else {
              ticket.ticketSaleEnd = parsedCloseDate.toISOString();
            }
          } else if (ticketCloseDate || ticketCloseTime) {
            showError(`close-date-error-${idx}`, ticketCloseDate ? "" : "Vui lòng nhập ngày đóng vé");
            showError(`close-time-error-${idx}`, ticketCloseTime ? "" : "Vui lòng nhập giờ đóng vé");
          }

          if (ticket.type && ticket.price > 0 && ticket.quantity > 0) {
            eventData.ticketTypeDTOs.push(ticket);
          } else {
            throw new Error("Vui lòng nhập đầy đủ thông tin vé hợp lệ (tên, giá, số lượng)");
          }
        });

        // Tính ticketSaleStart sớm nhất và ticketSaleEnd muộn nhất
        if (eventData.ticketTypeDTOs.length > 0) {
          const saleStarts = eventData.ticketTypeDTOs
              .map(ticket => ticket.ticketSaleStart)
              .filter(start => start)
              .map(start => new Date(start));
          const saleEnds = eventData.ticketTypeDTOs
              .map(ticket => ticket.ticketSaleEnd)
              .filter(end => end)
              .map(end => new Date(end));

          if (saleStarts.length > 0) {
            eventData.eventDTO.ticketSaleStart = new Date(Math.min(...saleStarts)).toISOString();
          }
          if (saleEnds.length > 0) {
            eventData.eventDTO.ticketSaleEnd = new Date(Math.max(...saleEnds)).toISOString();
          }
        } else {
          throw new Error("Phải có ít nhất một loại vé hợp lệ");
        }

        // Tải file lên Cloudinary và lấy URL
        const logoFile = document.querySelector('.upload-area[data-type="logo"] input[type="file"]')?.files[0];
        const posterFile = document.querySelector('.upload-area[data-type="poster"] input[type="file"]')?.files[0];
        const videoFile = document.querySelector('.upload-area[data-type="video"] input[type="file"]')?.files[0];
        const orgLogoFile = document.querySelector('.upload-area[data-type="org-logo"] input[type="file"]')?.files[0];

        eventData.eventDTO.poster = await uploadFile(posterFile, "poster") || "";
        eventData.eventDTO.posterSub = await uploadFile(logoFile, "poster-sub") || "";
        eventData.eventDTO.video = await uploadFile(videoFile, "video") || "";
        eventData.eventDTO.organizerLogo = await uploadFile(orgLogoFile, "org-logo") || "";

        // Kiểm tra dữ liệu bắt buộc
        if (!eventData.eventDTO.title) {
          throw new Error("Tên sự kiện là bắt buộc");
        }
        if (!eventData.ticketTypeDTOs.length) {
          throw new Error("Phải có ít nhất một loại vé hợp lệ");
        }

        return eventData;
      }

      // Hàm gửi dữ liệu qua API
      async function submitEventData(eventData) {
        try {
          console.log("Submit JSON:", JSON.stringify(eventData, null, 2)); // Log JSON
          const response = await fetchWithToken("/api/events/create-events", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(eventData)
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error creating event: ${response.status} - ${errorText}`);
          }

          const result = await response.json();
          alert("Tạo sự kiện thành công!");
          window.location.href = "/";
        } catch (error) {
          console.error("Lỗi tạo sự kiện:", error);
          alert("Tạo sự kiện thất bại: " + error.message);
        }
      }

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

        window.scrollTo({top: 0, behavior: "smooth"});
      }

      const nextButtons = document.querySelectorAll(".btn-next");
      nextButtons.forEach(button => {
        button.addEventListener("click", e => {
          const currentStepEl = e.target.closest(".form-step");
          const currentIndex = [...formSteps].indexOf(currentStepEl);

          if (!validateFormStep(currentStepEl)) {
            e.preventDefault();
            return;
          }

          if (currentIndex < formSteps.length - 1) {
            showStep(currentIndex + 2);
          }
        });
      });

// Cập nhật sự kiện cho nút Prev
      const prevButtons = document.querySelectorAll(".btn-prev");
      prevButtons.forEach(button => {
        button.addEventListener("click", e => {
          const currentStepEl = e.target.closest(".form-step");
          const currentIndex = [...formSteps].indexOf(currentStepEl);

          if (currentIndex > 0) {
            showStep(currentIndex);
          }
        });
      });
      // Xử lý nút Confirm
      document.querySelectorAll(".btn-confirm").forEach((btn) =>
          btn.addEventListener("click", async (e) => {
            const circle = document.createElement("span");
            circle.classList.add("ripple");
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            circle.style.width = circle.style.height = `${size}px`;
            circle.style.left = `${e.clientX - rect.left - size / 2}px`;
            circle.style.top = `${e.clientY - rect.top - size / 2}px`;
            btn.appendChild(circle);
            setTimeout(() => circle.remove(), 600);

            // Thu thập và gửi dữ liệu
            try {
              const eventData = await collectEventData();
              await submitEventData(eventData);
            } catch (error) {
              console.error("Error in confirm:", error);
              alert("Lỗi: " + error.message);
            }
          })
      );

      showStep(1);

// Thêm validateForm kiểm tra bước hiện tại
      function validateFormStep(currentStep) {
        let valid = true;

        // Xóa tất cả lỗi cũ
        currentStep.querySelectorAll(".error-message").forEach(e => e.textContent = "");
        currentStep.querySelectorAll(".required").forEach(input => input.classList.remove("input-error"));

        // Kiểm tra tất cả input/textarea/select có class .required
        currentStep.querySelectorAll(".required").forEach(input => {
          const error = input.parentElement.querySelector(".error-message");

          const checkEmpty = () => {
            if (!input.value.trim()) {
              input.classList.add("input-error");
              if (error) error.textContent = "Trường này không được để trống.";
              valid = false;
            } else {
              input.classList.remove("input-error");
              if (error) error.textContent = "";
            }
          };

          // Kiểm tra ban đầu
          checkEmpty();

          // Tự động hiển thị/xoá lỗi khi người dùng gõ
          input.addEventListener("input", () => {
            if (input.value.trim()) {
              input.classList.remove("input-error");
              if (error) error.textContent = "";
            }
          });

          // Kiểm tra khi mất focus
          input.addEventListener("blur", () => {
            checkEmpty();
          });
        });

        // Ràng buộc ngày tháng và vé (chỉ thực hiện tại bước 2 hoặc có ID cụ thể)
        const startDate = document.getElementById("start-date")?.value;
        const startTime = document.getElementById("start-time")?.value;
        const endDate = document.getElementById("end-date")?.value;
        const endTime = document.getElementById("end-time")?.value;

        if (startDate && startTime && endDate && endTime) {
          const start = new Date(`${startDate}T${startTime}:00`);
          const end = new Date(`${endDate}T${endTime}:00`);
          if (end <= start) {
            const error = document.getElementById("end-time")?.parentElement.querySelector(".error-message");
            if (error) error.textContent = "Ngày kết thúc phải sau ngày bắt đầu.";
            valid = false;
          }
        }

        const eventStartDate = document.getElementById("start-date")?.value;
        const eventStartTime = document.getElementById("start-time")?.value;

        const eventStartDateTime = eventStartDate && eventStartTime ? new Date(`${eventStartDate}T${eventStartTime}:00`) : null;

        currentStep.querySelectorAll(".ticket-item").forEach(ticketEl => {
          const qtyInput = ticketEl.querySelector("input[name='ticket-qty[]']");
          const maxInput = ticketEl.querySelector("input[name='ticket-max[]']");
          const qty = parseInt(qtyInput?.value);
          const max = parseInt(maxInput?.value);
          const error = maxInput?.parentElement.querySelector(".error-message");

          if (!isNaN(qty) && !isNaN(max) && max > qty) {
            if (error) error.textContent = "Số lượng vé tối đa mỗi giao dịch không được vượt quá tổng số vé.";
            valid = false;
          } else if (error) {
            error.textContent = "";
          }

          // Kiểm tra ngày giờ mở/đóng vé
          const openDate = ticketEl.querySelector("input[name='open-date[]']")?.value;
          const openTime = ticketEl.querySelector("input[name='open-time[]']")?.value;
          const closeDate = ticketEl.querySelector("input[name='close-date[]']")?.value;
          const closeTime = ticketEl.querySelector("input[name='close-time[]']")?.value;

          const openDateTime = openDate && openTime ? new Date(`${openDate}T${openTime}:00`) : null;
          const closeDateTime = closeDate && closeTime ? new Date(`${closeDate}T${closeTime}:00`) : null;

          const openError = ticketEl.querySelector("input[name='open-time[]']")?.parentElement.querySelector(".error-message");
          const closeError = ticketEl.querySelector("input[name='close-time[]']")?.parentElement.querySelector(".error-message");

          if (openDateTime && closeDateTime && closeDateTime <= openDateTime) {
            if (closeError) closeError.textContent = "Ngày đóng vé phải sau ngày mở vé.";
            valid = false;
          }

          if (eventStartDateTime && openDateTime && openDateTime >= eventStartDateTime) {
            if (openError) openError.textContent = "Ngày mở vé phải trước ngày diễn ra sự kiện.";
            valid = false;
          }

          if (eventStartDateTime && closeDateTime && closeDateTime >= eventStartDateTime) {
            if (closeError) closeError.textContent = "Ngày đóng vé phải trước ngày diễn ra sự kiện.";
            valid = false;
          }
        });

        return valid;
      }

    });


