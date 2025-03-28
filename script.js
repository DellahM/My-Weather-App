let weather = {
    apiKey: "e2c1d873e17655abe9c9bdf6946db59d",
    currentCity: "Nairobi",
    
    fetchWeather: function(city) {
        const weatherElement = document.querySelector(".weather");
        weatherElement.classList.add("loading");
        
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${this.apiKey}`)
            .then(response => {
                if (!response.ok) throw new Error("City not found");
                return response.json();
            })
            .then(data => {
                this.displayWeather(data);
                weatherElement.classList.remove("loading");
            })
            .catch(error => {
                console.error("Error:", error);
                this.showError(`Cannot find "${city}". Try formats like:
- Sydney, AU
- London, GB
- New York, US`);
                weatherElement.classList.remove("loading");
            });
    },
    
    displayWeather: function(data) {
        const { name } = data;
        const { icon, description, main } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        const { country } = data.sys;
        const timezone = data.timezone;
        
        document.querySelector(".city").innerText = `Weather in ${name}, ${country}`;
        document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = `${Math.round(temp)}°C`;
        document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
        document.querySelector(".wind").innerText = `Wind: ${Math.round(speed)} km/h`;
        
        this.updateTime(timezone);
        this.setBackground(main, description);
    },
    
    updateTime: function(timezone) {
        const offsetMilliseconds = timezone * 1000;
        const now = new Date();
        const cityTime = new Date(now.getTime() + offsetMilliseconds + now.getTimezoneOffset() * 60000);
        
        const options = {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit'
        };
        
        const timeString = cityTime.toLocaleTimeString("en-US", options);
        document.querySelector(".time").innerText = `Local: ${timeString}`;
    },
    
    setBackground: function(weatherCondition, description) {
        const container = document.querySelector('.weather-animations');
        container.innerHTML = '';
        
        const condition = weatherCondition.toLowerCase();
        const desc = description.toLowerCase();
        
        if (condition === "clear") {
            this.createSun(container);
            // Add some cirrus clouds for clear days
            if (Math.random() > 0.3) {
                this.createCirrusClouds(container);
            }
        } 
        else if (condition === "clouds") {
            if (desc.includes("few") || desc.includes("scattered")) {
                this.createFewClouds(container);
                this.createSun(container);
            } else if (desc.includes("broken")) {
                this.createBrokenClouds(container);
            } else {
                this.createOvercast(container);
            }
        }
        else if (condition === "rain" || desc.includes("drizzle")) {
            this.createRain(container);
        }
        else if (condition === "thunderstorm") {
            this.createStorm(container);
        }
        else if (condition === "snow") {
            this.createSnow(container);
        }
        else {
            this.createDefault(container);
        }
    },
    
    createSun: function(container) {
        const sun = document.createElement('div');
        sun.className = 'weather-element sun';
        container.appendChild(sun);
    },
    
    createFewClouds: function(container) {
        const cloudCount = Math.floor(Math.random() * 2) + 2;
        
        for (let i = 0; i < cloudCount; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'weather-element cloud';
            
            cloud.style.top = `${Math.random() * 30 + 15}%`;
            cloud.style.left = `-${Math.random() * 20 + 10}%`;
            cloud.style.animationDuration = `${Math.random() * 60 + 80}s`;
            cloud.style.opacity = `${Math.random() * 0.2 + 0.6}`;
            
            container.appendChild(cloud);
        }
    },
    
    createBrokenClouds: function(container) {
        const cloudCount = Math.floor(Math.random() * 4) + 3;
        
        for (let i = 0; i < cloudCount; i++) {
            const cloud = document.createElement('div');
            
            const cloudType = Math.random();
            if (cloudType < 0.5) {
                cloud.className = 'weather-element cumulus-cloud';
            } else {
                cloud.className = 'weather-element cloud';
            }
            
            cloud.style.top = `${Math.random() * 50 + 10}%`;
            cloud.style.left = `-${Math.random() * 20 + 10}%`;
            cloud.style.animationDuration = `${Math.random() * 40 + 60}s`;
            cloud.style.animationDelay = `${Math.random() * 20}s`;
            cloud.style.opacity = `${Math.random() * 0.3 + 0.6}`;
            
            container.appendChild(cloud);
        }
    },
    
    createOvercast: function(container) {
        const cloudCount = Math.floor(Math.random() * 3) + 4;
        
        for (let i = 0; i < cloudCount; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'weather-element stratus-cloud';
            
            cloud.style.top = `${Math.random() * 30 + 10}%`;
            cloud.style.left = `-${Math.random() * 20 + 10}%`;
            cloud.style.animationDuration = `${Math.random() * 50 + 70}s`;
            cloud.style.animationDelay = `${Math.random() * 15}s`;
            cloud.style.opacity = `${Math.random() * 0.2 + 0.7}`;
            
            container.appendChild(cloud);
        }
    },
    
    createCirrusClouds: function(container) {
        const cloudCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < cloudCount; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'weather-element cirrus-cloud';
            
            cloud.style.top = `${Math.random() * 20 + 10}%`;
            cloud.style.left = `-${Math.random() * 20 + 10}%`;
            cloud.style.animationDuration = `${Math.random() * 80 + 100}s`;
            cloud.style.animationDelay = `${Math.random() * 30}s`;
            
            container.appendChild(cloud);
        }
    },
    
    createRain: function(container) {
        this.createOvercast(container);
        
        const rainCount = Math.floor(Math.random() * 40) + 60;
        for (let i = 0; i < rainCount; i++) {
            const drop = document.createElement('div');
            drop.className = 'weather-element rain-drop';
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(drop);
        }
    },
    
    createStorm: function(container) {
        this.createRain(container);
        
        // Add 2-3 lightning strikes
        const lightningCount = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < lightningCount; i++) {
            const lightning = document.createElement('div');
            lightning.className = 'weather-element lightning';
            lightning.style.left = `${Math.random() * 80 + 10}%`;
            lightning.style.animationDelay = `${Math.random() * 5}s`;
            container.appendChild(lightning);
        }
    },
    
    createSnow: function(container) {
        this.createOvercast(container);
        
        const snowCount = Math.floor(Math.random() * 50) + 50;
        for (let i = 0; i < snowCount; i++) {
            const flake = document.createElement('div');
            flake.className = 'weather-element snowflake';
            flake.style.left = `${Math.random() * 100}%`;
            flake.style.top = `-${Math.random() * 20}%`;
            flake.style.animationDuration = `${Math.random() * 8 + 5}s`;
            flake.style.opacity = `${Math.random() * 0.5 + 0.3}`;
            flake.style.width = `${Math.random() * 4 + 4}px`;
            flake.style.height = flake.style.width;
            container.appendChild(flake);
        }
    },
    
    createDefault: function(container) {
        this.createBrokenClouds(container);
    },
    
    showError: function(message) {
        const weatherDiv = document.querySelector(".weather");
        weatherDiv.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Error</h3>
                <p>${message}</p>
            </div>
        `;
    },
    
    search: function() {
        const city = document.querySelector(".search-bar").value.trim();
        if (city) {
            this.fetchWeather(city);
        } else {
            alert("Please enter a city name");
        }
    }
};

// Event listeners
document.querySelector(".search button").addEventListener("click", () => weather.search());
document.querySelector(".search-bar").addEventListener("keyup", (e) => {
    if (e.key === "Enter") weather.search();
});

// Initialize
weather.fetchWeather("Nairobi");