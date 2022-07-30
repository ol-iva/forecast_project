let date = document.querySelector("h6.date");
let apiKey = "e7a0e5ad9471df9dbff483f56c2d189b";
let unit = "metric";

date.innerHTML = formatDate(new Date());

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

  return `${days[date.getDay()]} ${date.getHours()}:${date.getMinutes()}`;
}

let searchForm = document.querySelector("#search-form");

function changeTempByCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(url).then(showWeather);

  changeCity(city);
}

function showWeather(response) {
  console.log(response);
  let weather = response.data;
  let tempElement = document.querySelector("span#temperature-now");
  let humidityElement = document.querySelector("span#humidity-now");
  let windElement = document.querySelector("span#wind-now");

  tempElement.innerHTML = Math.round(weather.main.temp);
  humidityElement.innerHTML = `${weather.main.humidity} %`;
  windElement.innerHTML = `${weather.wind.speed} km/h`;
  changeCity(weather.name);
}

searchForm.addEventListener("submit", changeTempByCity);

// event on the button 'current'
let buttonCurrent = document.querySelector("#current");
buttonCurrent.addEventListener("click", current);

function current(event) {
  navigator.geolocation.getCurrentPosition(getCurrentTemp);
}

function getCurrentTemp(result) {
  let apiKey = "e7a0e5ad9471df9dbff483f56c2d189b";
  let unit = "metric";
  let longitude = result.coords.longitude;
  let latitude = result.coords.latitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;

  axios.get(url).then(showWeather);
}

function changeCity(value) {
  let currentCity = document.querySelector("#place");
  currentCity.innerHTML = value;
}
