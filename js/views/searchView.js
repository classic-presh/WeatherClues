class SearchView {
  #parentElement = document.querySelector(".search");

  clearInput() {
    this.#parentElement.querySelector(".search__field").value = "";
  }

  getSearchQuery() {
    const query = this.#parentElement.querySelector(".search__field").value;
    return query;
  }
}

export default new SearchView();
