// Module Imports
import * as model from "./model.js";
import recentLocationView from "./views/recentLocationView.js";
import topLocationView from "./views/topLocationView.js";
import searchView from "./views/searchView.js";
import { View } from "./views/View.js";
import "core-js";
import "regenerator-runtime";

// const body = document.getElementById("body");
// const header = document.querySelector(".header");
// const main = document.querySelector(".main");
const searchForm = document.querySelector(".search");
const searchInput = document.querySelector(".search__field");
const searchbarContent = document.querySelector(".search-bar__content");
const currentLocationBar = document.querySelector(".current-location");
const currentLocationLink = document.querySelector(".current-locationLink");
const overlay = document.querySelector(".overlay");
const recentLocationsContainer = document.querySelector(".recent-locations");
const topLocationsContainer = document.querySelector(".top-locations");
// const locationInfo = document.querySelector(".location__info");

searchInput.addEventListener("click", function () {
  currentLocationBar.classList.remove("hidden");
  currentLocationLink.classList.remove("hidden");
  searchbarContent.style.borderRadius = "0.5rem 0.5rem 0 0";
  overlay.classList.remove("hidden");
});

overlay.addEventListener("click", function () {
  currentLocationBar.classList.add("hidden");
  currentLocationLink.classList.add("hidden");
  searchbarContent.style.borderRadius = "0.5rem";
  overlay.classList.add("hidden");
});

// RapidAPI key1 = 03e4e42c3fmsh46008762cdcc09dp18dd76jsn2a5f64b69cce
// RapidAPI key2 = bcca1ee0e3msh3f17aa5dd4bb138p169f1ejsncfec43f61301

// Location API call
const locationApiCall = async function (query) {
  try {
    return await model.getLocation(query);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// WEATHER API CALL
// Recent Location
const recentLocationWeather = async function (locality, query) {
  try {
    await model.getWeatherInfo(locality, query);

    // -avoiding duplicate locations
    const newRecentLocations = model.state.recentLocations.filter(
      (location) => location.id !== model.state.locationWeatherInfo.id
    );
    model.state.recentLocations = newRecentLocations;

    // -limiting the recentLocation array to three elements
    if (model.state.recentLocations.length === 3) {
      model.state.recentLocations.shift();
    }

    // -adding to recent locations array
    model.state.recentLocations.push(model.state.locationWeatherInfo);

    // -clearing input field
    searchView.clearInput();

    // 2. Rendering recent location on card
    recentLocationsContainer.innerHTML = "";
    recentLocationView.renderAll(model.state.recentLocations);

    model.persistRecentLocations();

    // // 1. Loading Weather Info
    // const response = await fetch(url, options);
    // const result = await response.json();

    // const lat = result.location.lat.toString().slice(-5);
    // const lon = result.location.lon.toString().slice(-5);
    // const latLon = [lat, lon];

    // class dailyWeatherDetailsTemplate {
    //   constructor(i) {
    //     this.date = this.weatherDate(i);
    //     this.values = this.weatherValues(i);
    //   }

    //   weatherDate(i) {
    //     return result.timelines.daily[i].time.slice(0, 10);
    //   }

    //   weatherValues(i) {
    //     return {
    //       cloudCover: Math.round(
    //         result.timelines.daily[i].values.cloudCoverAvg
    //       ),
    //       dewPoint: Math.round(result.timelines.daily[i].values.dewPointAvg),
    //       humidity: Math.round(result.timelines.daily[i].values.humidityAvg),
    //       pressure: Math.round(
    //         result.timelines.daily[i].values.pressureSurfaceLevelAvg
    //       ),
    //       temperature: Math.round(
    //         result.timelines.daily[i].values.temperatureAvg
    //       ),
    //       windGust: Math.round(result.timelines.daily[i].values.windGustAvg),
    //     };
    //   }
    // }

    // const locationWeatherInfo = {
    //   id: latLon.join(""),
    //   ...{ ...(await locationApiCall(query)) },
    //   weatherDetails: {
    //     day1: new dailyWeatherDetailsTemplate(0),
    //     day2: new dailyWeatherDetailsTemplate(1),
    //     day3: new dailyWeatherDetailsTemplate(2),
    //     day4: new dailyWeatherDetailsTemplate(3),
    //   },
    // };

    // console.log(locationWeatherInfo);

    // // avoiding duplicate locations
    // const newRecentLocations = recentLocations.filter(
    //   (location) => location.id !== locationWeatherInfo.id
    // );
    // recentLocations = newRecentLocations;

    // // limiting the recentLocation array to three elements
    // if (recentLocations.length === 3) {
    //   recentLocations.shift();
    // }

    // recentLocations.push(locationWeatherInfo);

    // // 2. Rendering recent location on card
    // recentLocationsContainer.innerHTML = "";

    // recentLocations.forEach((location) => {
    //   const markup = `
    //       <a class="location__info fade-in" href="detail/">
    //         <h3 class="city">${
    //           location.locality ? location.locality : location.region
    //         }</h3>
    //         <p class="country">${location.country}</p>
    //         <div class="temperature">
    //           <i class="fa fa-cloud-sun"></i>
    //           <p>${
    //             location.weatherDetails.day1.values.temperature
    //           } ̊<span>C</span></p>
    //           </div>
    //       </a>
    //     `;

    //   recentLocationsContainer.insertAdjacentHTML("afterbegin", markup);
    //   searchInput.value = "";
    // });
  } catch (error) {
    console.error(error);
  }
};

// Submitting search query
searchForm.addEventListener("submit", async function (e) {
  // e.preventDefault();

  const locationResult = await locationApiCall(searchView.getSearchQuery());
  recentLocationWeather(locationResult.locality, searchView.getSearchQuery());
});

// Using current location
currentLocationBar.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(
    async function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      const latlon = [latitude, longitude].join(",");
      console.log(latlon);

      const locationResult = await locationApiCall(latlon);
      console.log(locationResult);
      recentLocationWeather(locationResult.locality, latlon);
    },
    function () {
      alert("Could not get your current location!");
    }
  );
});

