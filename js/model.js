const homeCurrentLocationBar = document.querySelector(".current-location");

export const state = {
  locationWeatherInfo: {},
  recentLocations: [],
  topLocations: [],
  recentCities: [],
  topCities: [
    "abuja",
    // "london",
    // "washington dc",
    "beijing",
    // "brasilia",
    "canberra",
  ],
};

export const getLocation = async function (
  query,
  currentLocationBar = homeCurrentLocationBar
) {
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

    return {
      locality: results[0].locality,
      region: results[0].region,
      country: results[0].country,
    };
  } catch (err) {
    alert(err);
  }
};

export const getWeatherInfo = async function (
  locality,
  query,
  currentLocationBar
) {
  const url = function (locality, timesteps) {
    return `https://tomorrow-io1.p.rapidapi.com/v4/weather/forecast?location=${locality}&timesteps=${timesteps}&units=metric`;
  };
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "03e4e42c3fmsh46008762cdcc09dp18dd76jsn2a5f64b69cce",
      "X-RapidAPI-Host": "tomorrow-io1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url(locality, "1h"), options);
    const response2 = await fetch(url(locality, "1d"), options);
    const result = await response.json();
    const result2 = await response2.json();

    const lat = result.location.lat.toString().slice(-5);
    const lon = result.location.lon.toString().slice(-5);
    const latLon = [lat, lon];

    class WeatherDetailsTemplate {
      date(timeStep, i, hourly = true) {
        let dateFull;
        if (hourly) {
          dateFull = new Date(result.timelines[timeStep][i].time);
        }
        if (!hourly) {
          dateFull = new Date(result2.timelines[timeStep][i].time);
        }
        const date = `${dateFull.getDate()}`.padStart(2, 0);
        const month = `${dateFull.getMonth()}`.padStart(2, 0);
        const year = dateFull.getFullYear();
        return `${date}/${month}/${year}`;
      }

      day(timeStep, i, hourly = true) {
        let dateFull;
        if (hourly) {
          dateFull = new Date(result.timelines[timeStep][i].time);
        }
        if (!hourly) {
          dateFull = new Date(result2.timelines[timeStep][i].time);
        }
        function getDayName(locale) {
          const date = dateFull;
          return date.toLocaleDateString(locale, { weekday: "long" });
        }

        const day = getDayName();
        return day.toString().toUpperCase();
      }

      time(timeStep, i) {
        const dateFull = new Date(result.timelines[timeStep][i].time);
        const hours = `${dateFull.getHours()}`.padStart(2, 0);
        const minutes = `${dateFull.getMinutes()}`.padStart(2, 0);
        return `${hours}:${minutes}`;
      }

      values(timeStep, i) {
        return {
          temperature: Math.round(
            result.timelines[timeStep][i].values.temperature
          ),
          cloudCover: Math.round(
            result.timelines[timeStep][i].values.cloudCover
          ),
          dewPoint: Math.round(result.timelines[timeStep][i].values.dewPoint),
          visibility: Math.round(
            result.timelines[timeStep][i].values.visibility
          ),
          humidity: Math.round(result.timelines[timeStep][i].values.humidity),
          uvIndex: Math.round(result.timelines[timeStep][i].values.uvIndex),
          precipitationProbability: Math.round(
            result.timelines[timeStep][i].values.precipitationProbability
          ),
        };
      }
    }

    const dailyWeatherValues = function (timeStep, i) {
      return {
        temperatureAvg: Math.round(
          result2.timelines[timeStep][i].values.temperatureAvg
        ),
        cloudCoverAvg: Math.round(
          result2.timelines[timeStep][i].values.cloudCoverAvg
        ),
        dewPointAvg: Math.round(
          result2.timelines[timeStep][i].values.dewPointAvg
        ),
        visibilityAvg: Math.round(
          result2.timelines[timeStep][i].values.visibilityAvg
        ),
        humidityAvg: Math.round(
          result2.timelines[timeStep][i].values.humidityAvg
        ),
        uvIndexAvg: Math.round(
          result2.timelines[timeStep][i].values.uvIndexAvg
        ),
        precipitationProbabilityAvg: Math.round(
          result2.timelines[timeStep][i].values.precipitationProbabilityAvg
        ),
      };
    };

    const hourlyWeather = new WeatherDetailsTemplate();
    const dailyWeather = new WeatherDetailsTemplate();

    const expDay1 = hourlyWeather.day("hourly", 0);
    const expDay2 = dailyWeather.day("daily", 1, false);

    const day1Avg = function (index) {
      if (expDay1 !== expDay2)
        return { values: dailyWeatherValues("daily", index) };
      if (expDay1 === expDay2)
        return { values: dailyWeatherValues("daily", index + 1) };
    };

    const otherDaysAvg = function (index) {
      if (expDay1 !== expDay2)
        return {
          day: dailyWeather.day("daily", index, false),
          date: dailyWeather.date("daily", index, false),
          dayAvg: { values: dailyWeatherValues("daily", index) },
        };
      if (expDay1 === expDay2)
        return {
          day: dailyWeather.day("daily", index + 1, false),
          date: dailyWeather.date("daily", index + 1, false),
          dayAvg: { values: dailyWeatherValues("daily", index + 1) },
        };
    };

    state.locationWeatherInfo = {
      id: latLon.join(""),
      ...{ ...(await getLocation(query, currentLocationBar)) },
      weatherDetails: {
        day1: {
          currentHour: {
            day: hourlyWeather.day("hourly", 0),
            date: hourlyWeather.date("hourly", 0),
            time: hourlyWeather.time("hourly", 0),
            values: hourlyWeather.values("hourly", 0),
          },
          dayAvg: day1Avg(0),
        },
        day2: otherDaysAvg(1),
        day3: otherDaysAvg(2),
        day4: otherDaysAvg(3),
      },
    };
  } catch (err) {
    alert(err);
  }
};

export const persistRecentCities = function () {
  localStorage.setItem("recentCities", JSON.stringify(state.recentCities));
};

const initStorage = function () {
  const recentCitiesStorage = localStorage.getItem("recentCities");
  if (recentCitiesStorage) state.recentCities = JSON.parse(recentCitiesStorage);
};
initStorage();

const clearStorage = function () {
  localStorage.clear("recentCities");
};
// clearStorage();
