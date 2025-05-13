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
document.addEventListener("DOMContentLoaded", () => {
  const avatarWrap = document.querySelector(".avatar-dropdown");
  if (!avatarWrap) return;
  const menu = avatarWrap.querySelector(".dropdown-menu");

  avatarWrap.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!avatarWrap.contains(e.target)) {
      menu.classList.remove("show");
    }
  });
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
