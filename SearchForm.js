class SearchForm {
  constructor(form) {
    this.form = form;
    this.create();
    this.getElements();
    this.addEventListeners();
    this.render = () => {};
    this.onSearch = (cb) => (this.render = cb);
    this.checkURL();
  }

  create() {
    this.form.innerHTML = `
    <div class="input-group">
        <input
            type="text"
            class="form-control"
            placeholder="Search for a Stock"
        />
        <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button">Search</button>
        </div>
    </div>`;
  }

  getElements() {
    this.searchInput = document.querySelector("input");
    this.searchBtn = document.querySelector("button");
    this.resultListDiv = document.getElementById("results");
    this.spinner = document.querySelector(".spinner-border");
  }

  async setQueryInURL(searchQuery) {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set("query", searchQuery);
    let newRelativePathQuery =
      window.location.pathname + "?" + searchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
  }

  async getTickers(searchQuery) {
    this.setQueryInURL(searchQuery);
    const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchQuery}&limit=10&exchange=NASDAQ`;
    try {
      const response = await fetch(url);
      const tickerSearchData = await response.json();
      const tickers = tickerSearchData.map((result) => result.symbol);
      return tickers;
    } catch (err) {
      console.error(err);
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  async search() {
    let inputQuery = this.searchInput.value;
    if (!inputQuery) return;
    this.spinner.classList.remove("d-none");
    try {
      const tickers = await this.getTickers(inputQuery);
      if (!tickers) return;
      this.spinner.classList.add("d-none");
      this.debounce(this.render(tickers), 80);
    } catch (e) {
      console.error(e);
    }
  }

  checkURL() {
    if (window.location.search) {
      this.searchInput.value = new URLSearchParams(window.location.search).get(
        "query"
      );
      this.search();
    }
  }

  addEventListeners() {
    this.searchBtn.addEventListener("click", () => this.search());
    this.searchInput.addEventListener("input", () => this.search());
  }
}
