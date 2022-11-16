const searchInput = document.querySelector("input");
const searchBtn = document.querySelector("button");
const resultListDiv = document.querySelector(".list-group");
const spinner = document.querySelector(".spinner-border");

function setQueryInURL(searchQuery) {
  let searchParams = new URLSearchParams(window.location.search);
  searchParams.set("query", searchQuery);
  let newRelativePathQuery =
    window.location.pathname + "?" + searchParams.toString();
  history.pushState(null, "", newRelativePathQuery);
}

async function getTickers() {
  const searchQuery = searchInput.value;
  setQueryInURL(searchQuery);
  const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchQuery}&limit=10&exchange=NASDAQ`;
  try {
    const response = await fetch(url);
    const tickerSearchData = await response.json();
    const tickers = [];
    tickerSearchData.forEach((result) => tickers.push(result.symbol));
    console.log(tickers);
    return tickerSearchData;
  } catch (err) {
    console.error(err);
  }
}

async function getCompanyData(symbol) {
  const response = await fetch(
    `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`
  );
  const data = await response.json();
  return data;
}

async function showData(searchData) {
  // Using the number of results, company names, and symbols from the Ticker Search "(searchData)".
  // Using the logo and the percent change from the Company Search

  resultListDiv.innerHTML = "";
  // console.log(searchData.length)
  for (let i = 0; i < searchData.length; i++) {
    const a = document.createElement("a");
    // a.href = `./company.html?symbol=${searchData[i].symbol}`; //included
    // a.classList.add("list-group-item", "list-group-item-action"); //included

    // let aCopiedFromDevTools = `
    // <a href="./company.html?symbol=AAPL" class="list-group-item list-group-item-action">
    //   <img src="https://financialmodelingprep.com/images-New-jpg/AAPL.jpg" height="50">
    //   <span>Apple Inc.</span>
    //   <span>(AAPL)</span>
    //   <span style="color: red;">(-1.54%)</span>
    // </a>
    // `;

    const companyData = await getCompanyData(searchData[i].symbol);

    // const logoImg = document.createElement("img"); //included
    // logoImg.src = companyData.profile.image; //included
    // logoImg.height = "50"; //included
    // a.appendChild(logoImg); //included
    // const companyNameSpan = document.createElement("span"); //included
    // companyNameSpan.innerText = `${searchData[i].name}`; //included
    // a.appendChild(companyNameSpan); //included
    // const tickerSpan = document.createElement("span"); //included
    // tickerSpan.innerText = `(${searchData[i].symbol})`; //included
    // a.appendChild(tickerSpan); //included
    // const pctSpan = document.createElement("span"); //included

    const pct = companyData.profile.changesPercentage;
    let pctColor = pct > 0 ? "green" : "red";
    let plus = pct > 0 ? "+" : "";
    // pctSpan.innerText = `(${plus}${parseFloat(pct).toFixed(2)}%)`; //included
    // pctSpan.style.color = pctColor; //included
    // a.appendChild(pctSpan); //included

    let aFromDevToolsFilledWithCode = `
    <a href="./company.html?symbol=${
      searchData[i].symbol
    }" class="list-group-item list-group-item-action">
      <img src="${companyData.profile.image}" height="50">
      <span>${searchData[i].name}</span>
      <span>(${searchData[i].symbol})</span>
      <span style="color: ${pctColor};">(${plus}${parseFloat(pct).toFixed(
      2
    )}%)</span>
    </a>
    `;
    a.innerHTML = aFromDevToolsFilledWithCode;

    resultListDiv.appendChild(a);
    // resultListDiv.appendChild(aFromDevToolsFilledWithCode);
  }
}

async function getAndShow() {
  spinner.classList.remove("d-none");
  const tickerSearchData = await getTickers();
  // console.log('tickerSearchData', tickerSearchData);
  spinner.classList.add("d-none");
  showData(tickerSearchData);
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

searchBtn.addEventListener("click", getAndShow);
searchInput.addEventListener("input", debounce(getAndShow, 8));

if (window.location.search) {
  searchInput.value = new URLSearchParams(window.location.search).get("query");
  getAndShow();
}
