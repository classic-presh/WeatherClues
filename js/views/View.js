export class View {
  _data;

  renderAll(data) {
    this._data = data;
    this._clear();
    this._data.forEach((location) => {
      const markup = this._generateMarkup(location);
      this._parentEl.insertAdjacentHTML("afterbegin", markup);
    });
  }

  _clear() {
    this._parentEl.innerHTML = "";
  }

  addHandlerStorage(handler) {
    window.addEventListener("load", handler);
  }

  // addHandlerDetail(handler) {
  //   // #parentEl.addEventListener('click', handler)
  // }

  // showDetail(e) {
  //   _parentEl.innerHTML = "";
  // }
}
