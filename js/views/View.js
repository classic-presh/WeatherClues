export class View {
  loaderBox = document.querySelector(".loader-box");

  _data;

  _clear() {
    this._parentEl.innerHTML = "";
  }

  loadSuccess() {
    this.loaderBox.innerHTML = "Locations loaded successfully!";
  }

  hideLoader() {
    this.loaderBox.classList.add("hidden");
  }

  _generateMarkup(data) {
    return `
          <a class="location-info-card fade-in" data-id='${data.id}' href="#">
            <div class="location-info-card__side location-info-card__side--front">
              <h3 class="city">${
                data.locality ? data.locality : data.region
              }</h3>
              <p class="country">${data.country}</p>
              <div class="temperature">
                <i class="fa fa-cloud-sun"></i>
                <p>${
                  data.weatherDetails.day1.currentHour.values.temperature
                } ̊<span>C</span></p>
              </div>
            </div>

            <div class="location-info-card__side location-info-card__side--back">
              <div class='place'>
              <h4 class="city">${
                data.locality ? data.locality : data.region
              }</h4>
              </div>
              <div class="brief-detail">
                <p>Precipitation Probability: ${
                  data.weatherDetails.day1.currentHour.values
                    .precipitationProbability
                }%</p>
                <p>Dew Point: ${
                  data.weatherDetails.day1.currentHour.values.dewPoint
                } °c</p>
                <p>Cloud Cover: ${
                  data.weatherDetails.day1.currentHour.values.cloudCover
                }%</p>
              </div>
            </div>
          </a>
        `;
  }

  addHandlerStorage(handler) {
    window.addEventListener("load", handler);
  }
}
