class TopLocationView {
  _parentEl = document.querySelector(".top-locations");
  #data;

  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    this._parentEl.insertAdjacentHTML("beforeend", markup);
  }

  #generateMarkup() {
    return `
          <a class="location-info-card fade-in" href="#">
            <div class="location-info-card__side location-info-card__side--front">
              <h3 class="city">${
                this.#data.locality ? this.#data.locality : this.#data.region
              }</h3>
              <p class="country">${this.#data.country}</p>
              <div class="temperature">
                <i class="fa fa-cloud-sun"></i>
                <p>${
                  this.#data.weatherDetails.currentHour.values.temperature
                } ̊<span>C</span></p>
              </div>
            </div>

            <div class="location-info-card__side location-info-card__side--back">
              <div class='place'>
              <h4 class="city">${
                this.#data.locality ? this.#data.locality : this.#data.region
              }</h4>
              </div>
              <div class="brief-detail">
                <p>Precipitation Probability: ${
                  this.#data.weatherDetails.currentHour.values
                    .precipitationProbability
                }%</p>
                <p>Dew Point: ${
                  this.#data.weatherDetails.currentHour.values.dewPoint
                } °c</p>
                <p>Cloud Cover: ${
                  this.#data.weatherDetails.currentHour.values.cloudCover
                }%</p>
              </div>
            </div>
          </a>
        `;
  }
}

export default new TopLocationView();
