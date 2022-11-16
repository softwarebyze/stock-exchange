const searchInput = document.querySelector("input");
const searchBtn = document.querySelector("button");
const resultListDiv = document.getElementById("results");
const spinner = document.querySelector(".spinner-border");

function setQueryInURL(searchQuery) {
  let searchParams = new URLSearchParams(window.location.search);
  searchParams.set("query", searchQuery);
  let newRelativePathQuery =
    window.location.pathname + "?" + searchParams.toString();
  history.pushState(null, "", newRelativePathQuery);
}

async function getTickers(searchQuery) {
  setQueryInURL(searchQuery);
  const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchQuery}&limit=10&exchange=NASDAQ`;
  let tickers = [];
  try {
    const response = await fetch(url);
    const tickerSearchData = await response.json();
    tickerSearchData.forEach((result) => tickers.push(result.symbol));
    return tickers;
  } catch (err) {
    console.error(err);
  }
}

async function getCompaniesData(tickersArr) {
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

function getDataForResults(companyProfilesArray) {
  let resultsData = [];
  companyProfilesArray.forEach((companyProfile) =>
    resultsData.push({
      ticker: companyProfile.symbol,
      logoUrl: companyProfile.profile.image,
      companyName: companyProfile.profile.companyName,
      pctChange: companyProfile.profile.changesPercentage,
      pctColor: companyProfile.profile.changesPercentage > 0 ? "green" : "red",
      plus: companyProfile.profile.changesPercentage > 0 ? "+" : "",
    })
  );
  return resultsData;
}

async function renderResults(containerElement, tickers) {
  containerElement.innerHTML = "";
  try {
    const companyProfiles = await getCompaniesData(tickers);
    if (!companyProfiles) return;
    const dataForResults = getDataForResults(companyProfiles);
    if (containerElement.innerHTML !== "") return;

    dataForResults.forEach((resultData) => {
      containerElement.innerHTML += `
      <a href="./company.html?symbol=${resultData.ticker}" class="list-group-item list-group-item-action">
        <img src="${resultData.logoUrl}" height="50" width="50">
        <span>${resultData.companyName}</span>
        <span>(${resultData.ticker})</span>
        <span style="color: ${resultData.pctColor};">(${resultData.plus}${parseFloat(resultData.pctChange).toFixed(2)}%)</span>
      </a>
      `;
    });
  } catch (e) {
    console.error(e);
  }
}

async function onSearch() {
  let inputQuery = searchInput.value;
  if (!inputQuery) return;
  spinner.classList.remove("d-none");
  try {
    const tickers = await getTickers(inputQuery);
    if (!tickers) return;
    spinner.classList.add("d-none");
    renderResults(resultListDiv, tickers);
  } catch (e) {
    console.error(e);
  }
}

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

searchBtn.addEventListener("click", onSearch);
searchInput.addEventListener("input", debounce(onSearch, 8));

if (window.location.search) {
  searchInput.value = new URLSearchParams(window.location.search).get("query");
  onSearch();
}
