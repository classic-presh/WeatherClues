const currentLocationBar = document.querySelector(".current-location");

export const state = {
  locationWeatherInfo: {},
  recentLocations: [],
  topLocations: [],
};

export const getLocation = async function (query) {
  const url = currentLocationBar.addEventListener("click", function () {})
    ? `https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=${query}&language=en`
    : `https://trueway-geocoding.p.rapidapi.com/Geocode?address=${query}&language=en`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "03e4e42c3fmsh46008762cdcc09dp18dd76jsn2a5f64b69cce",
      "X-RapidAPI-Host": "trueway-geocoding.p.rapidapi.com",
    },
  };
  try {
    const response = await fetch(url, options);
    const { results } = await response.json();
    if (!results.length || results[0].type === "country")
      throw new Error("No result found. Try searching for a city or town");
    console.log(results[0].locality, results[0].region, results[0].country);

    return {
      locality: results[0].locality,
      region: results[0].region,
      country: results[0].country,
    };
  } catch (err) {
    alert(err);
  }
};

export const getWeatherInfo = async function (locality, query) {
  const url = `https://tomorrow-io1.p.rapidapi.com/v4/weather/forecast?location=${locality}&timesteps=1h&units=metric`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "03e4e42c3fmsh46008762cdcc09dp18dd76jsn2a5f64b69cce",
      "X-RapidAPI-Host": "tomorrow-io1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    console.log(result);

    const lat = result.location.lat.toString().slice(-5);
    const lon = result.location.lon.toString().slice(-5);
    const latLon = [lat, lon];

    class WeatherDetailsTemplate {
      // constructor(timeStep, i) {
      //   this.date = this.#weatherDate(timeStep, i);
      //   this.values = this.#weatherValues(timeStep, i);
      // }

      date(timeStep, i) {
        return result.timelines[timeStep][i].time.slice(0, 10);
      }

      values(timeStep, i) {
        return {
          cloudCover: Math.round(
            result.timelines[timeStep][i].values.cloudCover
          ),
          dewPoint: Math.round(result.timelines[timeStep][i].values.dewPoint),
          visibility: Math.round(
            result.timelines[timeStep][i].values.visibility
          ),
          humidity: Math.round(result.timelines[timeStep][i].values.humidity),
          uvIndex: Math.round(result.timelines[timeStep][i].values.uvIndex),
          temperature: Math.round(
            result.timelines[timeStep][i].values.temperature
          ),
          precipitationProbability: Math.round(
            result.timelines[timeStep][i].values.precipitationProbability
          ),
        };
      }
    }

    const hourlyWeather = new WeatherDetailsTemplate();

    state.locationWeatherInfo = {
      id: latLon.join(""),
      ...{ ...(await getLocation(query)) },
      weatherDetails: {
        currentHour: {
          date: hourlyWeather.date("hourly", 1),
          values: hourlyWeather.values("hourly", 1),
        },
      },
    };

    console.log(state.locationWeatherInfo);
  } catch (err) {
    console.error(err);
  }
};

export const persistRecentLocations = function () {
  localStorage.setItem(
    "recentLocations",
    JSON.stringify(state.recentLocations)
  );
};

const initStorage = function () {
  const recentLocationsStorage = localStorage.getItem("recentLocations");
  if (recentLocationsStorage)
    state.recentLocations = JSON.parse(recentLocationsStorage);
};
initStorage();

const clearStorage = function () {
  localStorage.clear("recentLocations");
};
// clearStorage();
