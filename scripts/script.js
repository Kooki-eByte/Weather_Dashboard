var lat;
var lon;
// let cityName = "boston";

const listHolder = $("#search-holder");

const now = moment().format("LL");
console.log(now);

function addCityToList(city) {
  // <li class="list-group-item" id="city-0">Boston</li>
  let createLi = $("<li>");
  createLi.text(city);
  createLi.attr("class", "list-group-item");
  createLi.attr("id", "city-0");
  listHolder.prepend(createLi);
}

function displayMainForecast(response) {
  console.log(response);
}

function display5DayForecast() {}

// $.ajax({
//   url: queryUrlMain,
//   method: "GET",
// }).then(function (response) {
//   console.log("------- One day forecast -------");
//   lat = response.coord.lat;
//   lon = response.coord.lon;
//   console.log(response);
//   console.log(response.name); // city name
//   console.log(response.main.temp); // temp in kelvin
//   console.log(response.main.humidity); // humidity
//   console.log(response.wind.speed); // wind speed
//   //   console.log(response);
//   let queryUrl5Day =
//     "https://api.openweathermap.org/data/2.5/onecall?lat=" +
//     lat +
//     "&lon=" +
//     lon +
//     "&exclude=current,minutely,hourly&appid=b69a42c83210378fa102751081b2696f";

//   $.ajax({
//     url: queryUrl5Day,
//     method: "GET",
//   }).then(function (response) {
//     console.log("------- 5 day forecast -------");
//     console.log(response);
//   });
// });

$(".search-btn").on("click", function (event) {
  event.preventDefault();

  let cityName = $(".user-search").val();
  if (cityName !== "") {
    addCityToList(cityName);

    let queryUrlMain =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=b69a42c83210378fa102751081b2696f";
    displayMainForecast(queryUrlMain);

    $.ajax({
      url: queryUrlMain,
      method: "GET",
    }).then(displayMainForecast);
  } else {
    return $(".user-search").val("");
  }
});
