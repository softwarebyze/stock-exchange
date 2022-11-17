class Marquee {
  constructor(marquee) {
    this.marquee = marquee;
  }
  async load() {
    const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/?&exchange=%22NASDAQ%22`;
    const response = await fetch(url);
    const data = await response.json();
    this.showMarquee(data);
    this.animateMarquee();
  }

  showMarquee(dataArray) {
    this.marquee.style.overflow = "hidden";
    this.marquee.innerHTML = `<div id="marquee-stocks" style="white-space: nowrap;"></div>`;
    this.marqueeStocksDiv = document.getElementById("marquee-stocks");
    dataArray.forEach((data, i) => {
      if (i > 100) return;
      if (data.change === null) return;
      let color = data.change > 0 ? "text-success" : "text-danger";
      this.marqueeStocksDiv.innerHTML += 
      `<span class="px-2">${data.symbol} <span class="${color} ps-1">$${Math.abs(data.change.toFixed(2))} </span></span>`;
    });
  }

  animateMarquee() {
    let _keyframes = [{ transform: "translateX(0%)" }, { transform: "translateX(-100%)" }];
    let _timing_options = {duration: 80000, iterations: Infinity, easing: "linear" }
    this.marqueeStocksDiv.animate(_keyframes, _timing_options);
  }
}