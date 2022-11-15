const img = document.querySelector("img");
const companyName = document.querySelector("a");
const stockPrice = document.querySelector(".price");
const stockPercent = document.querySelector(".percent");
const companyDescription = document.querySelector(".description");
const sym = new URLSearchParams(window.location.search).get("symbol");
const ctx = document.getElementById("myChart");
const spinner = document.querySelector(".spinner-border");

function showData(data) {
  img.src = data.profile.image;
  companyName.innerText = data.profile.companyName;
  companyName.href = data.profile.website;
  companyDescription.innerText = data.profile.description;
  stockPrice.innerText = `$${data.profile.price}`;
  const pct = data.profile.changesPercentage;
  let pctColor = pct > 0 ? "green" : "red";
  stockPercent.innerText = `(${parseFloat(pct).toFixed(2)}%)`;
  stockPercent.style.color = pctColor;
}

function makeChart(dates, closePrices) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Stock Price History",
          data: closePrices,
          fill: true,
          backgroundColor: "#FF6384",
          borderColor: "#FF6384",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

async function getHistory(symbol) {
  const response = await fetch(
    `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`
  );
  const data = await response.json();
  const history = data.historical;
  let dates = history.map((o) => o.date);
  let prices = history.map((o) => o.close);
  makeChart(dates, prices);
  spinner.classList.add("d-none");
}

async function getData(symbol) {
  const response = await fetch(
    `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`
  );
  const data = await response.json();
  showData(data);
  getHistory(symbol);
}

getData(sym);
