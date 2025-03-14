document
  .getElementById("searchInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      fetchWeather();
    }
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
