const searchInput = document.querySelector("input");
const searchBtn = document.querySelector("button");
const resultListDiv = document.querySelector(".list-group");
const spinner = document.querySelector(".spinner-border");

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
  resultListDiv.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const a = document.createElement("a");
    a.classList.add("list-group-item", "list-group-item-action");
    a.innerText = `${data[i].name} (${data[i].symbol})`;
    a.href = `./company.html?symbol=${data[i].symbol}`;
    resultListDiv.appendChild(a);
  }
}

async function getAndShow() {
  spinner.classList.remove("d-none");
  const data = await getData();
  spinner.classList.add("d-none");
  showData(data);
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
