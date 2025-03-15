document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const districtList = document.getElementById("districtList");

  // Gán sự kiện Enter để tìm kiếm thời tiết
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      fetchWeather();
    }
  });

  // Gán sự kiện click cho từng mục trong danh sách
  districtList.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", function () {
      searchInput.value = this.textContent; // Điền giá trị vào ô tìm kiếm
      districtList.style.maxHeight = "0"; // Ẩn danh sách sau khi chọn
      fetchWeather(); // Tự động tìm kiếm sau khi chọn
    });
  });

  // Ẩn danh sách khi nhấn ra ngoài
  document.addEventListener("click", function (event) {
    if (!document.querySelector(".search-wrapper").contains(event.target)) {
      districtList.style.maxHeight = "0";
    }
  });

  // Hiển thị danh sách khi nhấn vào ô tìm kiếm
  searchInput.addEventListener("focus", function () {
    districtList.style.maxHeight = "300px"; // Mở dropdown khi nhấn vào ô input
  });
});

async function fetchWeather() {
  const city = document.getElementById("searchInput").value.trim();
  if (!city) {
    alert("Vui lòng nhập tên quận/huyện!");
    return;
  }

  try {
    // Gọi API backend
    const response = await fetch(`http://localhost:8081/api/weather/${city}`);
    if (!response.ok) {
      throw new Error("Không tìm thấy dữ liệu thời tiết!");
    }

    // Chuyển đổi JSON
    const data = await response.json();

    // Cập nhật giao diện với dữ liệu nhận được
    document.getElementById("location").textContent = data.location;
    document.getElementById("temperature").textContent = data.temperature;
    document.getElementById("humidity").textContent = data.humidity;
    document.getElementById("windSpeed").textContent = data.windSpeed;
    document.getElementById("status").textContent = data.status;

    // Hiển thị icon thời tiết
    const weatherIcon = document.getElementById("weatherIcon");
    weatherIcon.src = data.icon;
    weatherIcon.style.display = "block";
  } catch (error) {
    alert("Lỗi khi tải dữ liệu thời tiết!");
    console.error(error);
  }
}
