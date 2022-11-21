// function showData(data) {
//   const img = document.querySelector("img");
//   const companyName = document.querySelector("a");
//   const stockPrice = document.querySelector(".price");
//   const stockPercent = document.querySelector(".percent");
//   const companyDescription = document.querySelector(".description");
//   img.src = data.profile.image;
//   companyName.innerText = data.profile.companyName;
//   companyName.href = data.profile.website;
//   companyDescription.innerText = data.profile.description;
//   stockPrice.innerText = `$${data.profile.price}`;
//   const pct = data.profile.changesPercentage;
//   let pctColor = pct > 0 ? "green" : "red";
//   let plus = pct > 0 ? "+" : "";
//   stockPercent.innerText = `(${plus}${parseFloat(pct).toFixed(2)}%)`;
//   stockPercent.style.color = pctColor;
// }

// function addChart(dates, closePrices) {
//   const ctx = document.getElementById("myChart");
//   new Chart(ctx, {
//     type: "line",
//     data: {
//       labels: dates,
//       datasets: [
//         {
//           label: "Stock Price History",
//           data: closePrices,
//           fill: true,
//           backgroundColor: "#FF6384",
//           borderColor: "#FF6384",
//         },
//       ],
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//         },
//       },
//     },
//   });
// }

// async function getHistory(symbol) {
//   const spinner = document.querySelector(".spinner-border");
//   const response = await fetch(
//     `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`
//   );
//   const data = await response.json();
//   const history = data.historical;
//   let dates = history.map((o) => o.date);
//   let prices = history.map((o) => o.close);
//   addChart(dates, prices);
//   spinner.classList.add("d-none");
// }

// async function getCompanyData() {
//   const symbol = new URLSearchParams(window.location.search).get("symbol");
//   const response = await fetch(
//     `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`
//   );
//   const data = await response.json();
//   showData(data);
//   getHistory(symbol);
// }

// getCompanyData();

class CompanyInfo {
  constructor(container, symbol) {
    this.container = container;
    this.symbol = symbol;
    this.create();
    this.getElements();
  }

  create() {
    this.container.innerHTML = `
    <div class="d-flex align-items-center">
      <div><img alt="Company Logo" /></div>
      <div><a class="ms-3"></a></div>
    </div>
    <p class="stock-price">
      Stock Price: <span class="price"></span>
      <span class="percent"></span>
    </p>
    <p class="description"></p>
    <div>
      <canvas id="myChart"></canvas>
    </div>
    <div class="spinner-border"></div>
    `;
  }

  getElements() {
    this.img = document.querySelector("img");
    this.companyName = document.querySelector("a");
    this.stockPrice = document.querySelector(".price");
    this.stockPercent = document.querySelector(".percent");
    this.companyDescription = document.querySelector(".description");
    this.spinner = document.querySelector(".spinner-border");
    this.ctx = document.getElementById("myChart");
  }

  async fetchData() {
    const response = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${this.symbol}`
    );
    const data = await response.json();
    return data;
  }

  show(data) {
    const {
      image,
      companyName,
      website,
      description,
      price,
      changesPercentage,
    } = data.profile;
    const roundedPrice = price.toFixed(2);
    const roundedPct = Number(changesPercentage).toFixed(2);
    const pctColor = changesPercentage > 0 ? "green" : "red";
    const plus = changesPercentage > 0 ? "+" : "";
    this.img.src = image;
    this.companyName.innerText = companyName;
    this.companyName.href = website;
    this.companyDescription.innerText = description;
    this.stockPrice.innerText = "$" + roundedPrice;
    this.stockPercent.innerText = `(${plus}${roundedPct}%)`;
    this.stockPercent.style.color = pctColor;
  }

  async load() {
    const data = await this.fetchData();
    this.show(data);
  }

  async getHistory(symbol) {
    const response = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`
    );
    const data = await response.json();
    const history = data.historical;
    return history;
  }

  async addChart() {
    const data = await this.getHistory(this.symbol);
    const dates = data.map((o) => o.date);
    const closePrices = data.map((o) => o.close);
    new Chart(this.ctx, {
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
    this.spinner.classList.add("d-none");
  }
}
