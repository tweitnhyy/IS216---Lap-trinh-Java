const API_KEY = "60f1a7410c9246060a3678004bef8b53";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"; // API dự báo tuần

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".search-container button").addEventListener("click", fetchWeather);
});

function fetchWeather() {
    const location = document.getElementById("searchInput").value.trim();
    if (!location) {
        alert("Vui lòng nhập quận/huyện!");
        return;
    }

    const url = `${API_URL}?q=${location},VN&units=metric&appid=${API_KEY}&lang=vi`;
    const forecastUrl = `${FORECAST_URL}?q=${location},VN&units=metric&cnt=40&appid=${API_KEY}&lang=vi`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Không tìm thấy địa điểm");
            return response.json();
        })
        .then(data => updateWeatherUI(data))
        .catch(error => {
            console.error("Lỗi lấy dữ liệu:", error);
            alert("Không tìm thấy địa điểm! Hãy thử lại.");
        });

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) throw new Error("Không thể lấy dữ báo tuần");
            return response.json();
        })
        .then(data => updateWeeklyForecast(data))
        .catch(error => console.error("Lỗi lấy dữ báo tuần:", error));
}
function updateWeatherUI(data) {
  // Cập nhật thời tiết hiện tại
  document.getElementById("location").innerText = data.name || "--";
  document.getElementById("temperature").innerText = data.main?.temp || "--";
  document.getElementById("humidity").innerText = data.main?.humidity || "--";
  document.getElementById("windSpeed").innerText = data.wind?.speed || "--";
  document.getElementById("status").innerText = data.weather?.[0]?.description || "Không có dữ liệu";
  
  const iconCode = data.weather?.[0]?.icon;
  document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById("weatherIcon").style.display = "block";

  let container = document.querySelector(".content");

    if (!container) {
        console.error("Không tìm thấy weatherContainer");
        return;
    }
    container.classList.add("expanded");
}

function updateForecastUI(forecastData) {
  const forecastContainer = document.getElementById("forecast-container");
  forecastContainer.innerHTML = ""; // Xóa dữ liệu cũ

  // Lọc 5 ngày dự báo (12 giờ trưa mỗi ngày)
  const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

  dailyForecasts.forEach(day => {
      const date = new Date(day.dt * 1000);
      const dayOfWeek = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"][date.getDay()];
      const temp = day.main.temp;
      const iconCode = day.weather[0].icon;

      // Tạo HTML cho mỗi ngày
      const forecastItem = document.createElement("div");
      forecastItem.classList.add("forecast-item");
      forecastItem.innerHTML = `
          <p>${dayOfWeek}, ${date.getDate()}/${date.getMonth() + 1}</p>
          <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png">
          <p>${temp.toFixed(1)}°C</p>
      `;

      forecastContainer.appendChild(forecastItem);
  });
}

function updateWeeklyForecast(data) {
  const forecastContainer = document.getElementById("weeklyForecast");
  forecastContainer.innerHTML = "";

  const dailyForecast = new Map();
  const today = new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });

  data.list.forEach(entry => {
      const date = new Date(entry.dt * 1000);
      const dayKey = date.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" });

      if (!dailyForecast.has(dayKey)) {
          dailyForecast.set(dayKey, {
              temp: entry.main.temp,
              icon: entry.weather[0].icon,
              date: dayKey,
              isToday: date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }) === today
          });
      }
  });

  const selectedDays = Array.from(dailyForecast.values()).slice(0, 7);

  selectedDays.forEach((info, index) => {
      const forecastItem = document.createElement("div");
      forecastItem.className = "forecast-day";
      forecastItem.innerHTML = `
          <p>${info.date}</p>
          ${info.isToday ? '<p style="color: white; font-weight: bold;">Hôm nay</p>' : ""}
          <img src="https://openweathermap.org/img/wn/${info.icon}@2x.png" alt="Weather Icon">
          <p>${info.temp.toFixed(1)}°C</p>
      `;
      forecastContainer.appendChild(forecastItem);
  });

  // Xóa "Đang cập nhật..." sau khi có dữ liệu
  document.getElementById("forecast-status").innerText = "";
}

