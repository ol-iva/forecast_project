let date = document.querySelector("h6.date");

let unit = "metric";
let searchForm = document.querySelector("#search-form");
let celsius = null;

date.innerHTML = formatDate(new Date());
search('Ljubljana');

searchForm.addEventListener("submit", changeTempByCity);

function changeTempByCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  search(city);
}

function search(city) {
  let apiKey = "e7a0e5ad9471df9dbff483f56c2d189b";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(url).then(showWeather);
}

function showWeather(response) {
  let weather = response.data;
  let tempElement = document.querySelector("span#temperature-now");
  let humidityElement = document.querySelector("span#humidity-now");
  let windElement = document.querySelector("span#wind-now");
  let iconElement = document.querySelector("#main-icon");
  let dateElement = document.querySelector("#date");

  celsius = weather.main.temp;
  tempElement.innerHTML = Math.round(celsius);
  humidityElement.innerHTML = `${weather.main.humidity} %`;
  windElement.innerHTML = `${weather.wind.speed} km/h`;
  date.innerHTML = formatDate(new Date(response.data.dt * 1000));

  iconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  changeCity(weather.name);
}

function changeCity(value) {
  let currentCity = document.querySelector("#place");
  currentCity.innerHTML = value;
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



