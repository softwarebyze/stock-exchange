const img = document.querySelector("img");
const companyName = document.querySelector("a");
const stockPrice = document.querySelector(".price");
const stockPercent = document.querySelector(".percent");
const companyDescription = document.querySelector(".description");

const sym = new URLSearchParams(window.location.search).get("symbol");

async function getData(symbol) {
  const response = await fetch(
    `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`
  );
  const data = await response.json();
  console.log(data);
  showData(data);
}

getData(sym);

function showData(data) {
  img.src = data.profile.image;
  companyName.innerText = data.profile.companyName;
  companyName.href = data.profile.website;
  companyDescription.innerText = data.profile.description;
  stockPrice.innerText = `$${data.profile.price}`;
  const pct = data.profile.changesPercentage;
  let pctColor = pct > 0 ? 'green' : 'red'
  stockPercent.innerText = `(${parseFloat(pct).toFixed(2)}%)`;
  console.log(pctColor);
  stockPercent.style.color = pctColor;
}
