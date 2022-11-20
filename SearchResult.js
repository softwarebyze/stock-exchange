class SearchResult {
  constructor(results) {
    this.results = results;
    this.searchInput = document.querySelector("input");
  }

  getDataForResults(companyProfilesArray) {
    let resultsData = [];
    companyProfilesArray.forEach((companyProfile) =>
      resultsData.push({
        ticker: companyProfile.symbol,
        logoUrl: companyProfile.profile.image,
        companyName: companyProfile.profile.companyName,
        pctChange: companyProfile.profile.changesPercentage,
        pctColor:
          companyProfile.profile.changesPercentage > 0 ? "green" : "red",
        plus: companyProfile.profile.changesPercentage > 0 ? "+" : "",
      })
    );
    return resultsData;
  }

  async getCompaniesData(tickersArr) {
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

  async renderResults(tickers) {
    let searchQuery = this.searchInput.value;
    let containerElement = this.results;
    containerElement.innerHTML = "";
    try {
      const companyProfiles = await this.getCompaniesData(tickers);
      if (!companyProfiles) return;
      const dataForResults = this.getDataForResults(companyProfiles);
      if (containerElement.innerHTML !== "") return;
      dataForResults.forEach((resultData) => {
        containerElement.innerHTML += `
            <a href="./company.html?symbol=${
              resultData.ticker
            }" class="list-group-item list-group-item-action">
              <img src="${resultData.logoUrl}" height="50" width="50">
              <span>${this.markMatch(
                searchQuery,
                resultData.companyName
              )}</span>
              <span>(${this.markMatch(searchQuery, resultData.ticker)})</span>
              <span style="color: ${resultData.pctColor};">(${
          resultData.plus
        }${parseFloat(resultData.pctChange).toFixed(2)}%)</span>
            </a>
            `;
      });
    } catch (e) {
      console.error(e);
    }
  }

  markMatch(query, text) {
    let matchingText = text.replace(
      new RegExp(query, "gi"),
      (match) => `<mark>${match}</mark>`
    );
    return matchingText;
  }
}
