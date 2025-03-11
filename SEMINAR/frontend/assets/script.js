const API_KEY = "60f1a7410c9246060a3678004bef8b53";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchButton").addEventListener("click", fetchWeather);
});

function fetchWeather() {
    const location = document.getElementById("searchInput").value.trim();
    if (!location) {
        alert("Vui lòng nhập quận/huyện!");
        return;
    }

    const url = `${API_URL}?q=${location},VN&units=metric&appid=${API_KEY}&lang=vi`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Không tìm thấy địa điểm");
            }
            return response.json();
        })
        .then(data => updateWeatherUI(data))
        .catch(error => {
            console.error("Lỗi lấy dữ liệu:", error);
            alert("Không tìm thấy địa điểm! Hãy thử lại.");
        });
}

function updateWeatherUI(data) {
    document.getElementById("location").innerText = data.name;
    document.getElementById("temperature").innerText = data.main.temp;
    document.getElementById("humidity").innerText = data.main.humidity;
    document.getElementById("windSpeed").innerText = data.wind.speed;
    document.getElementById("status").innerText = data.weather[0].description;

    // Lấy phần tử icon thời tiết
    const weatherIcon = document.getElementById("weatherIcon");
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    // Đặt icon thành block và căn giữa lại
    weatherIcon.style.display = "block";
    weatherIcon.style.position = "absolute"; // Đảm bảo icon có position absolute
    weatherIcon.style.top = "50%";            // Căn giữa theo chiều dọc
    weatherIcon.style.left = "50%";           // Căn giữa theo chiều ngang
    weatherIcon.style.transform = "translate(-50%, -50%)";  // Căn giữa hoàn hảo

    // Thêm khoảng cách giữa icon và các thông tin
    weatherIcon.style.marginBottom = "10px"; // Tạo khoảng cách dưới cho icon

    // Tạo khoảng cách trên cho chữ (nếu cần)
    const weatherInfo = document.querySelector(".weather-info");
    if (weatherInfo) {
        weatherInfo.style.paddingTop = "20px"; // Tạo khoảng cách trên cho chữ
    }
}

