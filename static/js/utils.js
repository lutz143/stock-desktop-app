function fetchStockData(callback) {
    fetch('/todayStocksForecast')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            callback(data);
        })
        .catch(error => console.error('Error fetching stock data:', error));
}
