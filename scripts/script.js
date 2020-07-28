$(document).ready(function () {
  // global varibales
  const listHolder = $("#search-holder");
  const now = moment().format("LL");
  let counter = 0;
  let storedName = JSON.parse(localStorage.getItem("storedName"));

  // add the searched city name to a list and put it under the search bar
  function addCityToList(city) {
    counter++;
    let createLi = $("<li>");
    createLi.text(city);
    createLi.attr("class", "list-group-item");
    createLi.attr("id", "city");
    listHolder.prepend(createLi);
    if (counter > 10) {
      $("li", listHolder).last().remove();
    }
  }

  // get the main page forecast data
  function getMainForecast(queryUrl) {
    $.ajax({
      url: queryUrl,
      method: "GET",
    }).then(function (response) {
      let city = response.name; // city name
      let tempK = response.main.temp; // temp in kelvin
      let tempF = tempK * (9 / 5) - 459.67;
      let humid = response.main.humidity; // humidity
      let windSpeed = response.wind.speed; // wind speed
      let weatherIcon = response.weather[0].icon; // weather icon
      displayMainForecast(city, humid, windSpeed, weatherIcon, tempF);
      // Info for the 5 day forecast
      let lat = response.coord.lat;
      let lon = response.coord.lon;
      get5DayForecast(lat, lon);
    });
  }

  // Display the main page forecast
  function displayMainForecast(city, humidity, windSpd, WeatherIcon, temp) {
    // City title
    $("#city-info-title").text(city + " ");

    // todays date
    $("#today-date").text(now);

    // Weather icon
    $("#weather-icon").empty();
    let createImg = $("<img>");
    createImg.attr(
      "src",
      "http://openweathermap.org/img/wn/" + WeatherIcon + "@2x.png"
    );
    $("#weather-icon").append(createImg);

    // temp
    $("#jumbo-temp").text(Math.ceil(temp) + "\u00B0F");

    // humid
    $("#jumbo-humid").text(humidity + "%");

    // wind
    $("#jumbo-wind").text(windSpd + " MPH");

    // UV index will be displayed in the 5 day api since that one holds the uv index
  }

  // Get 5 day forecast Data
  function get5DayForecast(lati, long) {
    let queryUrl5Day =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lati +
      "&lon=" +
      long +
      "&exclude=current,minutely,hourly&appid=b69a42c83210378fa102751081b2696f";

    $.ajax({
      url: queryUrl5Day,
      method: "GET",
    }).then(function (response) {
      // Display the current day UV index
      let uvi = response.daily[0].uvi;
      $("#jumbo-uv").text(uvi);
      if (uvi >= 11) {
        $("#jumbo-uv").attr("style", "background-color: purple");
      } else if (uvi >= 8) {
        $("#jumbo-uv").attr("style", "background-color: red");
      } else if (uvi >= 6) {
        $("#jumbo-uv").attr("style", "background-color: orange");
      } else if (uvi >= 3) {
        $("#jumbo-uv").attr("style", "background-color: yellow");
      } else {
        $("#jumbo-uv").attr("style", "background-color: green");
      }

      // Getting data for the display Function
      let dailyDateArr = [];
      let dailyIconArr = [];
      let dailyTempArr = [];
      let dailyHumidArr = [];

      for (let i = 1; i < 6; i++) {
        dailyIconArr.push(response.daily[i].weather[0].icon);

        let tempK = response.daily[i].temp.max;
        let tempF = Math.ceil(tempK * (9 / 5) - 459.67);
        dailyTempArr.push(tempF);

        dailyHumidArr.push(response.daily[i].humidity);

        let date = response.daily[i].dt;
        let dailyDate = new Date(date * 1000).toLocaleDateString("en-US");
        dailyDateArr.push(dailyDate);
      }

      display5DayForecast(
        dailyDateArr,
        dailyIconArr,
        dailyTempArr,
        dailyHumidArr
      );
    });
  }

  // Display the 5 day forecast
  function display5DayForecast(dailyTime, dailyIcon, dailyTempF, dailyHumid) {
    for (let i = 0; i < dailyTempF.length; i++) {
      // date
      let dateForecast = $("#forecast-date-" + i);
      dateForecast.text(dailyTime[i]);
      // icon
      let iconForecast = $("#forecast-icon-" + i);
      iconForecast.attr(
        "src",
        "http://openweathermap.org/img/wn/" + dailyIcon[i] + "@2x.png"
      );
      // temp
      let tempForecast = $("#forecast-temp-" + i);
      tempForecast.text(dailyTempF[i] + "\u00B0F");
      // Humidity
      let humidForecast = $("#forecast-humid-" + i);
      humidForecast.text(dailyHumid[i] + "%");
    }
  }

  // function to grab the last searched city name in local storage and call the function with that city to start the page off
  function getCity() {
    if (localStorage.getItem("storedName") !== null) {
      let cityName = JSON.parse(localStorage.getItem("storedName"));

      let queryUrlMain = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b69a42c83210378fa102751081b2696f`;

      getMainForecast(queryUrlMain);
    }
  }

  getCity();

  // event listener for the search-btn
  $(".search-btn").on("click", (event) => {
    event.preventDefault();

    let cityName = $(".user-search").val().trim();
    storedName = $(".user-search").val().trim();
    if (cityName !== "") {
      localStorage.setItem("storedName", JSON.stringify(storedName));

      addCityToList(cityName);

      let queryUrlMain =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&appid=b69a42c83210378fa102751081b2696f";

      getMainForecast(queryUrlMain);
      $(".user-search").val("");
    } else {
      return $(".user-search").val("");
    }
  });

  // event listener for the list items
  $(document).on("click", "#city", (event) => {
    event.preventDefault();
    let cityName = event.target.textContent;
    let queryUrlMain =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=b69a42c83210378fa102751081b2696f";
    getMainForecast(queryUrlMain);
  });
});