// Top Locations
const topLocationWeather = async function (locality, query) {
  try {
    // 1. Loading Weather Info
    await model.getWeatherInfo(locality, query);

    // avoiding duplicate locations
    const newTopLocations = model.state.topLocations.filter(
      (location) => location.id !== model.state.locationWeatherInfo.id
    );
    model.state.topLocations = newTopLocations;

    // adding to top locations array
    model.state.topLocations.push(model.state.locationWeatherInfo);

    // 2. Rendering top locations on card
    topLocationView.render(model.state.locationWeatherInfo);
  } catch (error) {
    console.error(error);
  }
};

const topCities = [
  "abuja",
  "london",
  "washington dc",
  "beijing",
  "brasilia",
  "canberra",
];

const loadTopLocations = function (city) {
  (async function () {
    const locationResult = await locationApiCall(city);
    topLocationWeather(locationResult.locality, city);
  })();
};

loadTopLocations(topCities[0]);

setTimeout(() => {
  loadTopLocations(topCities[1]);
}, 2 * 1000);

setTimeout(() => {
  loadTopLocations(topCities[2]);
}, 4 * 1000);

setTimeout(() => {
  loadTopLocations(topCities[3]);
}, 6 * 1000);

setTimeout(() => {
  loadTopLocations(topCities[4]);
}, 8 * 1000);

setTimeout(() => {
  loadTopLocations(topCities[5]);
}, 10 * 1000);

const loadStorage = function () {
  recentLocationView.renderAll(model.state.recentLocations);
};
const subView = new View();

const initHandler = function () {
  subView.addHandlerStorage(loadStorage);
  // searchView.addHandlerSearch(recentLocationWeather, locationApiCall);
  // searchView.addHandlerCurrentLocation(recentLocationWeather, locationApiCall);
};
initHandler();
