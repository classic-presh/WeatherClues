class SearchView {
  #parentElement = document.querySelector(".search");
  _searchForm = document.querySelector(".search");
  _searchInput = document.querySelector(".search__field");
  _searchbarContent = document.querySelector(".search-bar__content");
  currentLocationBar = document.querySelector(".current-location");
  _currentLocationLink = document.querySelector(".current-location__link");
  _overlay = document.querySelector(".overlay");

  constructor() {
    this._addHandlerShow();
    this._addHandlerHide();
  }

  _showCurrentLocationBar() {
    this.currentLocationBar.classList.remove("hidden");
    this._currentLocationLink.classList.remove("hidden");
    this._searchbarContent.style.borderRadius = "0.5rem 0.5rem 0 0";
    this._overlay.classList.remove("hidden");
  }

  _hideCurrentLocationBar() {
    this.currentLocationBar.classList.add("hidden");
    this._currentLocationLink.classList.add("hidden");
    this._searchbarContent.style.borderRadius = "0.5rem";
    this._overlay.classList.add("hidden");
  }

  _addHandlerShow() {
    this._searchInput.addEventListener(
      "click",
      this._showCurrentLocationBar.bind(this)
    );
  }

  _addHandlerHide() {
    this._overlay.addEventListener(
      "click",
      this._hideCurrentLocationBar.bind(this)
    );
    this._searchForm.addEventListener(
      "submit",
      this._hideCurrentLocationBar.bind(this)
    );
  }

  addHandlerSearchResult(handler) {
    this._searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }

  addHandlerCurrentLocationResult(handler) {
    this.currentLocationBar.addEventListener("click", handler);
  }

  clearInput() {
    this.#parentElement.querySelector(".search__field").value = "";
  }

  getSearchQuery() {
    const query = this.#parentElement.querySelector(".search__field").value;
    return query;
  }
}

export default new SearchView();
