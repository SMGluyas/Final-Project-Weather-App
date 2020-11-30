function showCurrentTime(timestamp) {
  let currentTime = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[currentTime.getDay()];

  return `${day} ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);    
  let hour = date.getHours();
    if (hour < 10) {
      hour = `0${hour}`;
    }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hour}:${minutes}`
}

function showWeatherInfo(response) {
  let h2 = document.querySelector("h2");
  let updatedTime = document.querySelector("#time");
  let weatherDescriptionElement = document.querySelector("#weatherDescription");
  let weatherDescription = response.data.weather[0].main;
  let backgroundImageElement = document.querySelector(".container")
  let iconElement=document.querySelector("#currentIcon");
  let temperatureElement = document.querySelector("#current-temp-fig");
  let humidityElement = document.querySelector("#humidity-fig");
  let windSpeedElement = document.querySelector("#wind-speed");

  celsiusTemperature = response.data.main.temp;

  h2.innerHTML = response.data.name;
  updatedTime.innerHTML = showCurrentTime(response.data.dt * 1000);
  iconElement.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  humidityElement.innerHTML = Math.round(response.data.main.humidity);
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed);
  weatherDescriptionElement.innerHTML = weatherDescription;
  if (weatherDescription === "Rain") {
    backgroundImageElement.style.backgroundImage= "url(img/rain.jpg)";
  } else {
    if (weatherDescription === "Clouds" | weatherDescription === "Mist") {
      backgroundImageElement.style.backgroundImage = "url(img/overcast.jpg)";
    } else {
      if (weatherDescription === "Clear") {
        backgroundImageElement.style.backgroundImage = "url(img/sunny.jpg)";
      } else {
        if (weatherDescription === "Thunderstorm") {
          backgroundImageElement.style.backgroundImage = "url(img/storm.jpg)";
        }
      }
    }
  }
}

function showForecast(response) {
  let forecastElement = document.querySelector("#forecast-row");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `<div class="col-2">
    <div class="forecastTime">${formatHours(forecast.dt * 1000)}</div>
    <div class="forecastIcon"><img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="" class="forecastImage"/></div>
    <div><span id="forecast-max">${Math.round(forecast.main.temp_max)}</span><span class="unit">°C</span></div>
    <div><span id="forecast-min">${Math.round(forecast.main.temp_min)}</span><span class="unit">°C</span></div>
    </div>`;
  }
}

function findLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "275de0c841d02a257509e4dea098d5d3";
  let geolocationUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(geolocationUrl).then(showWeatherInfo);

  geolocationUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(geolocationUrl).then(showForecast);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(findLocation);
}

function showCity(city) {
  let apiKey = "275de0c841d02a257509e4dea098d5d3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeatherInfo);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function searchFunction(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  showCity(city);
}

function showFarenheight(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp-fig");
  convertToFarenheight.classList.remove("clickable");
  convertToCelsius.classList.add("clickable");
  temperatureElement.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32); 
}

function showCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp-fig");
  convertToCelsius.classList.remove("clickable");
  convertToFarenheight.classList.add("clickable");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let searchForm = document.querySelector("div.card");
searchForm.addEventListener("submit", searchFunction);

let currentLocation = document.querySelector("#find-location-button");
currentLocation.addEventListener("click", getCurrentPosition);

let convertToFarenheight = document.querySelector("#farenheight-unit");
convertToFarenheight.addEventListener("click", showFarenheight);

let convertToCelsius = document.querySelector("#celsius-unit");
convertToCelsius.addEventListener("click", showCelsius);

showCity("Auckland");