// Module Imports
import * as model from "./model.js";
import recentLocationView from "./views/recentLocationView.js";
import topLocationView from "./views/topLocationView.js";
import searchView from "./views/searchView.js";
import fullDetailView from "./views/fullDetailView.js";
import { View } from "./views/View.js";
import "core-js";
import "regenerator-runtime";
import { _ } from "core-js";

// const view = new View();

const recentLocationsContainer = document.querySelector(".recent-locations");
// RapidAPI key1 = 03e4e42c3fmsh46008762cdcc09dp18dd76jsn2a5f64b69cce
// RapidAPI key2 = bcca1ee0e3msh3f17aa5dd4bb138p169f1ejsncfec43f61301

// Location API call
const locationApiCall = async function (query, currentLocationBar) {
  try {
    return await model.getLocation(query, currentLocationBar);
  } catch (error) {
    throw error;
  }
};

// WEATHER API CALL
// Recent Location
const recentLocationWeather = async function (
  locality,
  query,
  currentLocationBar,
  clearView,
  renderView
) {
  try {
    await model.getWeatherInfo(locality, query, currentLocationBar);

    // -avoiding duplicate locations
    const newRecentLocations = model.state.recentLocations.filter(
      (location) => location.id !== model.state.locationWeatherInfo.id
    );
    model.state.recentLocations = newRecentLocations;

    // -avoiding duplicate cities
    const newRecentCities = model.state.recentCities.filter((city) => {
      const fetchedCity = model.state.locationWeatherInfo.locality
        ? model.state.locationWeatherInfo.locality
        : model.state.locationWeatherInfo.region;
      return city !== fetchedCity;
    });
    model.state.recentCities = newRecentCities;

    // -limiting the recentLocation array to three elements
    if (model.state.recentLocations.length === 3) {
      model.state.recentLocations.shift();
    }

    // -limiting the recentCities array to three elements
    if (model.state.recentCities.length === 3) {
      model.state.recentCities.shift();
    }

    // -adding to recent locations array
    model.state.recentLocations.push(model.state.locationWeatherInfo);

    // -storing recent cities
    model.state.recentCities.push(
      model.state.locationWeatherInfo.locality
        ? model.state.locationWeatherInfo.locality
        : model.state.locationWeatherInfo.region
    );

    // -clearing input field
    clearView.clearInput();

    // 2. Rendering recent location on card
    renderView.render(
      model.state.locationWeatherInfo,
      currentLocationResultDetail,
      searchResultDetail
    );

    model.persistRecentCities();
  } catch (error) {
    throw error;
  }
};

// Refreshing recent locations
const refresh = function () {
  if (model.state.recentCities.length === 1)
    recentLocationWeather(
      model.state.recentCities[0],
      model.state.recentCities[0],
      searchView.currentLocationBar,
      searchView,
      recentLocationView
    );

  if (model.state.recentCities.length === 2) {
    recentLocationWeather(
      model.state.recentCities[0],
      model.state.recentCities[0],
      searchView.currentLocationBar,
      searchView,
      recentLocationView
    );

    setTimeout(() => {
      recentLocationWeather(
        model.state.recentCities[1],
        model.state.recentCities[1],
        searchView.currentLocationBar,
        searchView,
        recentLocationView
      );
    }, 2 * 1000);
  }

  if (model.state.recentCities.length === 3) {
    recentLocationWeather(
      model.state.recentCities[1],
      model.state.recentCities[1],
      searchView.currentLocationBar,
      searchView,
      recentLocationView
    );

    setTimeout(() => {
      recentLocationWeather(
        model.state.recentCities[2],
        model.state.recentCities[2],
        searchView.currentLocationBar,
        searchView,
        recentLocationView
      );
    }, 2 * 1000);
  }
};

// Submitting search query
const searchResultHome = async function () {
  recentLocationsContainer.innerHTML = "";

  const locationResult = await locationApiCall(searchView.getSearchQuery());

  const fetchedCity = locationResult.locality
    ? locationResult.locality
    : locationResult.region;

  const check = model.state.recentCities.some((city) => city === fetchedCity);
  if (check)
    model.state.recentCities = model.state.recentCities.filter(
      (city) => city !== fetchedCity
    );

  refresh();

  setTimeout(() => {
    recentLocationWeather(
      fetchedCity,
      searchView.getSearchQuery(),
      searchView.currentLocationBar,
      searchView,
      recentLocationView
    );
  }, 4 * 1000);
};

