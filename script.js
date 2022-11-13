const searchInput = document.querySelector("input");
const searchBtn = document.querySelector("button");
const ul = document.querySelector("ul");

async function getData() {
  const searchQuery = searchInput.value;
  const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchQuery}&limit=10&exchange=NASDAQ`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

function showData(data) {
  ul.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    let newLi = document.createElement("li");
    newLi.innerHTML = `<li class="list-group-item">${data[i].name} (${data[i].symbol})</li>`;
    ul.appendChild(newLi);
  }
}

async function getAndShow() {
  const data = await getData();
  showData(data);
}

searchBtn.addEventListener("click", getAndShow);
