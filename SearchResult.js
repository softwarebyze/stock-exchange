class SearchResult {
  constructor(results) {
    this.results = results;
    this.searchInput = document.querySelector("input");
    this.create();
  }

  create() {
    this.spinner = document.createElement("div");
    this.spinner.classList.add("spinner-border", "d-none");
    this.results.appendChild(this.spinner);
    this.resultsList = document.createElement("div");
    this.resultsList.classList.add("list-group", "list-group-flush");
    this.results.appendChild(this.resultsList);
  }

  async getCompaniesData(tickersArr) {
    if (tickersArr.length === 0) return [];
    if (tickersArr.length === 1) tickersArr.push(",");
    const companiesQuery = tickersArr.join();
    const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${companiesQuery}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const companiesData = await data.companyProfiles;
      return companiesData;
    } catch (e) {
      console.error(e);
    }
  }

  createResultDiv() {
    const resultDiv = document.createElement("div");
    resultDiv.classList.add("d-flex", "flex-row");
    resultDiv.id = "result";
    return resultDiv;
  }

  createResultA(ticker) {
    const resultA = document.createElement("a");
    resultA.href = `./company.html?symbol=${ticker}`;
    resultA.classList.add("list-group-item", "list-group-item-action");
    return resultA;
  }

  createResultImg(imgUrl) {
    const resultImg = document.createElement("img");
    resultImg.src = imgUrl;
    resultImg.width = "50";
    resultImg.height = "50";
    return resultImg;
  }

  createResultNameSpan(searchQuery, companyName) {
    const resultNameSpan = document.createElement("span");
    resultNameSpan.innerHTML = `${this.markMatch(searchQuery, companyName)}`;
    return resultNameSpan;
  }

  createResultTickerSpan(searchQuery, ticker) {
    const resultTickerSpan = document.createElement("span");
    resultTickerSpan.innerHTML = `(${this.markMatch(searchQuery, ticker)})`;
    return resultTickerSpan;
  }

  createResultPctChangeSpan(pctChange) {
    const plus = pctChange > 0 ? "+" : "";
    const pctColor =
      pctChange > 0 ? "green" : pctChange == 0 ? "chocolate" : "red";
    const resultPctChangeSpan = document.createElement("span");
    resultPctChangeSpan.innerHTML = `(${plus}${parseFloat(pctChange).toFixed(
      2
    )}%)`;
    resultPctChangeSpan.style.color = pctColor;
    return resultPctChangeSpan;
  }

  async renderResults(tickers) {
    this.spinner.classList.remove("d-none");
    const searchQuery = this.searchInput.value;
    let containerElement = this.resultsList;
    containerElement.innerHTML = "";
    try {
      const companyProfiles = await this.getCompaniesData(tickers);
      if (!companyProfiles) return;
      // if (containerElement.innerHTML !== "") ;
      companyProfiles.forEach((companyProfile) => {
        const { symbol: ticker } = companyProfile;
        const {
          image: logoUrl,
          companyName,
          changesPercentage: pctChange,
        } = companyProfile.profile;
        const resultDiv = this.createResultDiv();
        const resultA = this.createResultA(ticker);
        const resultImg = this.createResultImg(logoUrl);
        const resultNameSpan = this.createResultNameSpan(
          searchQuery,
          companyName
        );
        const resultTickerSpan = this.createResultTickerSpan(
          searchQuery,
          ticker
        );
        const resultPctChangeSpan = this.createResultPctChangeSpan(pctChange);
        resultA.append(
          resultImg,
          resultNameSpan,
          resultTickerSpan,
          resultPctChangeSpan
        );
        resultDiv.appendChild(resultA);
        const button = document.createElement("button");
        button.innerText = "Compare";
        button.addEventListener("click", (e) =>
          console.log(e.target.parentElement, companyProfile)
        );
        resultDiv.appendChild(button);
        containerElement.appendChild(resultDiv);
      });
      this.spinner.classList.add("d-none");
    } catch (e) {
      console.error(e);
    }
  }

  markMatch(query, text) {
    if (!query) return text;
    const matchingText = text.replace(
      new RegExp(query, "gi"),
      (match) => `<mark>${match}</mark>`
    );
    return matchingText;
  }
}
