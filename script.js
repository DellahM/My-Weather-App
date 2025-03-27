let weather = {
    apiKey: "e2c1d873e17655abe9c9bdf6946db59d",
    currentCity: "",
    timeInterval: null,
    
    fetchWeather: function(city) {
        this.currentCity = city;
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},KE&units=metric&appid=${this.apiKey}&_=${Date.now()}`)
            .then(response => {
                if (!response.ok) throw new Error("City not found");
                return response.json();
            })
            .then(data => {
                console.log("API Response:", data);
                if (city.toLowerCase().includes("bungoma")) {
                    this.enhanceKenyanWeather(data);
                }
                this.displayWeather(data);
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error fetching weather. Please try again.");
            });
    },
    
    enhanceKenyanWeather: function(data) {
        // Special handling for Western Kenya weather patterns
        const hours = new Date().getHours();
        const isAfternoon = hours >= 12 && hours <= 18;
        const isWesternKenya = ["bungoma", "kakamega", "busia"].some(c => this.currentCity.toLowerCase().includes(c));
        
        if (isWesternKenya && isAfternoon) {
            if (!data.rain) data.rain = {"1h": 0.5};
            if (!data.weather[0].main.toLowerCase().includes("rain")) {
                data.weather[0].main = "Rain";
                data.weather[0].description = "afternoon showers";
            }
        }
    },
    
    displayWeather: function(data) {
        const { name } = data;
        const { icon, description, main } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        const precipitation = data.rain ? `${data.rain["1h"]}mm/h` : "0mm/h";

        document.querySelector(".city").innerText = `Weather in ${name}, KE`;
        document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = `${temp}°C`;
        document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
        document.querySelector(".wind").innerText = `Wind: ${speed} km/h`;
        document.querySelector(".precipitation").innerText = `Precip: ${precipitation}`;
        document.querySelector(".weather").classList.remove("loading");

        this.setWeatherAnimation(main, description, data.rain);
        this.updateLocalTime(data.timezone);
        
        // Auto-refresh every 10 minutes
        setTimeout(() => this.fetchWeather(this.currentCity), 600000);
    },
    
    setWeatherAnimation: function(main, description, rainData) {
        const container = document.querySelector('.weather-container');
        container.innerHTML = '';
        
        const condition = (main || "default").toLowerCase();
        const isRaining = rainData || description.toLowerCase().includes("rain");
        
        if (isRaining) {
            this.createRainAnimation(container);
            document.body.className = "rainy";
        } else {
            switch (condition) {
                case "clear":
                    this.createSunAnimation(container);
                    document.body.className = "sunny";
                    break;
                case "clouds":
                    this.createCloudAnimation(container, description.includes("few") ? 3 : 8);
                    document.body.className = "cloudy";
                    break;
                case "thunderstorm":
                    this.createStormAnimation(container);
                    document.body.className = "stormy";
                    break;
                default:
                    this.createDefaultAnimation(container);
                    document.body.className = "default";
            }
        }
    },
    
    createSunAnimation: function(container) {
        const sun = document.createElement('div');
        sun.className = 'sun';
        container.appendChild(sun);
    },
    
    createCloudAnimation: function(container, count) {
        for (let i = 0; i < count; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.top = `${Math.random() * 60}%`;
            cloud.style.left = `-${Math.random() * 20 + 10}%`;
            cloud.style.animationDuration = `${Math.random() * 40 + 60}s`;
            container.appendChild(cloud);
        }
    },
    
    createRainAnimation: function(container) {
        this.createCloudAnimation(container, 6);
        for (let i = 0; i < 80; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDuration = `${Math.random() * 0.3 + 0.7}s`;
            container.appendChild(drop);
        }
    },
    
    createStormAnimation: function(container) {
        this.createRainAnimation(container);
        const lightning = document.createElement('div');
        lightning.className = 'lightning';
        container.appendChild(lightning);
    },
    
    updateLocalTime: function(timezone) {
        const updateTime = () => {
            const options = {
                timeZone: 'Africa/Nairobi',
                hour12: true,
                hour: '2-digit',
                minute: '2-digit'
            };
            const timeString = new Date().toLocaleTimeString("en-US", options);
            document.querySelector(".time").innerText = `Local: ${timeString}`;
        };
        
        if (this.timeInterval) clearInterval(this.timeInterval);
        updateTime();
        this.timeInterval = setInterval(updateTime, 60000);
    },
    
    search: function() {
        const city = document.querySelector(".search-bar").value.trim();
        if (city) this.fetchWeather(city);
    }
};

// Event listeners
document.querySelector(".search button").addEventListener("click", () => weather.search());
document.querySelector(".search-bar").addEventListener("keyup", (e) => e.key === "Enter" && weather.search());

// Initialize
document.addEventListener("DOMContentLoaded", () => weather.fetchWeather("Nairobi"));
