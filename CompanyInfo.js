let sym = new URLSearchParams(window.location.search).get("symbol");

async function getData(symbol) {
  let response = await fetch(
    `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`
  );
  console.log(response);
}

getData(sym);
