// Hàm chuyển đổi JSON từ backend thành định dạng cần thiết cho banner
function transformEventData(json) {
  return {
    id: json.eventId || '',
    title: json.title || 'Sự kiện không có tiêu đề',
    video: json.video || '',
    poster: json.poster || ''
  };
}

// Banner Section
document.addEventListener("DOMContentLoaded", () => {
  const bannerVideo = document.getElementById("bannerVideo");
  const videoSource = bannerVideo?.querySelector("source");
  const volumeToggle = document.getElementById("volumeToggle");
  const volumeIcon = volumeToggle?.querySelector("span");
  const detailButton = document.getElementById("detailButton");
  const dots = document.querySelectorAll(".banner-dots .dot");

  let allEventData = [];
  let currentIndex = 0;

  // Gọi API để lấy sự kiện có video không null
  fetch("/api/events/no-auth/video-events")
      .then((response) => {
        if (!response.ok) {
          if (response.status === 204) return []; // Không có dữ liệu
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        allEventData = data.map(transformEventData).filter(event => event.video && event.poster); // Lọc sự kiện hợp lệ
        console.log("Dữ liệu sự kiện từ API:", allEventData);

        if (allEventData.length === 0) {
          console.warn("Không có sự kiện nào có video hợp lệ.");
          const bannerSection = document.querySelector(".banner-section");
          if (bannerSection) {
            bannerSection.innerHTML = `
            <p>Không có sự kiện nổi bật để hiển thị. 
            <button class="retry-btn" onclick="location.reload()">Thử lại</button></p>
          `;
            bannerSection.style.textAlign = "center";
            bannerSection.style.padding = "20px";
          }
          return;
        }

        // Ẩn các chấm điều hướng thừa nếu số sự kiện < số chấm
        dots.forEach((dot, index) => {
          if (index >= allEventData.length) {
            dot.style.display = "none";
          } else {
            dot.style.display = "inline-block";
            dot.addEventListener("click", () => {
              if (index !== currentIndex) {
                loadBanner(index);
              }
            });
            dot.addEventListener("keydown", (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (index !== currentIndex) {
                  loadBanner(index);
                }
              }
            });
            dot.setAttribute("aria-label", `Chuyển đến banner sự kiện ${index + 1}`);
            dot.setAttribute("tabindex", "0");
          }
        });

        loadBanner(0);
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu sự kiện:", error);
        const bannerSection = document.querySelector(".banner-section");
        if (bannerSection) {
          bannerSection.innerHTML = `
          <p>Lỗi khi tải sự kiện nổi bật. 
          <button class="retry-btn" onclick="location.reload()">Thử lại</button></p>
        `;
          bannerSection.style.textAlign = "center";
          bannerSection.style.padding = "20px";
        }
      });

  function loadBanner(index) {
    if (index < 0 || index >= allEventData.length) return;

    const eventItem = allEventData[index];

    if (!eventItem) {
      console.error(`Không tìm thấy sự kiện tại index: ${index}`);
      return;
    }

    if (bannerVideo && videoSource) {
      videoSource.src = eventItem.video;
      bannerVideo.load();
      bannerVideo.poster = eventItem.poster;
      bannerVideo.muted = true;
      bannerVideo.setAttribute("aria-label", `Video quảng cáo cho sự kiện ${eventItem.title}`);
    }

    if (volumeIcon) {
      volumeIcon.textContent = "volume_off";
    }

    if (detailButton) {
      detailButton.href = `/event-detail?eventId=${eventItem.id}`;
      detailButton.setAttribute("aria-label", `Xem chi tiết sự kiện ${eventItem.title}`);
      detailButton.onclick = (e) => {
        e.preventDefault();
        window.open(detailButton.href, "_blank");
      };
    }

    dots.forEach((dot) => dot.classList.remove("active"));
    if (dots[index]) {
      dots[index].classList.add("active");
    }

    currentIndex = index;

    // Tải trước poster của banner tiếp theo để tối ưu hiệu suất
    if (index + 1 < allEventData.length) {
      const preloadImage = new Image();
      preloadImage.src = allEventData[index + 1].poster;
    }
  }

  if (volumeToggle && volumeIcon && bannerVideo) {
    volumeToggle.addEventListener("click", () => {
      bannerVideo.muted = !bannerVideo.muted;
      volumeIcon.textContent = bannerVideo.muted ? "volume_off" : "volume_up";
      volumeToggle.setAttribute("aria-label", bannerVideo.muted ? "Bật âm thanh video" : "Tắt âm thanh video");
    });
  }

  if (bannerVideo) {
    bannerVideo.addEventListener("mouseenter", () => {
      bannerVideo.play().catch(() => console.warn("Không thể phát video tự động."));
    });

    bannerVideo.addEventListener("mouseleave", () => {
      bannerVideo.pause();
    });
  }
});


