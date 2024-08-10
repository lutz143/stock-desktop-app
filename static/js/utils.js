function fetchStockData(callback) {
    fetch('/todayStocksForecast')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            callback(data);
        })
        .catch(error => console.error('Error fetching stock data:', error));
}

function formatDecimalNumber(value, decimal) {
    return parseFloat(value).toLocaleString('en-US', { maximumFractionDigits: decimal });
}

function formatWholeNumber(value) {
    return parseFloat(value).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function formatPercent(value) {
    return (parseFloat(value) * 100).toFixed(2) + '%';
}