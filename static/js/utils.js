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
    return parseFloat(value).toLocaleString('en-US', { maximumFractionDigits: decimal, minimumFractionDigits: decimal });
}

function formatWholeNumber(value) {
    return parseFloat(value).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function formatPercent(value, decimal) {
    return (parseFloat(value) * 100).toFixed(decimal) + '%';
}

// function formatDollarAmount(amount, decimal) {
//     // amount = parseFloat(amount.toFixed(1));

//     const formatter = new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD',
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2
//     })
// }