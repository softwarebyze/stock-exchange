const searchInput = document.querySelector("input");
const searchBtn = document.querySelector("button");
const resultListDiv = document.querySelector(".list-group");
const spinner = document.querySelector(".spinner-border");

async function getTickerSearchData() {
  const searchQuery = searchInput.value;
  let searchParams = new URLSearchParams(window.location.search);
  searchParams.set("query", searchQuery);
  let newRelativePathQuery =
    window.location.pathname + "?" + searchParams.toString();
  history.pushState(null, "", newRelativePathQuery);
  const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchQuery}&limit=10&exchange=NASDAQ`;
  try {
    const response = await fetch(url);
    const tickerSearchData = await response.json();
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
  resultListDiv.innerHTML = "";
  for (let i = 0; i < searchData.length; i++) {
    const a = document.createElement("a");
    a.href = `./company.html?symbol=${searchData[i].symbol}`;
    a.classList.add("list-group-item", "list-group-item-action");

    const companyData = await getCompanyData(searchData[i].symbol);

    const logoImg = document.createElement("img");
    logoImg.src = companyData.profile.image;
    logoImg.height = "50";
    a.appendChild(logoImg);
    const companyNameSpan = document.createElement("span");
    companyNameSpan.innerText = `${searchData[i].name}`;
    a.appendChild(companyNameSpan);
    const tickerSpan = document.createElement("span");
    tickerSpan.innerText = `(${searchData[i].symbol})`;
    a.appendChild(tickerSpan);
    const pctSpan = document.createElement("span");

    const pct = companyData.profile.changesPercentage;
    let pctColor = pct > 0 ? "green" : "red";
    let plus = pct > 0 ? "+" : "";
    pctSpan.innerText = `(${plus}${parseFloat(pct).toFixed(2)}%)`;
    pctSpan.style.color = pctColor;
    a.appendChild(pctSpan);

    resultListDiv.appendChild(a);
  }
}

async function getAndShow() {
  spinner.classList.remove("d-none");
  const tickerSearchData = await getTickerSearchData();
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
