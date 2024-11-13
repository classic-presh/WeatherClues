import { View } from "./View";

class RecentLocationView extends View {
  #parentEl = document.querySelector(".recent-locations");
  #data;

  constructor() {
    super();
  }

  render(data) {
    this.#data = data;
    const markup = this._generateMarkup(this.#data);
    this.#parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new RecentLocationView();
