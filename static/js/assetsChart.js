let assetsChart, incomeChart; // Global variables to store individual chart instances

function assetsChartGenerator() {
    const assetChartCard = document.getElementById("assets-chart");
    const ctx2 = document.getElementById('assetsChart').getContext('2d');

    let years = []
    let assets = []
    let liab = []
    let ratio = []

    bsData.forEach((item, index) => {
        let bsGuid = item.id;

        if (bsGuid === guid) {
            assetChartCard.style.display = "flex";
            years.push(item.asOfYear);
            assets.push(item.CurrentAssets);
            liab.push(item.CurrentLiabilities);
            ratio.push((item.CurrentAssets - item.Inventory) / item.CurrentLiabilities);
        }
    });

    barLineChart(years, 'Current Assets', 'Current Liabilities', 'Quick Ratio', assets, liab, ratio, ctx2, 'assetsChart');
}

function incomeChartGenerator() {
    const incomeChartCard = document.getElementById("income-chart");
    const ctx3 = document.getElementById('incomeChart').getContext('2d');

    let years = []
    let revenue = []
    let ebit = []
    let ratio = []

    incomeData.forEach((item, index) => {
        let incomeGuid = item.id;

        if (incomeGuid === guid) {
            incomeChartCard.style.display = "flex";
            years.push(item.asOfYear);
            revenue.push(item.TotalRevenue);
            ebit.push(item.EBIT);
            ratio.push(item.EBIT / item.TotalRevenue);
        }
    });

    barLineChart(years, 'Revenue', 'EBIT', 'ROS', revenue, ebit, ratio, ctx3, 'incomeChart');
}

// ====================== START OF CHART GENERATION AND RENDERING TO PAGE ======================
function barLineChart(xaxis, label1, label2, label3, bar1data, bar2data, linedata, ctx, chartType) {

    // Check if the specific chart instance already exists and destroy it
    if (chartType === 'assetsChart' && assetsChart) {
        assetsChart.destroy();
    }
    if (chartType === 'incomeChart' && incomeChart) {
        incomeChart.destroy();
    }

    // Replace null values with 0
    bar1data = replaceNullWithZero(bar1data);
    bar2data = replaceNullWithZero(bar2data);

    const newChart = new Chart(ctx, {
        type: 'bar', // Main chart type
        data: {
            labels: xaxis, // Replace with your year labels
            datasets: [
                {
                    label: label1,
                    data: bar1data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    yAxisID: 'y0', // Use the first axis
                },
                {
                    label: label2,
                    data: bar2data,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    yAxisID: 'y0', // Use the first axis
                },
                {
                    label: label3,
                    data: linedata,
                    type: 'line', // Line chart for this dataset
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    yAxisID: 'y1', // Use the second axis
                    fill: false
                }
            ]
        },
        options: {
            legend: {
                position: 'bottom'
            },
            scales: {
                yAxes: [{
                    id: 'y0',
                    position: 'left',
                    scaleLabel: {
                        display: true,
                        labelString: `${label1} / ${label2}`
                    },
                    ticks: {
                        callback: function(value) {
                            value = value / 1000000
                            return '$' + value.toLocaleString(); // Format as currency
                        }
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                return '$' + tooltipItem.yLabel;
                            }
                        }
                    }
                },
                {
                    id: 'y1',
                    position: 'right',
                    gridLines: {
                        display: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: `${label3}`
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: function(value) {
                            return formatPercent(value) // Convert to percentage
                        }
                    }
                }]
            }
        }
    });

    // Store the new chart instance in the corresponding variable
    if (chartType === 'assetsChart') {
        assetsChart = newChart;
    } else if (chartType === 'incomeChart') {
        incomeChart = newChart;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    assetsChartGenerator(); // Ensure the DOM is loaded before generating the chart
    incomeChartGenerator();
});