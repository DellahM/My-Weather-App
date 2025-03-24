let weather = {
    apiKey: "e2c1d873e17655abe9c9bdf6946db59d",
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("City not found");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data))
            .catch((error) => {
                console.error("Error fetching weather data:", error);
                alert("City not found. Please try again.");
            });
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description, main } = data.weather[0]; // Use `main` for weather condition
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        const { country } = data.sys;
        const timezone = data.timezone;

        document.querySelector(".city").innerText = "Weather in " + name + ", " + country;
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");

        // Update local time
        this.updateLocalTime(timezone);

        // Update background based on weather condition
        this.setWeatherAnimation(main || "default");
        
        console.log("Weather condition:", main); // Debug log
    },
    updateLocalTime: function (timezone) {
        const localTimeElement = document.getElementById("local-time");
        const now = new Date();
        const localTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (timezone * 1000));
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        localTimeElement.innerText = localTime.toLocaleTimeString('en-US', options);
        
        // Update time every second
        if (this.timeInterval) clearInterval(this.timeInterval);
        this.timeInterval = setInterval(() => {
            const updatedTime = new Date(new Date().getTime() + (now.getTimezoneOffset() * 60000) + (timezone * 1000));
            localTimeElement.innerText = updatedTime.toLocaleTimeString('en-US', options);
        }, 1000);
    },
    setWeatherAnimation: function (weatherCondition) {
        console.log("Setting animation for:", weatherCondition); // Debug log
        
        // Clear previous weather container if exists
        const oldContainer = document.querySelector('.weather-container');
        if (oldContainer) {
            oldContainer.remove();
        }
        
        // Reset body classes
        document.body.className = "";
        
        // Create new weather container
        const weatherContainer = document.createElement('div');
        weatherContainer.className = 'weather-container';
        document.body.appendChild(weatherContainer);
        
        // Convert to lowercase and handle null/undefined
        const condition = (weatherCondition || "default").toLowerCase();
        
        // Set animation based on weather condition
        switch (condition) {
            case "clear":
                this.createSunnyAnimation(weatherContainer);
                document.body.classList.add("sunny");
                break;
            case "clouds":
                this.createCloudyAnimation(weatherContainer);
                document.body.classList.add("cloudy");
                break;
            case "rain":
            case "drizzle":
                this.createRainyAnimation(weatherContainer);
                document.body.classList.add("rainy");
                break;
            case "thunderstorm":
                this.createStormyAnimation(weatherContainer);
                document.body.classList.add("stormy");
                break;
            case "snow":
                this.createSnowyAnimation(weatherContainer);
                document.body.classList.add("snowy");
                break;
            default:
                this.createDefaultAnimation(weatherContainer);
                document.body.classList.add("default");
                break;
        }
    },
    createSunnyAnimation: function(container) {
        console.log("Creating sunny animation"); // Debug log
        
        // Create sun
        const sun = document.createElement('div');
        sun.className = 'sun';
        container.appendChild(sun);
        
        // Create some small clouds for realistic effect
        for (let i = 0; i < 2; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.top = (Math.random() * 30 + 10) + '%';
            cloud.style.left = '-' + (Math.random() * 10 + 5) + '%';
            cloud.style.opacity = '0.5';
            cloud.style.animationDuration = (Math.random() * 30 + 60) + 's';
            container.appendChild(cloud);
        }
    },
    createCloudyAnimation: function(container) {
        console.log("Creating cloudy animation"); // Debug log
        
        // Create multiple clouds
        for (let i = 0; i < 8; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.top = (Math.random() * 60) + '%';
            cloud.style.left = '-' + (Math.random() * 20 + 10) + '%';
            cloud.style.animationDuration = (Math.random() * 40 + 60) + 's';
            cloud.style.opacity = (Math.random() * 0.4 + 0.6).toString();
            cloud.style.transform = 'scale(' + (Math.random() * 0.5 + 0.5) + ')';
            container.appendChild(cloud);
        }
    },
    createRainyAnimation: function(container) {
        console.log("Creating rainy animation"); // Debug log
        
        // Create clouds
        this.createCloudyAnimation(container);
        
        // Create raindrops
        for (let i = 0; i < 100; i++) {
            const raindrop = document.createElement('div');
            raindrop.className = 'rain-drop';
            raindrop.style.left = Math.random() * 100 + '%';
            raindrop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            raindrop.style.animationDelay = (Math.random() * 5) + 's';
            container.appendChild(raindrop);
        }
    },
    createStormyAnimation: function(container) {
        console.log("Creating stormy animation"); // Debug log
        
        // Create rainy animation first
        this.createRainyAnimation(container);
        
        // Add lightning effects
        for (let i = 0; i < 3; i++) {
            const lightning = document.createElement('div');
            lightning.className = 'lightning';
            lightning.style.animationDelay = (i * 3) + 's';
            container.appendChild(lightning);
        }
    },
    createSnowyAnimation: function(container) {
        console.log("Creating snowy animation"); // Debug log
        
        // Create cloudy background
        this.createCloudyAnimation(container);
        
        // Create snowflakes
        for (let i = 0; i < 100; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.style.left = Math.random() * 100 + '%';
            snowflake.style.opacity = Math.random() * 0.8 + 0.2;
            snowflake.style.animationDuration = (Math.random() * 5 + 10) + 's';
            snowflake.style.width = snowflake.style.height = (Math.random() * 5 + 3) + 'px';
            container.appendChild(snowflake);
        }
    },
    createDefaultAnimation: function(container) {
        console.log("Creating default animation"); // Debug log
        
        // Create a mild sunny and cloudy mix
        const sun = document.createElement('div');
        sun.className = 'sun';
        sun.style.opacity = '0.7';
        container.appendChild(sun);
        
        // Add some clouds
        for (let i = 0; i < 4; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.top = (Math.random() * 40 + 10) + '%';
            cloud.style.opacity = '0.6';
            cloud.style.animationDuration = (Math.random() * 30 + 70) + 's';
            container.appendChild(cloud);
        }
    },
    search: function () {
        const city = document.querySelector(".search-bar").value;
        if (city) {
            this.fetchWeather(city);
        } else {
            alert("Please enter a city name.");
        }
    }
};

// Event listeners for search button and Enter key
document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        weather.search();
    }
});

// Default city
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded, fetching weather");
    weather.fetchWeather("Nairobi");
});