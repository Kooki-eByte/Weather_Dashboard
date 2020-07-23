$(document).ready(function () {
  var lat;
  var lon;
  // let cityName = "boston";

  const listHolder = $("#search-holder");

  const now = moment().format("LL");

  function addCityToList(city) {
    let createLi = $("<li>");
    createLi.text(city);
    createLi.attr("class", "list-group-item");
    createLi.attr("id", "city-0");
    listHolder.prepend(createLi);
  }

  function getMainForecast(queryUrl) {
    $.ajax({
      url: queryUrl,
      method: "GET",
    }).then(function (response) {
      console.log("------- One day forecast -------");
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
    $("#jumbo-temp").text(Math.ceil(temp));

    // humid
    $("#jumbo-humid").text(humidity + "%");

    // wind
    $("#jumbo-wind").text(windSpd + " MPH");

    // UV index will be displayed in the 5 day api since that one holds the uv index
  }

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
      console.log("------- 5 day forecast -------");
      console.log(response);

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

      console.log(dailyDateArr);
      console.log(dailyIconArr);
      console.log(dailyTempArr);
      console.log(dailyHumidArr);

      display5DayForecast(
        dailyDateArr,
        dailyIconArr,
        dailyTempArr,
        dailyHumidArr
      );
    });
  }

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
      tempForecast.text(dailyTempF[i]);
      // Humidity
      let humidForecast = $("#forecast-humid-" + i);
      humidForecast.text(dailyHumid[i]);
    }
  }

  $(".search-btn").on("click", (event) => {
    event.preventDefault();

    let cityName = $(".user-search").val();

    if (cityName !== "") {
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
});
