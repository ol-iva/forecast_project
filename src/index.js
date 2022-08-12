let date = document.querySelector("#date");
let unit = document.querySelector("#units").value;
let searchForm = document.querySelector("#search-form");
let celsius = null;
let apiKey = "e7a0e5ad9471df9dbff483f56c2d189b";
let celsiusLinkElement = document.querySelector("#celsius");
let fahrenheitLinkElement = document.querySelector("#fahrenheit");
let dailyForecast = document.querySelector("#forecast-daily");

date.innerHTML = formatDate(new Date());
search('Ljubljana', apiKey, unit);

searchForm.addEventListener("submit", changeTempByCity);
fahrenheitLinkElement.addEventListener("click", showTemperatureFarenheit);
celsiusLinkElement.addEventListener("click", showTemperatureCelsius);

function changeTempByCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;

  search(city, apiKey, unit);
}

function search(city, apiKey) {
  unit = document.querySelector("#units").value;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(url).then(showWeather);
}

function showWeather(response) {
  let longitude = response.data.coord.lon;
  let latitude = response.data.coord.lat;
  let weather = response.data;
  let tempElement = document.querySelector("span#temperature-now");
  let humidityElement = document.querySelector("span#humidity-now");
  let windElement = document.querySelector("span#wind-now");
  let iconElement = document.querySelector("#main-icon");
  let dateElement = document.querySelector("#date");
  let descriptionElement = document.querySelector("#description");

  celsius = weather.main.temp;
  tempElement.innerHTML = Math.round(celsius);
  humidityElement.innerHTML = `${weather.main.humidity} %`;
  windElement.innerHTML = `${Math.round(weather.wind.speed)} m/s`;
  dateElement.innerHTML = formatDate(new Date(response.data.dt * 1000));
  descriptionElement.innerHTML = response.data.weather[0].description;

  changeColorBody(Math.round(celsius), unit);

  iconElement.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  changeCity(weather.name);

  callAPIForecast(longitude, latitude, apiKey, unit);
}

function changeCity(value) {
  let currentCity = document.querySelector("#place");
  currentCity.innerHTML = value;
}

function formatDateForecast(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = [
      "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  return  days[date.getDay()];
}

function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let weekDay = days[date.getDay()];
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  return `${weekDay} ${hours}:${minutes}`;
}

function callAPIForecast(longitude, latitude, apiKey) {
  unit = document.querySelector("#units").value;
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${apiKey}&units=${unit}`;
  axios.get(url).then(showForecast);
}

function showForecast(result) {
  let daily = '';
  let day = '';
  unit = document.querySelector("#units").value;

   result.data.daily.forEach(function(element, index){
      if (index < 6) {
        if (index === 0) {
          day = 'Today';
        } else if (index === 1) {
          day = 'Tomorrow';
        } else {
          day = formatDateForecast(element.dt);
        }
        daily += `<div class="day col-2">
                             <div class="day-title">
                                 <h5>${day}</h5>
                             </div>
                             <div class="img-sun">
                                 <img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png" alt="" class="sun-icon" />
                             </div>
                             <div class="avarage-temperature" style="${changeColorTemp(Math.round(element.temp.day), unit)}">
                                 <span class="max">${Math.round(element.temp.max)}&#176;</span>
                                 <span class="min">${Math.round(element.temp.min)}&#176</span>
                             </div>
                             <div class="wind">
                                 <span class="material-symbols-outlined"> air </span>
                                 <span class="wind-speed">${Math.round(element.wind_speed)}</span> m/s
                             </div>
                             <div class="humidity">
                             <div> ${showHumidity(element.humidity)}</div>
                                 <span class="humidity-number">${element.humidity}</span> %
                             </div>
                         </div>`;
      }
    });

   dailyForecast.innerHTML = daily;
}

function showHumidity(humidity) {
  if (humidity <= 40) {
    return `<span class="material-symbols-outlined">
humidity_low
</span>`;
  }
  if (humidity > 40 && humidity <= 60) {
    return `<span class="material-symbols-outlined">
humidity_mid
</span>`;
  }
  if (humidity > 60) {
    return `<span class="material-symbols-outlined">
humidity_high
</span>`;
  }
}

function changeColorTemp(temp, units) {
  let style = 'background-color:#333;color: #fff;';
  if ((units === "metric" && temp <= 0) || (units === "imperial" && temp <= 32)) {
    style = 'background-color:#004085; color: #fff;';
  }
  if ((units === "metric" && temp > 0 && temp <= 15) || (units === "imperial" && temp > 32 && temp <= 59)) {
    style = 'background-color:#3de8ff; color: #333333;';
  }
  if ((units === "metric" && temp > 15 && temp <= 25) || (units === "imperial" && temp > 59 && temp <= 77)) {
    style = 'background-color:#ffec3d; color: #333333;';
  }
  if ((units === "metric" && temp > 25 && temp <= 35) || (units === "imperial" && temp > 77 && temp <= 95)) {
    style = 'background-color:#ff8b3d; color: #333333;';
  }
  if ((units === "metric" && temp > 36) || (units === "imperial" && temp > 95)) {
    style = 'background-color:#ef4310; color: #333333;';
  }
  return style;
}

function changeColorBody(temp, units) {
  let body = document.querySelector("body");
  if ((units === "metric" && temp <= 0) || (units === "imperial" && temp <= 32)) {
    body.setAttribute("style", "background: rgba(0,64,133,.2);");
  }
  if ((units === "metric" && temp > 0 && temp <= 15) || (units === "imperial" && temp > 32 && temp <= 59)) {
    body.setAttribute("style", "background: rgba(61,232,255,.2);");
  }
  if ((units === "metric" && temp > 15 && temp <= 25) || (units === "imperial" && temp > 59 && temp <= 77)) {
    body.setAttribute("style", "background: rgba(255,236,61,.2);");
  }
  if ((units === "metric" && temp > 25 && temp <= 35) || (units === "imperial" && temp > 77 && temp <= 95)) {
    body.setAttribute("style", "background: rgba(255,139,61,.2);");
  }
  if ((units === "metric" && temp > 36) || (units === "imperial" && temp > 95)) {
    body.setAttribute("style", "background: rgba(239,67,16,.2);");
  }
}


function showTemperatureFarenheit(event) {
  event.preventDefault();

    let city = document.querySelector("#place").innerHTML;
 document.querySelector("#units").value = "imperial";

    search(city, apiKey);

  fahrenheitLinkElement.classList.add("active");
  celsiusLinkElement.classList.remove("active");
}

function showTemperatureCelsius(event) {
  event.preventDefault();
  let city = document.querySelector("#place").innerHTML;
  document.querySelector("#units").value = "metric";

  search(city, apiKey);
fahrenheitLinkElement.classList.remove("active");
celsiusLinkElement.classList.add("active");
}



