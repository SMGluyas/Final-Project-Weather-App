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
  
    let hour = currentTime.getHours();
    if (hour < 10) {
      hour = `0${hour}`;
    }
    let minutes = currentTime.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
  
    return `${day} ${hour}:${minutes}`;
  }

  function showWeatherInfo(response) {
    let iconElement=document.querySelector("#currentIcon");

    document.querySelector("h2").innerHTML = response.data.name;
    document.querySelector("#time").innerHTML = showCurrentTime(response.data.dt * 1000);
    document.querySelector("#weatherDescription").innerHTML = response.data.weather[0].main;
    document.querySelector("#current-temp-fig").innerHTML = Math.round(response.data.main.temp);
    document.querySelector("#min").innerHTML = Math.round(response.data.main.temp_min);
    document.querySelector("#max").innerHTML = Math.round(response.data.main.temp_max);
    document.querySelector("#humidity-fig").innerHTML = Math.round(response.data.main.humidity);
    document.querySelector("#wind-speed").innerHTML = Math.round(response.data.wind.speed);
    iconElement.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
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
    temperatureElement.innerHTML = Math.round((temperature * 9) / 5 + 32);
    let unit = document.querySelector(".unit");
    unit.innerHTML = `°F`;
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