import { View } from "./View";

class TopLocationView extends View {
  #parentEl = document.querySelector(".top-locations");
  #data;

  constructor() {
    super();
  }

  render(data) {
    this.#data = data;
    const markup = this._generateMarkup(this.#data);
    this.#parentEl.insertAdjacentHTML("beforeend", markup);
  }
}

export default new TopLocationView();
