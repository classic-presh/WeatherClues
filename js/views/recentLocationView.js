import { View } from "./View";

class RecentLocationView extends View {
  _parentEl = document.querySelector(".recent-locations");
  // #locationCard = document.querySelector("");

  constructor() {
    super();
  }

  _generateMarkup(data) {
    return `
          <a class="location-info-card fade-in" href="#">
            <div class="location-info-card__side location-info-card__side--front">
              <h3 class="city">${
                data.locality ? data.locality : data.region
              }</h3>
              <p class="country">${data.country}</p>
              <div class="temperature">
                <i class="fa fa-cloud-sun"></i>
                <p>${
                  data.weatherDetails.currentHour.values.temperature
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
                  data.weatherDetails.currentHour.values
                    .precipitationProbability
                }%</p>
                <p>Dew Point: ${
                  data.weatherDetails.currentHour.values.dewPoint
                } °c</p>
                <p>Cloud Cover: ${
                  data.weatherDetails.currentHour.values.cloudCover
                }%</p>
              </div>
            </div>
          </a>
        `;
  }
}

export default new RecentLocationView();
