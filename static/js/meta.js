const ticker = document.getElementById("meta-stock");
const employeesId = document.getElementById("employees");
const websiteId = document.getElementById("website");
const industryId = document.getElementById("industry");
const sectorId = document.getElementById("sector");
const profitMarginId = document.getElementById("profit-margin");
const sharesOutstandingId = document.getElementById("shares-outstanding");
const peRatioId = document.getElementById("pe-ratio");
const reportFcfId = document.getElementById("reported-fcf");
const busSummaryId = document.getElementById("business-summary");
const costGridId = document.getElementById("cost-grid");
const percentGridId = document.getElementById("percent-grid");
const incomeForecastGrid = document.getElementById("income-forecast-grid");
const incomeStatementGrid = document.getElementById("income-statement-grid");
const balanceSheetGrid = document.getElementById("balance-sheet-grid");
const balanceSheetLiabilitiesGrid = document.getElementById("balance-sheet-liabilities-grid");
const balanceSheetEquityGrid = document.getElementById("balance-sheet-equity-grid");
const cashFlowGrid = document.getElementById("cash-flow-grid");


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
    incomeForecastGrid.innerHTML = '';
    incomeStatementGrid.innerHTML = '';
    balanceSheetGrid.innerHTML = '';
    balanceSheetLiabilitiesGrid.innerHTML = '';
    balanceSheetEquityGrid.innerHTML = '';
    cashFlowGrid.innerHTML = '';

    guids.forEach(item => {
        guid = item.id;
        // console.log(guid);

        if (guid) {
            employeesId.value = `${formatWholeNumber(item.fullTimeEmployees)}`;
            websiteId.innerHTML = `<a href=${item.website} target=_blank>${item.website}</a>`;
            industryId.value = item.industry;
            sectorId.value = item.sector;
            profitMarginId.value = `${formatDecimalNumber(item.profitMargins*100, 2)}%`;
            peRatioId.value = formatDecimalNumber(item.trailingPE, 1);
            sharesOutstandingId.value = formatWholeNumber(item.sharesOutstanding)
            reportFcfId.value = `$${formatDecimalNumber(item.freeCashflow, 0)}`;
            busSummaryId.value = item.longBusinessSummary;
        }
    })

    financialForecastData.forEach((item, index) => {
        let incomeGuid = item.id;

        if (incomeGuid === guid) {
            const trDiv = document.createElement('tr');

            trDiv.innerHTML = `
                <tr>
                    <td>${item.asOfYear}</td>
                    <td>${formatWholeNumber(item.TotalRevenue)}</td>
                    <td>${formatPercent(item.Revenue_Growth)}</td>
                    <td>${formatWholeNumber(item.CostOfRevenue)}</td>
                    <td>${formatWholeNumber(item.OperatingExpense)}</td>                    
                    <td>${formatWholeNumber(item.EBIT)}</td>
                    <td>${formatWholeNumber(item.ReconciledDepreciation)}</td>
                    <td>${formatWholeNumber(item.Less_Cash_Taxes)}</td>
                    <td>${formatWholeNumber(item.Less_CAPEX)}</td>
                    <td>${formatWholeNumber(item.ChangeInNetWorkingCapital)}</td>
                    <td>${formatWholeNumber(item.UnleveredFCF)}</td>
                    <td>${formatPercent(item.EBIT / item.TotalRevenue)}</td>
            `;

            incomeForecastGrid.appendChild(trDiv);
        }
    })
    incomeData.forEach((item, index) => {
        let incomeGuid = item.id;

        if (incomeGuid === guid) {
            const trDiv = document.createElement('tr');

            trDiv.innerHTML = `
                <tr>
                    <td>${item.asOfYear}</td>
                    <td>${formatWholeNumber(item.TotalRevenue)}</td>
                    <td>${formatWholeNumber(item.CostOfRevenue)}</td>
                    <td>${formatWholeNumber(item.GrossProfit)}</td>
                    <td>${formatWholeNumber(item.TotalExpenses)}</td>
                    <td>${formatWholeNumber(item.EBIT)}</td>
                    <td>${formatWholeNumber(item.NetIncome)}</td>
                    <td>${formatDecimalNumber(item.BasicEPS, 2)}</td>
                    <td>${formatPercent(item.EBIT / item.TotalRevenue)}</td>
            `;

            incomeStatementGrid.appendChild(trDiv);
        }
    })

    bsData.forEach((item, index) => {
        let bsGuid = item.id;

        if (bsGuid === guid) {
            const trDiv = document.createElement('tr');

            trDiv.innerHTML = `
                <tr>
                    <td>${item.asOfYear}</td>
                    <td>${formatWholeNumber(item.CurrentAssets)}</td>
                    <td>${formatWholeNumber(item.CashAndCashEquivalents)}</td>
                    <td>${formatWholeNumber(item.AccountsReceivable)}</td>
                    <td>${formatWholeNumber(item.Inventory)}</td>
                    <td>${formatWholeNumber(item.GrossPPE)}</td>
                    <td>${formatWholeNumber(item.TotalAssets)}</td>
            `;

            balanceSheetGrid.appendChild(trDiv);
        }
    })
    
    bsData.forEach((item, index) => {
        let bsGuid = item.id;

        if (bsGuid === guid) {
            const trDiv = document.createElement('tr');

            trDiv.innerHTML = `
                <tr>
                    <td>${item.asOfYear}</td>
                    <td>${formatWholeNumber(item.CurrentLiabilities)}</td>
                    <td>${formatWholeNumber(item.Payables)}</td>
                    <td>${formatWholeNumber(item.CurrentDebt)}</td>
                    <td>${formatWholeNumber(item.LongTermDebt)}</td>
                    <td>${formatWholeNumber(item.TotalLiabilities)}</td>
            `;

            balanceSheetLiabilitiesGrid.appendChild(trDiv);
        }
    })
    
    bsData.forEach((item, index) => {
        let bsGuid = item.id;

        if (bsGuid === guid) {
            const trDiv = document.createElement('tr');

            trDiv.innerHTML = `
                <tr>
                    <td>${item.asOfYear}</td>
                    <td>${formatWholeNumber(item.RetainedEarnings)}</td>
                    <td>${formatWholeNumber(item.CommonStock)}</td>
                    <td>${formatWholeNumber(item.AdditionalPaidInCapital)}</td>
                    <td>${formatWholeNumber(item.TotalEquity)}</td>
            `;

            balanceSheetEquityGrid.appendChild(trDiv);
        }
    })
    
    cfData.forEach((item, index) => {
        let cfGuid = item.id;

        if (cfGuid === guid) {
            const trDiv = document.createElement('tr');

            trDiv.innerHTML = `
                <tr>
                    <td>${item.asOfYear}</td>
                    <td>${formatWholeNumber(item.OperatingGainsLosses)}</td>
                    <td>${formatWholeNumber(item.DepreciationAndAmortization)}</td>
                    <td>${formatWholeNumber(item.ChangeInWorkingCapital)}</td>
                    <td>${formatWholeNumber(item.CashFlowFromContinuingOperatingActivities)}</td>
                    <td>${formatWholeNumber(item.CapitalExpenditure)}</td>
            `;

            cashFlowGrid.appendChild(trDiv);
        }
    })

    // Check if there are any matching records
    if (forecastGuids.length > 0) {
        // Target the first record
        const forecast = forecastGuids[0];
        let costDataKeys = ['NOM', 'Target Price', 'Mkt', 'Prev Close', 'Dividend']
        let dateDataKeys = ['Ex Div Date']
        let numbDataKeys = ['beta']
        let percentDataKeys = ['NOM Upside', 'IRR']

        // Render the values to the page
        if (forecast.id) {
            costDataKeys.forEach(key => {
                const rowDiv = document.createElement('div');
                rowDiv.classList.add('row', 'mb-2');

                const colLabelDiv = document.createElement('div');
                colLabelDiv.innerHTML = `
                <div class="row">
                    <div class="col">${key}: </div>
                    <div class="col">$${formatDecimalNumber(forecast[key], 2)}</div>
                </div>
                `
                rowDiv.appendChild(colLabelDiv);
                costGridId.appendChild(rowDiv)
            })
            dateDataKeys.forEach(key => {
                const rowDiv = document.createElement('div');
                rowDiv.classList.add('row', 'mb-2');

                const colLabelDiv = document.createElement('div');
                colLabelDiv.innerHTML = `
                <div class="row">
                    <div class="col">${key}: </div>
                    <div class="col">${formatDate(forecast[key])}</div>
                </div>
                `
                rowDiv.appendChild(colLabelDiv);
                costGridId.appendChild(rowDiv)
            })
            numbDataKeys.forEach(key => {
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
                percentGridId.appendChild(rowDiv)
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
ticker.addEventListener("change", assetsChartGenerator);
ticker.addEventListener("change", incomeChartGenerator);

updateguid();