// Hàm chuyển đổi JSON EventDTO thành dạng cần thiết
function transformEventUpcomingData(json) {
  const formatMonth = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return '';
    const month = date.getMonth() + 1; // Tháng từ 0-11, cộng 1
    return `THG${month.toString().padStart(2, '0')}`; // Ví dụ: THG06
  };

  const formatDay = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return '';
    return date.getDate().toString().padStart(2, '0'); // Ví dụ: 20
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date)) return '';
    // Chuyển đổi sang múi giờ Việt Nam (GMT+7)
    const vietnamDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    // Định dạng thủ công để đảm bảo DD/MM/YYYY
    const day = vietnamDate.getUTCDate().toString().padStart(2, '0');
    const month = (vietnamDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = vietnamDate.getUTCFullYear();
    return `${day}/${month}/${year}`; // Ví dụ: 20/06/2025
  };

  const date = json.startDateTime ? new Date(json.startDateTime) : null;

  return {
    id: json.eventId != null ? String(json.eventId) : '',
    title: json.title ? String(json.title) : 'Sự kiện không có tiêu đề',
    poster: json.poster ? String(json.poster) : '',
    intro: json.description && typeof json.description === 'string'
        ? json.description.split('\n')[0] || ''
        : '',
    event_info: {
      date: formatDate(json.startDateTime),
      month: formatMonth(date),
      day: formatDay(date)
    }
  };
}

