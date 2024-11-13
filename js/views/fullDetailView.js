class FullDetailView {
  _data;
  _windowEl = document.getElementById("body");
  _containerRecentLocations = document.querySelector(".recent-locations");
  _containerTopLocations = document.querySelector(".top-locations");
  _weatherDetails;
  _activeFirst;
  _detailSearchForm;
  _detailSearchInput;
  _detailOverlay;
  _detailLocationTabs;
  _detailSearchbarContent;
  detailCurrentLocationBar;

  _showLocationTabs() {
    this._detailLocationTabs.classList.remove("detail-hidden");
    this._detailSearchbarContent.style.borderRadius = "0.5rem 0.5rem 0 0";
    this._detailOverlay.classList.remove("detail-hidden");
  }

  _hideLocationTabs() {
    this._detailLocationTabs.classList.add("detail-hidden");
    this._detailSearchbarContent.style.borderRadius = "0.5rem";
    this._detailOverlay.classList.add("detail-hidden");
  }

  getSearchQuery() {
    const query = this._detailSearchInput.value;
    return query;
  }

  clearInput() {
    this._detailSearchInput.value = "";
  }

  _addHandlerShow() {
    this._detailSearchInput.addEventListener(
      "click",
      this._showLocationTabs.bind(this)
    );
  }

  _addHandlerHide() {
    this._detailOverlay.addEventListener(
      "click",
      this._hideLocationTabs.bind(this)
    );
    this._detailSearchForm.addEventListener(
      "submit",
      this._hideLocationTabs.bind(this)
    );
  }

  addHandlerRenderFullDetailRecent(handler) {
    this._containerRecentLocations.addEventListener("click", function (e) {
      const locationEl = e.target.closest(".location-info-card");
      if (!locationEl) return;
      handler(locationEl);
    });
  }

  addHandlerRenderFullDetailTop(handler) {
    this._containerTopLocations.addEventListener("click", function (e) {
      const locationEl = e.target.closest(".location-info-card");
      if (!locationEl) return;
      handler(locationEl);
    });
  }

  addHandlerDailyWeather() {
    this._windowEl.addEventListener(
      "click",
      function (e) {
        const btn = e.target.closest(".nav-bar__list--link-other");
        if (!btn) return;

        this._activeFirst.classList.remove("active");
        const navItem = this._windowEl.querySelectorAll(".nav-bar__list--item");
        navItem.forEach((nav) => {
          nav.classList.remove("active");
        });
        btn.querySelector(".nav-bar__list--item").classList.add("active");

        const gotoDay = btn.dataset.day;
        this.renderEachDayFullDetails(gotoDay);
      }.bind(this)
    );
  }

  addHandlerPresentDayWeather() {
    this._windowEl.addEventListener(
      "click",
      function (e) {
        const btn = e.target.closest(".nav-bar__list--link-first");
        if (!btn) return;

        const navItem = this._windowEl.querySelectorAll(".nav-bar__list--item");
        navItem.forEach((nav) => {
          nav.classList.remove("active");
        });
        btn.querySelector(".nav-bar__list--item").classList.add("active");

        const markup = `
        <h2 class="weather-date">${this._data.weatherDetails.day1.currentHour.day},   ${this._data.weatherDetails.day1.currentHour.date}</h2>
      <div class="weather-card">
      <div class="weather-card__header">
        <div class="weather-card__header--title">
        <h2>Current Hour Weather</h2>
        <p>${this._data.weatherDetails.day1.currentHour.time}</p>
        </div>
        <div class="weather-card__header--content">
        <i class="fa fa-cloud-sun"></i>
        <p>${this._data.weatherDetails.day1.currentHour.values.temperature}°<span> C</span></p>
        </div>
      </div>

      <ul class="weather-card__content">
        <li class="weather-card__content--item"><p>Cloud Cover</p><p>${this._data.weatherDetails.day1.currentHour.values.cloudCover}<span>%</span></p></li>
        <li class="weather-card__content--item"><p>Dew Point</p><p>${this._data.weatherDetails.day1.currentHour.values.dewPoint}°<span> C</span></p></li>
        <li class="weather-card__content--item"><p>Visibility</p><p>${this._data.weatherDetails.day1.currentHour.values.visibility}<span> km</span></p></li>
        <li class="weather-card__content--item"><p>Humidity</p><p>${this._data.weatherDetails.day1.currentHour.values.humidity}<span>%</span></p></li>
        <li class="weather-card__content--item"><p>UV Index</p><p>${this._data.weatherDetails.day1.currentHour.values.uvIndex}</p></li>
        <li class="weather-card__content--item"><p>Precipitation Probability</p><p>${this._data.weatherDetails.day1.currentHour.values.precipitationProbability}<span>%</span></p></li>
      </ul>
      </div>

      <div class="weather-card">
      <div class="weather-card__header">
        <div class="weather-card__header--title">
        <h2>Day's Average</h2>
        </div>
        <div class="weather-card__header--content">
        <i class="fa fa-cloud-sun"></i>
        <p>${this._data.weatherDetails.day1.dayAvg.values.temperatureAvg} °<span>c</span></p>
        </div>
      </div>

      <ul class="weather-card__content">
        <li class="weather-card__content--item"><p>Cloud Cover</p><p>${this._data.weatherDetails.day1.dayAvg.values.cloudCoverAvg}<span>%</span></p></li>
        <li class="weather-card__content--item"><p>Dew Point</p><p>${this._data.weatherDetails.day1.dayAvg.values.dewPointAvg}°<span> C</span></p></li>
        <li class="weather-card__content--item"><p>Visibility</p><p>${this._data.weatherDetails.day1.dayAvg.values.visibilityAvg}<span> km</span></p></li>
        <li class="weather-card__content--item"><p>Humidity</p><p>${this._data.weatherDetails.day1.dayAvg.values.humidityAvg}<span>%</span></p></li>
        <li class="weather-card__content--item"><p>UV Index</p><p>${this._data.weatherDetails.day1.dayAvg.values.uvIndexAvg}</p></li>
        <li class="weather-card__content--item"><p>Precipitation Probability</p><p>${this._data.weatherDetails.day1.dayAvg.values.precipitationProbabilityAvg}<span>%</span></p></li>
      </ul>
      </div>`;

        this._weatherDetails.innerHTML = markup;
      }.bind(this)
    );
  }

  _addHandlerCurrentLocationBar(handler) {
    this.detailCurrentLocationBar.addEventListener("click", handler);
  }

  _addHandlerSearchView(handler) {
    this._detailSearchForm.addEventListener("submit", handler);
  }

  renderEachDayFullDetails(gotoDay) {
    const markup = `
      <div class='weather-details'>
      <h2 class="weather-date">${this._data.weatherDetails[gotoDay].day},   ${this._data.weatherDetails[gotoDay].date}</h2>

      <div class="weather-card">
      <div class="weather-card__header">
        <div class="weather-card__header--title">
        <h2>Day's Average</h2>
        </div>
        <div class="weather-card__header--content">
        <i class="fa fa-cloud-sun"></i>
        <p>${this._data.weatherDetails[gotoDay].dayAvg.values.temperatureAvg} ̊<span>c</span></p>
        </div>
      </div>

      <ul class="weather-card__content">
        <li class="weather-card__content--item"><p>Cloud Cover</p><p>${this._data.weatherDetails[gotoDay].dayAvg.values.cloudCoverAvg}<span> %</span></p></li>
        <li class="weather-card__content--item"><p>Dew Point</p><p>${this._data.weatherDetails[gotoDay].dayAvg.values.dewPointAvg}°<span> C</span></p></li>
        <li class="weather-card__content--item"><p>Visibility</p><p>${this._data.weatherDetails[gotoDay].dayAvg.values.visibilityAvg}<span> km</span></p></li>
        <li class="weather-card__content--item"><p>Humidity</p><p>${this._data.weatherDetails[gotoDay].dayAvg.values.humidityAvg}<span>%</span></p></li>
        <li class="weather-card__content--item"><p>UV Index</p><p>${this._data.weatherDetails[gotoDay].dayAvg.values.uvIndexAvg}</p></li>
        <li class="weather-card__content--item"><p>Precipitation Probability</p><p>${this._data.weatherDetails[gotoDay].dayAvg.values.precipitationProbabilityAvg}<span>%</span></p></li>
      </ul>
      </div>
      </div>`;

    this._weatherDetails.innerHTML = markup;
  }

  _generateMarkupPresentDayDetail(data) {
    return `<div class = "detail-body">
    <header class="detail-header">
      <div class="detail-logo">
      <i class="fa fa-cloud" aria-hidden="true"></i>
      <h1>WeatherClues</h1>
      </div>

      <div class="detail-location">
      <h4>${data.locality ? data.locality : data.region}, ${data.region} ${
      data.weatherDetails.day1.currentHour.values.temperature
    }°<span> C</span></h4>
      <i class="fa fa-cloud-sun"></i>
      </div>

      <div class="detail-search-bar">
      <div class="detail-search-bar__content">
        <i class="fa fa-search"></i>
        <form class="detail-search">
        <input class="detail-search__field" type="search" placeholder="Search Location" />
        </form>
      </div>

      <div class="detail-location-tabs detail-hidden">
        <a href="#" class="detail-location-tab detail-location__current">
        <div class="detail-place">
          <span><i class="fa fa-location-arrow"></i>
          <p>Use Current Location</p>
          </span>
        </div>
        </a>
      </div>
      </div>
    </header>

    <div class="detail-overlay detail-hidden"></div>

    <main class="detail-main">
      <nav class="nav-bar">
      <ul class="nav-bar__list">
        <a class="nav-bar__list--link-first" data-day='day1' href="#">
        <li class="nav-bar__list--item active-first active">TODAY</li>
        </a>
        <a class="nav-bar__list--link-other" data-day='day2' href="#">
        <li class="nav-bar__list--item">TOMORROW</li>
        </a>
        <a class="nav-bar__list--link-other" data-day='day3' href="#">
        <li class="nav-bar__list--item">${data.weatherDetails.day3.day}</li>
        </a>
        <a class="nav-bar__list--link-other" data-day='day4' href="#">
        <li class="nav-bar__list--item">${data.weatherDetails.day4.day}</li>
        </a>
        </ul>
      </nav>

      <div class='weather-details'>
      <h2 class="weather-date">${data.weatherDetails.day1.currentHour.day},   ${
      data.weatherDetails.day1.currentHour.date
    }</h2>
      <div class="weather-card">
      <div class="weather-card__header">
        <div class="weather-card__header--title">
        <h2>Current Hour Weather</h2>
        <p>${data.weatherDetails.day1.currentHour.time}</p>
        </div>
        <div class="weather-card__header--content">
        <i class="fa fa-cloud-sun"></i>
        <p>${
          data.weatherDetails.day1.currentHour.values.temperature
        }°<span> C</span></p>
        </div>
      </div>

      <ul class="weather-card__content">
        <li class="weather-card__content--item"><p>Cloud Cover</p><p>${
          data.weatherDetails.day1.currentHour.values.cloudCover
        }<span>%</span></p></li>
        <li class="weather-card__content--item"><p>Dew Point</p><p>${
          data.weatherDetails.day1.currentHour.values.dewPoint
        }°<span> C</span></p></li>
        <li class="weather-card__content--item"><p>Visibility</p><p>${
          data.weatherDetails.day1.currentHour.values.visibility
        }<span> km</span></p></li>
        <li class="weather-card__content--item"><p>Humidity</p><p>${
          data.weatherDetails.day1.currentHour.values.humidity
        }<span>%</span></p></li>
        <li class="weather-card__content--item"><p>UV Index</p><p>${
          data.weatherDetails.day1.currentHour.values.uvIndex
        }</p></li>
        <li class="weather-card__content--item"><p>Precipitation Probability</p><p>${
          data.weatherDetails.day1.currentHour.values.precipitationProbability
        }<span>%</span></p></li>
      </ul>
      </div>

      <div class="weather-card">
      <div class="weather-card__header">
        <div class="weather-card__header--title">
        <h2>Day's Average</h2>
        </div>
        <div class="weather-card__header--content">
        <i class="fa fa-cloud-sun"></i>
        <p>${
          data.weatherDetails.day1.dayAvg.values.temperatureAvg
        } °<span>c</span></p>
        </div>
      </div>

      <ul class="weather-card__content">
        <li class="weather-card__content--item"><p>Cloud Cover</p><p>${
          data.weatherDetails.day1.dayAvg.values.cloudCoverAvg
        }<span>%</span></p></li>
        <li class="weather-card__content--item"><p>Dew Point</p><p>${
          data.weatherDetails.day1.dayAvg.values.dewPointAvg
        }°<span> C</span></p></li>
        <li class="weather-card__content--item"><p>Visibility</p><p>${
          data.weatherDetails.day1.dayAvg.values.visibilityAvg
        }<span> km</span></p></li>
        <li class="weather-card__content--item"><p>Humidity</p><p>${
          data.weatherDetails.day1.dayAvg.values.humidityAvg
        }<span>%</span></p></li>
        <li class="weather-card__content--item"><p>UV Index</p><p>${
          data.weatherDetails.day1.dayAvg.values.uvIndexAvg
        }</p></li>
        <li class="weather-card__content--item"><p>Precipitation Probability</p><p>${
          data.weatherDetails.day1.dayAvg.values.precipitationProbabilityAvg
        }<span>%</span></p></li>
      </ul>
      </div>
      </div>
    </main>
  </div>`;
  }

  _fullDetailConfig(data, windowEl, handlerCurrent, handlerSearch) {
    this._windowEl.innerHTML = "";
    this._windowEl.insertAdjacentHTML(
      "afterbegin",
      this._generateMarkupPresentDayDetail(data)
    );

    this._weatherDetails = windowEl.querySelector(".weather-details");
    this._activeFirst = windowEl.querySelector(".active-first");
    this._detailSearchForm = windowEl.querySelector(".detail-search");
    this._detailSearchInput = windowEl.querySelector(".detail-search__field");
    this._detailOverlay = windowEl.querySelector(".detail-overlay");
    this._detailLocationTabs = windowEl.querySelector(".detail-location-tabs");
    this._detailSearchbarContent = windowEl.querySelector(
      ".detail-search-bar__content"
    );
    this.detailCurrentLocationBar = windowEl.querySelector(
      ".detail-location__current"
    );

    this._addHandlerShow();
    this._addHandlerHide();
    this._addHandlerCurrentLocationBar(handlerCurrent);
    this._addHandlerSearchView(handlerSearch);
  }

  renderFullDetails(locationEl, locations, handlerCurrent, handlerSearch) {
    if (!locationEl) return;

    if (locationEl) {
      const locationItem = locations.find(
        (location) => location.id === locationEl.dataset.id
      );
      this._data = locationItem;

      this._fullDetailConfig(
        locationItem,
        this._windowEl,
        handlerCurrent,
        handlerSearch
      );
    }
  }

  render(data, handlerCurrent, handlerSearch) {
    this._fullDetailConfig(data, this._windowEl, handlerCurrent, handlerSearch);
  }
}

export default new FullDetailView();
