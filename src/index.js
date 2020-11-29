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
  let iconElement=document.querySelector("#currentIcon");

  document.querySelector("h2").innerHTML = response.data.name;
  document.querySelector("#time").innerHTML = showCurrentTime(response.data.dt * 1000);
  document.querySelector("#weatherDescription").innerHTML = response.data.weather[0].main;
  if (response.data.weather[0].main === "Rain") {
    document.querySelector(".container").style.backgroundImage= "url(img/rain.jpg)";
  } else {
    if (response.data.weather[0].main === "Clouds" | response.data.weather[0].main === "Mist") {
      document.querySelector(".container").style.backgroundImage = "url(img/overcast.jpg)";
    } else {
      if (response.data.weather[0].main === "Clear") {
        document.querySelector(".container").style.backgroundImage = "url(img/sunny.jpg)";
      } else {
        if (response.data.weather[0].main === "Thunderstorm") {
          document.querySelector(".container").style.backgroundImage = "url(img/storm.jpg)";
        }
      }
    }
  }
  document.querySelector("#current-temp-fig").innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#min").innerHTML = Math.round(response.data.main.temp_min);
  document.querySelector("#max").innerHTML = Math.round(response.data.main.temp_max);
  document.querySelector("#humidity-fig").innerHTML = Math.round(response.data.main.humidity);
  document.querySelector("#wind-speed").innerHTML = Math.round(response.data.wind.speed);
  iconElement.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
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

let searchForm = document.querySelector("div.card");
searchForm.addEventListener("submit", searchFunction);

let currentLocation = document.querySelector("#find-location-button");
currentLocation.addEventListener("click", getCurrentPosition);

function showFarenheight(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp-fig");
  let temperature = (temperatureElement.innerHTML);
  temperature = Number(temperature);
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  temperatureElement.innerHTML = Math.round((temperature * 9) / 5 + 32);
  let unit = document.querySelector(".unit");
}
let convertToFarenheight = document.querySelector("#farenheight-unit");
convertToFarenheight.addEventListener("click", showFarenheight);

function showCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp-fig");
  let temperature = (temperatureElement.innerHTML);
  temperature = Number(temperature);
  temperatureElement.innerHTML = Math.round(((temperature - 32) * 5) / 9);
  let unit = document.querySelector(".unit");
  unit.innerHTML = `°C`;
}
let convertToCelsius = document.querySelector("#celsius-unit");
convertToCelsius.addEventListener("click", showCelsius);

showCity("Auckland");