class Marquee {
  constructor(marquee) {
    this.marquee = marquee;
  }
  async load() {
    const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nasdaq`;
    const response = await fetch(url);
    const data = await response.json();
    this.showMarquee(data);
    this.animateMarquee();
  }

  showMarquee(dataArray) {
    this.marquee.style.overflow = "hidden";
    this.marquee.innerHTML = `<div id="marquee-stocks" style="white-space: nowrap;"></div>`;
    this.marqueeStocksDiv = document.getElementById("marquee-stocks");
    for (let i = 0; i < 100; i++) {
      if (dataArray[i].change === null) return;
      const color = dataArray[i].change > 0 ? "text-success" : "text-danger";
      this.marqueeStocksDiv.innerHTML += `<span class="px-2">${
        dataArray[i].symbol
      } <span class="${color} ps-1">$${Math.abs(
        dataArray[i].change.toFixed(2)
      )} </span></span>`;
    }
  }

  animateMarquee() {
    const _keyframes = [
      { transform: "translateX(0%)" },
      { transform: "translateX(-100%)" },
    ];
    const _timing_options = {
      duration: 80000,
      iterations: Infinity,
      easing: "linear",
    };
    this.marqueeStocksDiv.animate(_keyframes, _timing_options);
  }
}
