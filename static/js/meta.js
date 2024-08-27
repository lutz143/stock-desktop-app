const ticker = document.getElementById("meta-stock");
const employeesId = document.getElementById("employees");
const websiteId = document.getElementById("website");
const industryId = document.getElementById("industry");
const sectorId = document.getElementById("sector");
const busSummaryId = document.getElementById("business-summary");
const costGridId = document.getElementById("cost-grid");
const percentGridId = document.getElementById("percent-grid");


const tickers = [...new Set(metaData.map(item => item.Ticker))]; // set duplicate tickers to unique values only

tickers.forEach(item => {
    const option = document.createElement("option");

    option.innerHTML = `
        <option value="${item}">${item}</option>
    `
    ticker.appendChild(option);
})

// function to update uid based on the selected values of the ticker
function updateguid() {
    const selectedTicker = ticker.value
    const guids = metaData.filter(item => item.Ticker === selectedTicker);
    const forecastGuids = forecastData.filter(forecast => forecast.Ticker === selectedTicker);

    websiteId.innerHTML = '';
    costGridId.innerHTML = '';
    percentGridId.innerHTML = '';

    guids.forEach(item => {
        guid = item.id;
        // console.log(guid);

        if (guid) {
            employeesId.value = `${formatWholeNumber(item.fullTimeEmployees)}`;
            websiteId.innerHTML = `<a href=${item.website} target=_blank>${item.website}</a>`;
            industryId.value = item.industry;
            sectorId.value = item.sector;
            busSummaryId.value = item.longBusinessSummary;
        }
    })

    // Check if there are any matching records
    if (forecastGuids.length > 0) {
        // Target the first record
        const forecast = forecastGuids[0];
        let forecastId = forecast.id;
        let costDataKeys = ['NominalValuePerShare', 'MarketValuePerShare', 'previousClose', 'beta']
        let percentDataKeys = ['TargetPriceUpside', 'IRR']

        // Render the values to the page
        if (forecast.id) {
            costDataKeys.forEach(key => {
                const rowDiv = document.createElement('div');
                rowDiv.classList.add('row', 'mb-2');

                const colLabelDiv = document.createElement('div');
                colLabelDiv.innerHTML = `
                <div class="row">
                    <div class="col">${key}: </div>
                    <div class="col">${formatDecimalNumber(forecast[key], 2)}</div>
                </div>
                `
                rowDiv.appendChild(colLabelDiv);
                costGridId.appendChild(rowDiv)
            })
            percentDataKeys.forEach(key => {
                const rowDiv = document.createElement('div');
                rowDiv.classList.add('row', 'mb-2');

                const colLabelDiv = document.createElement('div');
                colLabelDiv.innerHTML = `
                <div class="row">
                    <div class="col">${key}: </div>
                    <div class="col">${formatPercent(forecast[key], 1)}</div>
                </div>
                `
                rowDiv.appendChild(colLabelDiv);
                percentGridId.appendChild(rowDiv)
            })
        }
    }
}

ticker.addEventListener("change", updateguid);
ticker.addEventListener("change", calcConfidence);

updateguid();