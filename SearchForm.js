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

  // async setQueryInURL(searchQuery) {
  //   let searchParams = new URLSearchParams(window.location.search);
  //   searchParams.set("query", searchQuery);
  //   let newRelativePathQuery =
  //     window.location.pathname + "?" + searchParams.toString();
  //   history.pushState(null, "", newRelativePathQuery);
  // }

  async setQueryInURL(searchQuery) {
    let searchParams = new URLSearchParams(window.location.search);
    let q;
    if (searchQuery) {
      searchParams.set("query", searchQuery);
      q = "?";
    } else {
      searchParams.delete("query");
      q = "";
    }
    let newRelativePathQuery =
      window.location.pathname + q + searchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
  }

  async getTickers(searchQuery) {
    this.setQueryInURL(searchQuery);
    if (!searchQuery) return [];
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

  async search() {
    let inputQuery = this.searchInput.value;
    this.spinner.classList.remove("d-none");
    try {
      const tickers = await this.getTickers(inputQuery);
      this.spinner.classList.add("d-none");
      this.render(tickers);
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

  // debounce(cb, delay) {
  //   let timeout;
  //   return (...args) => {
  //     clearTimeout(timeout);
  //     timeout = setTimeout(() => cb(...args), delay);
  //   };
  // }

  addEventListeners() {
    this.searchBtn.addEventListener("click", () => this.search());
    this.searchInput.addEventListener("input", () => this.search());
    // this.searchInput.addEventListener("input",this.debounce(this.search, 200));
  }
}
