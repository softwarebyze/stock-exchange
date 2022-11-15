function showData(data) {
  const img = document.querySelector("img");
  const companyName = document.querySelector("a");
  const stockPrice = document.querySelector(".price");
  const stockPercent = document.querySelector(".percent");
  const companyDescription = document.querySelector(".description");
  img.src = data.profile.image;
  companyName.innerText = data.profile.companyName;
  companyName.href = data.profile.website;
  companyDescription.innerText = data.profile.description;
  stockPrice.innerText = `$${data.profile.price}`;
  const pct = data.profile.changesPercentage;
  let pctColor = pct > 0 ? "green" : "red";
  let plus = pct > 0 ? "+" : "";
  stockPercent.innerText = `(${plus}${parseFloat(pct).toFixed(2)}%)`;
  stockPercent.style.color = pctColor;
}

function addChart(dates, closePrices) {
  const ctx = document.getElementById("myChart");
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
  const spinner = document.querySelector(".spinner-border");
  const response = await fetch(
    `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`
  );
  const data = await response.json();
  const history = data.historical;
  let dates = history.map((o) => o.date);
  let prices = history.map((o) => o.close);
  addChart(dates, prices);
  spinner.classList.add("d-none");
}

async function getTickerSearchData() {
  const symbol = new URLSearchParams(window.location.search).get("symbol");
  const response = await fetch(
    `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`
  );
  const data = await response.json();
  showData(data);
  getHistory(symbol);
}

getTickerSearchData();

// class CompanyInfo {
//   constructor(container, symbol) {
//     this.container = container;
//     this.symbol = symbol;
//     container.appendChild();
//   }
//   displayInfo() {
//     return this.name + "is " + this.age + " years old!";
//   }
//   load() {}
//   addChart() {}
// }
// (async function () {
//   const params = new URLSearchParams(location.search);
//   const symbol = params.get("symbol");
//   const compInfo = new CompanyInfo(document.getElementById("compInfo"), symbol);
// })();
