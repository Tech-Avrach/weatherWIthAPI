$(document).ready(function () {

  let timeEl = $("#time");
  let dateEl = $("#date");
  let currentWeatherItemsEl = $("#current-weather-items");
  let timezone = $("#time-zone");
  let countryEl = $("#country");
  let feelsTemp = $("#feels-temp");
  let searchBtn = $("#search-btn");

  const API = "381c812e90d7f453ece3c3474a196f57";

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  getWeatherData();

  setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? "PM" : "AM";

    timeEl.html(
      (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes) +
        `<span id="am-pm">${ampm}</span>`
    );

    dateEl.html(days[day] + ", " + date + " " + months[month]);
  }, 1000);

  searchBtn.click(function () {
    var loc = $("#input").val();
    $.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${loc}&units=metric&appid=${API}`,
      function (data, status) {
        showWeatherData(data);
        console.log(data);
        console.log(status);
      }
    ).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(`Error: ${textStatus} - ${errorThrown}`);
      $("#input").val("Somthing Wrong");
    });
  });

  function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
      let { latitude, longitude } = success.coords;
      console.log(latitude);
      console.log(longitude);

      $.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API}`,
        function (data, status) {
          showWeatherData(data);
          console.log(data);
          console.log(status);
        }
      ).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(`Error: ${textStatus} - ${errorThrown}`);
        
      });
    });
  }

  function showWeatherData(data) {
    let { humidity, pressure, feels_like, temp_min, temp_max } = data.main;
    let { sunrise, sunset } = data.sys;
    let { speed } = data.wind;
    let {name}=data
    let time = new Date();
    let day = time.getDay();
    let weath = data.weather;
    console.log(weath);

    timezone.html = data.timezone;
    countryEl.html = data.lat + "N " + data.lon + "E";

    currentWeatherItemsEl.html(
      `<div class="weather-item">
      <div>Humidity</div>
      <div>${humidity}%</div>
  </div>
  <div class="weather-item">
      <div>Pressure</div>
      <div>${pressure}</div>
  </div>
  <div class="weather-item">
      <div>Wind Speed</div>
      <div>${speed}</div>
  </div>
  <div class="weather-item">
        <div>Maximum Temp</div>
        <div>${temp_min}&#176; C</div>
    </div>
    <div class="weather-item">
        <div>Minumam Temp</div>
        <div>${temp_max}&#176; C</div>
    </div>

  <div class="weather-item">
      <div>Sunrise</div>
      <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
  </div>
  <div class="weather-item">
      <div>Sunset</div>
      <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
  </div>
        
    `
    );
    console.log(feelsTemp);

    feelsTemp.html(
      ` <div class="today" id="current-temp">
        <img src="http://openweathermap.org/img/wn//${weath[0].icon}@4x.png" alt="weather icon" class="w-icon">
        <div class="other">
            <div class="day">${days[day]}</div>
            <div id="current-temp" class="current-temp">${feels_like}&#176;C</div>
            <div id="current-name" class="current-name">${name}</div>
        </div>
    </div>`
    );
  }
});
