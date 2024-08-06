function createTicker(data) {
    const tickerContainer = document.querySelector('.ticker-container');
    const tickerContent = document.querySelector('.ticker-content');

    // Set ticker header
    const tickerHeaderId = document.getElementById('ticker-header');
    let tickerHeader = `<div class="ticker-header">Stock Forecast (Prev Close | Mkt | NOM | Upside | IRR): </div>`;
    tickerHeaderId.innerHTML = tickerHeader;

    // Function to create ticker items
    const createTickerItem = (ticker, previousClose, MarketValuePerShare, NominalValuePerShare, TargetPriceUpside, IRR) => {
        const span = document.createElement('span');
        span.classList.add('ticker-item');
        span.textContent = `${ticker}: $${parseFloat(previousClose).toFixed(2)} | $${parseFloat(MarketValuePerShare).toFixed(2)} | $${parseFloat(NominalValuePerShare).toFixed(2)} | ${parseFloat(TargetPriceUpside).toFixed(1)}% | ${parseFloat(IRR).toFixed(1)}%`;
        return span;
    };

    // Process and display the ticker items
    const tickers = [...new Set(data.map(item => item.Ticker))];

    tickers.forEach(tickerSymbol => {
        let previousClose = 0;
        let MarketValuePerShare = 0;
        let NominalValuePerShare = 0;
        let TargetPriceUpside = 0;
        let IRR = 0;

        data.forEach(ticker => {
            if (ticker.Ticker === tickerSymbol) {
                previousClose = ticker.previousClose;
                MarketValuePerShare = ticker.MarketValuePerShare;
                NominalValuePerShare = ticker.NominalValuePerShare;
                TargetPriceUpside = ticker.TargetPriceUpside * 100;
                IRR = ticker.IRR * 100;
            }
        });

        const tickerItem = createTickerItem(tickerSymbol, previousClose, MarketValuePerShare, NominalValuePerShare, TargetPriceUpside, IRR);
        tickerContent.appendChild(tickerItem);
    })

    // Calculate the width of ticker items
    const totalWidth = Array.from(tickerContent.children).reduce((width, item) => {
        return width + item.offsetWidth;
    }, 0);

    // Set animation duration based on total width
    const animationDuration = totalWidth / 70; // adjust the divisor to change the speed
    tickerContent.style.animation = `scroll ${animationDuration}s linear infinite`;
}

// Call fetchStockData and pass createTicker as the callback
document.addEventListener('DOMContentLoaded', () => {
    fetchStockData(createTicker);
});
