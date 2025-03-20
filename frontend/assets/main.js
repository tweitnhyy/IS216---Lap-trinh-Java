const WEATHER_API_URL = "http://localhost:8080/api/weather"; // weather-service api
const LOCATION_API_URL = "http://localhost:8081/api/locations"; // location-service api

let hasSelectedLocation = false; // Biến để kiểm tra người dùng đã chọn địa điểm
let debounceTimer;
const searchCache = {}; // Lưu kết quả tìm kiếm trước đó

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const suggestionsList = document.getElementById("suggestionsList");

  searchButton.addEventListener("click", fetchWeather);
  searchInput.addEventListener("input", handleInput);
  searchInput.addEventListener("keydown", handleEnterPress);

  // Xử lý khi nhập liệu vào ô tìm kiếm
  // function handleInput() {
  //   const query = searchInput.value.trim();

  //   // Xử lí việc nhập của user
  //   if (query.length > 2 && !hasSelectedLocation) {
  //     fetch(`${LOCATION_API_URL}/suggest?query=${encodeURIComponent(query)}`)
  //       .then((response) => response.json())
  //       .then((data) => updateSuggestions(data))
  //       .catch((error) => console.error("Lỗi fetch:", error));
  //   } else {
  //     suggestionsList.style.display = "none";
  //   }
  // }

  function handleInput() {
    clearTimeout(debounceTimer); // Xóa bộ đếm thời gian cũ
    const query = searchInput.value.trim();

    if (query.length < 2) {
      suggestionsList.style.display = "none";
      return;
    }

    // Kiểm tra cache trước khi gọi API
    if (searchCache[query]) {
      updateSuggestions(searchCache[query]);
      return;
    }

    debounceTimer = setTimeout(() => {
      fetch(`${LOCATION_API_URL}/suggest?query=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((data) => {
          searchCache[query] = data; // Lưu vào cache
          updateSuggestions(data);
        })
        .catch((error) => console.error("Lỗi fetch:", error));
    }, 100);
  }

  // Cập nhật danh sách gợi ý địa điểm
  function updateSuggestions(suggestions) {
    suggestionsList.innerHTML = "";
    if (suggestions.length === 0) return;

    suggestions.forEach((location) => {
      const li = document.createElement("li");
      li.textContent = location;
      li.addEventListener("click", function () {
        searchInput.value = location;
        hasSelectedLocation = true;
        suggestionsList.style.display = "none";
        fetchWeather();
      });
      suggestionsList.appendChild(li);
    });

    suggestionsList.style.display = "block";
  }

  // Xử lý sự kiện nhấn phím Enter để tìm kiếm
  function handleEnterPress(event) {
    if (event.key === "Enter") {
      hasSelectedLocation = true;
      suggestionsList.style.display = "none";
      fetchWeather();
    }
  }
});

// Reset giao diện khi không có dữ liệu
function resetUI() {
  document.getElementById("previewIcon").style.display = "block";
  document.getElementById("location").innerText = "";
  document.getElementById("temperature").innerText = "_ _ _";
  document.getElementById("humidity").innerText = "_ _ _";
  document.getElementById("windSpeed").innerText = "_ _ _";
  document.getElementById("status").innerText = "Đang cập nhật...";
  document.getElementById("weatherIcon").style.display = "none";
  document.getElementById("weeklyForecast").innerHTML = "";
  document.getElementById("forecast-title").style.display = "none";
}

// Trang giao diện ban đầu, đợi yêu cầu từ user
function updateWeatherUI(data) {
  document.getElementById("location").innerText = data.name || "--";
  document.getElementById("temperature").innerText = data.main?.temp || "--";
  document.getElementById("humidity").innerText = data.main?.humidity || "--";
  document.getElementById("windSpeed").innerText = data.wind?.speed || "--";
  document.getElementById("status").innerText =
    data.weather?.[0]?.description || "Không có dữ liệu";

  // Hiển thị logo SkyCast
  const iconCode = data.weather?.[0]?.icon || "01d";
  document.getElementById(
    "weatherIcon"
  ).src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById("weatherIcon").style.display = "block";
}

// Lấy dữ liệu thời tiết từ weather-service
function fetchWeather() {
  const location = document.getElementById("searchInput").value.trim();
  const suggestionsList = document.getElementById("suggestionsList");

  if (!location) {
    alert("Vui lòng nhập địa điểm!");
    return;
  }

  document.getElementById("previewIcon").style.display = "none";
  suggestionsList.style.display = "none";

  fetch(`${WEATHER_API_URL}/today?location=${encodeURIComponent(location)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Không tìm thấy địa điểm!");
      }
      return response.json();
    })
    .then((data) => {
      updateWeatherUI(data);
      suggestionsList.innerHTML = "";
    })
    .catch(() => {
      resetUI();
      alert("Không tìm thấy địa điểm! Hãy thử lại.");
    });

  fetch(`${WEATHER_API_URL}/forecast?location=${encodeURIComponent(location)}`)
    .then((response) => response.json())
    .then((data) => updateWeeklyForecast(data))
    .catch((error) => console.error("Lỗi lấy dự báo tuần:", error));
}

// Cập nhật giao diện với dự báo thời tiết 5 ngày
function updateWeeklyForecast(data) {
  const forecastContainer = document.getElementById("weeklyForecast");
  forecastContainer.innerHTML = "";

  if (!Array.isArray(data.list) || data.list.length === 0) {
    document.getElementById("forecast-title").style.display = "none";
    return;
  }

  const dailyForecast = new Map();
  const today = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });

  data.list.forEach((entry) => {
    const date = new Date(entry.dt * 1000);
    const dayKey = date.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });

    if (!dailyForecast.has(dayKey)) {
      dailyForecast.set(dayKey, {
        temp: entry.main.temp,
        icon: entry.weather[0].icon,
        date: dayKey,
        isToday:
          date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
          }) === today,
      });
    }
  });

  Array.from(dailyForecast.values())
    .slice(0, 5)
    .forEach((info) => {
      const forecastItem = document.createElement("div");
      forecastItem.className = "forecast-day";
      forecastItem.innerHTML = `
            <p>${info.date}</p>
            ${
              info.isToday
                ? '<p style="color: white; font-weight: bold;">Hôm nay</p>'
                : ""
            }
            <img src="https://openweathermap.org/img/wn/${
              info.icon
            }@2x.png" alt="Weather Icon">
            <p>${info.temp.toFixed(1)}°C</p>
        `;
      forecastContainer.appendChild(forecastItem);
    });

  document.getElementById("forecast-title").style.display = "block";
}