// Event Upcoming Section
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('eventGrid');
  const moreButtonWrapper = document.querySelector('.event-more-btn');
  const moreButton = document.querySelector('.event-more-btn .more-button');
  let buttonIcon = moreButton?.querySelector('.button-icon');
  const buttonText = moreButton?.querySelector('.button-text');
  const eventSection = document.querySelector('.event-upcoming-section');
  let allEvents = [];
  let displayedEvents = 6;
  const eventsPerLoad = 6;
  let isExpanded = false;
  // Cố định currentDate ở GMT+7
  const currentDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));

  if (!container || !moreButton || !moreButtonWrapper || !buttonIcon || !buttonText || !eventSection) {
    console.error('Thiếu các phần tử DOM cần thiết cho Event Upcoming Section.');
    container.innerHTML = '<p>Lỗi: Không tìm thấy các phần tử cần thiết.</p>';
    return;
  }

  moreButtonWrapper.style.display = 'block';

  fetch('/api/events/no-auth/upcoming')
      .then((response) => {
        if (!response.ok) {
          if (response.status === 204) return []; // Không có dữ liệu
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        allEvents = data.map(event => {
          const transformed = transformEventUpcomingData(event);
          console.log('Transformed event:', transformed);
          return transformed;
        }).filter(event => {
          // Phân tích event.event_info.date (DD/MM/YYYY)
          const [day, month, year] = event.event_info.date.split('/');
          const eventDate = new Date(`${year}-${month}-${day}T00:00:00.000+07:00`);
          const isValid = !isNaN(eventDate) &&
              eventDate >= currentDate &&
              event.poster &&
              event.title &&
              event.event_info.month &&
              event.event_info.day &&
              event.id;
          if (!isValid) {
            console.log('Event filtered out:', {
              title: event.title,
              date: event.event_info.date,
              eventDate: eventDate.toISOString(),
              isValidDate: !isNaN(eventDate),
              isFuture: eventDate >= currentDate,
              hasPoster: !!event.poster,
              hasTitle: !!event.title,
              hasMonth: !!event.event_info.month,
              hasDay: !!event.event_info.day,
              hasId: !!event.id
            });
          }
          return isValid;
        });
        console.log(`Đã tải ${allEvents.length} sự kiện hợp lệ từ ${data.length} sự kiện`);

        const renderEvents = (eventList) => {
          container.innerHTML = '';
          eventList.forEach((event) => {
            const card = document.createElement('div');
            card.className = 'event-card';
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Sự kiện ${event.title}, diễn ra ngày ${event.event_info.date}`);
            card.innerHTML = `
              <img src="${event.poster}" alt="${event.title}" loading="lazy">
              <div class="event-info">
                <div class="event-date">
                  <span class="month">${event.event_info.month}</span>
                  <br/>
                  <span class="day">${event.event_info.day}</span>
                </div>
                <div class="event-text">
                  <h3 class="event-title">${event.title}</h3>
                  <p class="event-desc">${event.intro}</p>
                </div>
              </div>
            `;
            card.addEventListener('click', () => {
              window.open(`/event-detail?eventId=${event.id}`, '_blank');
            });
            card.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.open(`/event-detail?eventId=${event.id}`, '_blank');
              }
            });
            container.appendChild(card);
          });
        };

        const initialEvents = allEvents.slice(0, displayedEvents);
        renderEvents(initialEvents);

        if (allEvents.length <= eventsPerLoad) {
          moreButtonWrapper.style.display = 'none';
        } else {
          moreButtonWrapper.style.display = 'block';
        }

        moreButton.addEventListener('click', () => {
          if (!isExpanded) {
            renderEvents(allEvents);
            const newIconExpand = document.createElement('span');
            newIconExpand.className = 'material-symbols-rounded button-icon';
            newIconExpand.textContent = 'expand_less';
            buttonIcon.replaceWith(newIconExpand);
            buttonIcon = newIconExpand;
            buttonText.textContent = moreButtonWrapper.dataset.hide || 'Thu gọn';
            moreButton.classList.add('collapsed');
            moreButton.setAttribute('aria-label', 'Thu gọn danh sách sự kiện');
            isExpanded = true;
          } else {
            const initialEvents = allEvents.slice(0, displayedEvents);
            renderEvents(initialEvents);
            const newIconCollapse = document.createElement('span');
            newIconCollapse.className = 'material-symbols-rounded button-icon';
            newIconCollapse.textContent = 'expand_more';
            buttonIcon.replaceWith(newIconCollapse);
            buttonIcon = newIconCollapse;
            buttonText.textContent = moreButtonWrapper.dataset.show || 'Xem thêm';
            moreButton.classList.remove('collapsed');
            moreButton.setAttribute('aria-label', 'Xem thêm sự kiện');
            eventSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            isExpanded = false;
          }
        });

        moreButton.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            moreButton.click();
          }
        });
      })
      .catch((error) => {
        console.error('Lỗi tải dữ liệu sự kiện sắp diễn ra:', error);
        container.innerHTML = `
          <p>Lỗi khi tải sự kiện sắp diễn ra. 
          <button class="retry-btn" onclick="location.reload()">Thử lại</button></p>
        `;
        container.style.textAlign = 'center';
        container.style.padding = '20px';
        moreButtonWrapper.style.display = 'none';
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

// Hàm chuyển đổi JSON EventDTO thành dạng cần thiết
function transformEventTrendData(json) {
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return {
    id: json.eventId || '',
    title: String(json.title || 'Sự kiện không có tiêu đề'),
    poster_sub: String(json.posterSub || '/default-poster.jpg'), // Ánh xạ poster thành poster_sub
    event_info: {
      date: formatDate(json.startDateTime)
    }
  };
}

// Event Trend Section
document.addEventListener('DOMContentLoaded', async () => {
  const track = document.getElementById('carouselTrack');
  const nextBtn = document.querySelector('.event-trend-section .carousel-nav.next');
  const prevBtn = document.querySelector('.event-trend-section .carousel-nav.prev');
  let scrollPosition = 0;
  const cardWidth = 230;
  const gap = 16;
  const cardsToScroll = 3;
  const scrollAmount = (cardWidth + gap) * cardsToScroll;

  if (!track || !nextBtn || !prevBtn) {
    console.error('Thiếu các phần tử DOM cần thiết cho Event Trend Section.');
    return;
  }

  try {
    const response = await fetch('/api/events/no-auth/random');
    if (!response.ok) {
      if (response.status === 204) {
        console.warn('Không có sự kiện xu hướng nào từ API.');
        track.innerHTML = '<p>Không có sự kiện xu hướng để hiển thị.</p>';
        return;
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Dữ liệu thô từ API:', data);
    let trendEvents = data.map(transformEventTrendData).filter(event => event.id && event.event_info.date);
    console.log('Sự kiện sau khi lọc:', trendEvents);

    if (trendEvents.length === 0) {
      console.warn('Không có sự kiện hợp lệ sau khi lọc.');
      track.innerHTML = '<p>Không có sự kiện xu hướng để hiển thị.</p>';
      return;
    }

    // Giới hạn tối đa 10 sự kiện
    trendEvents = trendEvents.slice(0, 10);

    trendEvents.forEach((event, i) => {
      const card = document.createElement('div');
      card.className = 'trend-card-wrapper';
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Sự kiện xu hướng ${event.title}, diễn ra ngày ${event.event_info.date}`);
      card.innerHTML = `
        <div class="trend-card-image-wrapper">
          <div class="trend-card-image">
            <img src="${event.poster_sub}" alt="${event.title}" loading="lazy" />
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
      card.addEventListener('click', () => {
        window.open(`/event-detail?eventId=${event.id}`, '_blank');
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.open(`/event-detail?eventId=${event.id}`, '_blank');
        }
      });
      track.appendChild(card);

      // Thêm class opposite-frame cho rank 2, 4, 6, 8, 10
      if ((i + 1) % 2 === 0) {
        card.querySelector('.trend-card-image').classList.add('opposite-frame');
      }
    });

    const maxScroll = track.scrollWidth - track.clientWidth;
    nextBtn.addEventListener('click', () => {
      scrollPosition += scrollAmount;
      if (scrollPosition > maxScroll) scrollPosition = maxScroll;
      track.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      nextBtn.setAttribute('aria-label', 'Cuộn đến các sự kiện xu hướng tiếp theo');
    });

    prevBtn.addEventListener('click', () => {
      scrollPosition -= scrollAmount;
      if (scrollPosition < 0) scrollPosition = 0;
      track.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      prevBtn.setAttribute('aria-label', 'Cuộn đến các sự kiện xu hướng trước đó');
    });

    // Thêm trợ năng cho nút điều hướng
    [nextBtn, prevBtn].forEach(btn => {
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });

  } catch (error) {
    console.error('Lỗi tải dữ liệu sự kiện xu hướng:', error);
    track.innerHTML = `
      <p>Lỗi khi tải sự kiện xu hướng. 
      <button class="retry-btn" onclick="location.reload()">Thử lại</button></p>
    `;
    track.style.textAlign = 'center';
    track.style.padding = '20px';
  }
});
// Hàm chuyển đổi JSON EventDTO thành dạng cần thiết
function transformEventRandom2Data(json) {
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return {
    id: json.eventId || '',
    title: String(json.title || 'Sự kiện không có tiêu đề'),
    poster: String(json.poster || '/default-poster.jpg'),
    poster_sub: String(json.posterSub || '/default-poster.jpg'), // Ánh xạ poster thành poster_sub
    event_info: {
      date: formatDate(json.startDateTime)
    }
  };
}

// Event Special Section
document.addEventListener('DOMContentLoaded', async () => {
  const track = document.getElementById('specialTrack');
  const nextBtn = document.querySelector('.event-special-section .carousel-nav.next');
  const prevBtn = document.querySelector('.event-special-section .carousel-nav.prev');
  let scrollPosition = 0;
  const cardWidth = 270;
  const gap = 16;
  const cardsToScroll = 3;
  const scrollAmount = (cardWidth + gap) * cardsToScroll;

  if (!track || !nextBtn || !prevBtn) {
    console.error('Thiếu các phần tử DOM cần thiết cho Event Special Section.');
    return;
  }

  try {
    const response = await fetch('/api/events/no-auth/random');
    if (!response.ok) {
      if (response.status === 204) {
        console.warn('Không có sự kiện đặc biệt nào từ API.');
        track.innerHTML = '<p>Không có sự kiện đặc biệt để hiển thị.</p>';
        return;
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Dữ liệu thô từ API:', data);
    let specialEvents = data.map(transformEventRandom2Data).filter(event => event.id && event.event_info.date);
    console.log('Sự kiện sau khi lọc:', specialEvents);

    if (specialEvents.length === 0) {
      console.warn('Không có sự kiện hợp lệ sau khi lọc.');
      track.innerHTML = '<p>Không có sự kiện đặc biệt để hiển thị.</p>';
      return;
    }

    // Giới hạn tối đa 10 sự kiện
    specialEvents = specialEvents.slice(0, 10);

    specialEvents.forEach((event) => {
      const card = document.createElement('div');
      card.className = 'trend-card-wrapper';
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Sự kiện đặc biệt ${event.title}, diễn ra ngày ${event.event_info.date}`);
      card.innerHTML = `
        <img src="${event.poster}" alt="${event.title}" class="main-banner" loading="lazy" />
        <img src="${event.poster_sub}" alt="${event.title}" class="sub-poster" loading="lazy" />
        <div class="trend-caption">
          <div class="trend-title">${event.title}</div>
          <div class="trend-date">${event.event_info.date}</div>
        </div>
      `;
      card.addEventListener('click', () => {
        window.open(`/event-detail?eventId=${event.id}`, '_blank');
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.open(`/event-detail?eventId=${event.id}`, '_blank');
        }
      });
      track.appendChild(card);
    });

    const maxScroll = track.scrollWidth - track.clientWidth;
    nextBtn.addEventListener('click', () => {
      scrollPosition += scrollAmount;
      if (scrollPosition > maxScroll) scrollPosition = maxScroll;
      track.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      nextBtn.setAttribute('aria-label', 'Cuộn đến các sự kiện đặc biệt tiếp theo');
    });

    prevBtn.addEventListener('click', () => {
      scrollPosition -= scrollAmount;
      if (scrollPosition < 0) scrollPosition = 0;
      track.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      prevBtn.setAttribute('aria-label', 'Cuộn đến các sự kiện đặc biệt trước đó');
    });

    // Thêm trợ năng cho nút điều hướng
    [nextBtn, prevBtn].forEach(btn => {
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });

  } catch (error) {
    console.error('Lỗi tải dữ liệu sự kiện đặc biệt:', error);
    track.innerHTML = `
      <p>Lỗi khi tải sự kiện đặc biệt. 
      <button class="retry-btn" onclick="location.reload()">Thử lại</button></p>
    `;
    track.style.textAlign = 'center';
    track.style.padding = '20px';
  }
});