const searchResultDetail = async function () {
  recentLocationsContainer.innerHTML = "";

  const locationResult = await locationApiCall(fullDetailView.getSearchQuery());

  const fetchedCity = locationResult.locality
    ? locationResult.locality
    : locationResult.region;

  const check = model.state.recentCities.some((city) => city === fetchedCity);
  if (check)
    model.state.recentCities = model.state.recentCities.filter(
      (city) => city !== fetchedCity
    );

  recentLocationWeather(
    fetchedCity,
    fullDetailView.getSearchQuery(),
    fullDetailView.detailCurrentLocationBar,
    fullDetailView,
    fullDetailView
  );
};

// Using current location
const currentLocationResultHome = async function () {
  recentLocationsContainer.innerHTML = "";

  navigator.geolocation.getCurrentPosition(
    async function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      const latlon = [latitude, longitude].join(",");

      const locationResult = await locationApiCall(latlon);

      const fetchedCity = locationResult.locality
        ? locationResult.locality
        : locationResult.region;

      const check = model.state.recentCities.some(
        (city) => city === fetchedCity
      );
      if (check)
        model.state.recentCities = model.state.recentCities.filter(
          (city) => city !== fetchedCity
        );

      refresh();

      setTimeout(() => {
        recentLocationWeather(
          fetchedCity,
          latlon,
          searchView.currentLocationBar,
          searchView,
          recentLocationView
        );
      }, 4 * 1000);
    },
    function () {
      alert("Could not get your current location!");
    }
  );
};

const currentLocationResultDetail = async function () {
  recentLocationsContainer.innerHTML = "";

  navigator.geolocation.getCurrentPosition(
    async function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      const latlon = [latitude, longitude].join(",");

      const locationResult = await locationApiCall(
        latlon,
        fullDetailView.detailCurrentLocationBar
      );

      const fetchedCity = locationResult.locality
        ? locationResult.locality
        : locationResult.region;

      const check = model.state.recentCities.some(
        (city) => city === fetchedCity
      );
      if (check)
        model.state.recentCities = model.state.recentCities.filter(
          (city) => city !== fetchedCity
        );

      recentLocationWeather(
        fetchedCity,
        latlon,
        fullDetailView.detailCurrentLocationBar,
        fullDetailView,
        fullDetailView
      );
    },
    function () {
      alert("Could not get your current location!");
    }
  );
};

// Top Locations
const topLocationWeather = async function (locality, query, renderView) {
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
    renderView.render(model.state.locationWeatherInfo);
  } catch (error) {
    throw error;
  }
};

const loadTopLocations = async function (city) {
  const locationResult = await locationApiCall(city);
  topLocationWeather(
    locationResult.locality ? locationResult.locality : locationResult.region,
    city,
    topLocationView
  );
};

setTimeout(() => {
  loadTopLocations(model.state.topCities[0]);
}, 6 * 1000);
setTimeout(() => {
  loadTopLocations(model.state.topCities[1]);
}, 8 * 1000);
setTimeout(() => {
  loadTopLocations(model.state.topCities[2]);
}, 10 * 1000);
// setTimeout(() => {
//   loadTopLocations(model.state.topCities[3]);
// }, 12 * 1000);
// setTimeout(() => {
//   loadTopLocations(model.state.topCities[4]);
// }, 14 * 1000);
// setTimeout(() => {
//   loadTopLocations(model.state.topCities[5]);
// }, 16 * 1000);

// Loading stored recent locations
const loadStorage = async function (city) {
  if (model.state.recentCities.length === 0) return;
  const locationResult = await locationApiCall(city);
  recentLocationWeather(
    locationResult.locality ? locationResult.locality : locationResult.region,
    city,
    searchView.currentLocationBar,
    searchView,
    recentLocationView
  );
};
loadStorage(model.state.recentCities[0]);

if (model.state.recentCities[1])
  setTimeout(() => {
    loadStorage(model.state.recentCities[1]);
  }, 2 * 1000);

if (model.state.recentCities[2])
  setTimeout(() => {
    loadStorage(model.state.recentCities[2]);
  }, 4 * 1000);

// Switching to full details
const loadFullDetailsRecentLocation = (locationEl) => {
  fullDetailView.renderFullDetails(
    locationEl,
    model.state.recentLocations,
    currentLocationResultDetail,
    searchResultDetail
  );
};

const loadFullDetailsTopLocation = (locationEl) => {
  fullDetailView.renderFullDetails(
    locationEl,
    model.state.topLocations,
    currentLocationResultDetail,
    searchResultDetail
  );
};

// Initializing Handlers
const initHandler = function () {
  searchView.addHandlerCurrentLocationResult(currentLocationResultHome);
  searchView.addHandlerSearchResult(searchResultHome);
  fullDetailView.addHandlerRenderFullDetailRecent(
    loadFullDetailsRecentLocation
  );
  fullDetailView.addHandlerRenderFullDetailTop(loadFullDetailsTopLocation);
  fullDetailView.addHandlerDailyWeather();
  fullDetailView.addHandlerPresentDayWeather();
};
initHandler();
