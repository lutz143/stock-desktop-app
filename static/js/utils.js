fetch('/todayStocksForecast')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // const stockDataDiv = document.getElementById('stock-data');
    // data.forEach(stock => {
    //     const stockDiv = document.createElement('div');
    //     stockDiv.textContent = JSON.stringify(stock);
    //     stockDataDiv.appendChild(stockDiv);
    // });
  })
  .catch(error => console.error('Error fetching stock data:', error));