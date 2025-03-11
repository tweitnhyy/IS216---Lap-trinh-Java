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
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}