function fetchMetaData() {
    $.ajax({
        url: 'metadata',
        method: 'GET',
        success: function(data) {
            var table = $('#meta-table').DataTable();
            console.log(data);
            table.clear();
            data.forEach(function(row) {
                table.row.add([
                    row.Ticker,
                    `<a href=${row.website} target="_blank">${row.website}</a>`,
                    formatWholeNumber(row.fullTimeEmployees),
                    `<span title="${row.longBusinessSummary}">${row.longBusinessSummary}</span>`,
                    row.industry,
                    row.sector,
                    row.pegRatio,
                    formatDecimalNumber(row.beta, 2),
                    `$${formatDecimalNumber(row.dividendRate, 2)}`,
                    formatDecimalNumber(row.trailingAnnualDividendRate, 2),
                    row.exDividendDate,
                    row.targetMeanPrice
                ]).draw();
            });
        }
    });
}

function fetchAllForecastData() {
    $.ajax({
        url: 'forecast-all',
        method: 'GET',
        success: function(data) {
            var table = $('#forecast-table').DataTable();
            console.log(data);
            table.clear();
            data.forEach(function(row) {
                table.row.add([
                    row.Ticker,
                    formatDecimalNumber(row.previousClose, 2),
                    formatDecimalNumber(row.MarketValuePerShare, 2),
                    formatDecimalNumber(row.NominalValuePerShare, 2),
                    row.targetMeanPrice,
                    formatPercent(row.TargetPriceUpside),
                    formatPercent(row.IRR),
                    formatPercent(row.profitMargins),
                    formatPercent(row.returnOnAssets),
                    formatPercent(row.returnOnEquity),
                    formatPercent(row.COGS_Perct_Revenue_Avg),
                    formatPercent(row.Oper_Exp_Perct_Revenue_Avg),
                    formatPercent(row.CAPEX_Rate),
                    formatDecimalNumber(row.AR_Days_Avg, 1),
                    formatDecimalNumber(row.Inventory_Days_Avg, 1),
                    formatDecimalNumber(row.AP_Days_Avg, 1),
                    formatDecimalNumber(row.freeCashflow, 0),
                ]).draw();
            });
        }
    });
}

function fetchAllForecastDetails() {
    $.ajax({
        url: 'forecast-all',
        method: 'GET',
        success: function(data) {
            var table = $('#forecast-table').DataTable();
            console.log(data);
            table.clear();
            data.forEach(function(row) {
                table.row.add([
                    row.Ticker,
                    formatDecimalNumber(row.previousClose, 2),
                    formatDecimalNumber(row.MarketValuePerShare, 2),
                    formatDecimalNumber(row.NominalValuePerShare, 2),
                    formatPercent(row.profitMargins),
                    formatPercent(row.TargetPriceUpside),
                    formatPercent(row.IRR),
                    row.targetMeanPrice
                ]).draw();
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const headerButtons = document.querySelectorAll('.header-button');

    headerButtons.forEach(button => {
        button.addEventListener('click', () => {
            headerButtons.forEach(btn => {
                btn.classList.remove('active');
            })
            button.classList.add('active');
        })
    })
})