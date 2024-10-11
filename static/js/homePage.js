let peChart; // Global variables to store individual chart instances

function peIndustryChart() {
    const industryChartCard = document.getElementById("industry-chart");
    const ctx2 = document.getElementById('industryChart').getContext('2d');

    let industry = []
    let peRatio = []
    let profitMargins = []
    let ratio = []

    peAvg.forEach((item, index) => {
        
        industryChartCard.style.display = "flex";
        industry.push(item.industry);
        peRatio.push(item.peRatio);
        profitMargins.push(item.profitMargin);
        // ratio.push((item.CurrentAssets - item.Inventory) / item.CurrentLiabilities);
        
    });

    barLineChart(industry, 'Industry', 'PE Ratio', 'Profit Margin', peRatio, profitMargins, ratio, ctx2, 'industryChart');
}



// ====================== START OF CHART GENERATION AND RENDERING TO PAGE ======================
function barLineChart(xaxis, label1, label2, label3, bar1data, bar2data, linedata, ctx, chartType) {


    // Replace null values with 0
    bar1data = replaceNullWithZero(bar1data);
    bar2data = replaceNullWithZero(bar2data);

    const newChart = new Chart(ctx, {
        type: 'bar', // Main chart type
        data: {
            labels: xaxis, // Replace with your year labels
            datasets: [
                {
                    label: label3,
                    data: linedata,
                    type: 'line', // Line chart for this dataset
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    yAxisID: 'y1', // Use the second axis
                    fill: false
                },
                {
                    label: label1,
                    data: bar1data,
                    backgroundColor: 'rgba(217, 217, 217, 0.6)',
                    borderColor: 'rgba(217, 217, 217, 1)',
                    borderWidth: 1,
                    yAxisID: 'y0', // Use the first axis
                },
                {
                    label: label2,
                    data: bar2data,
                    backgroundColor: 'rgba(12, 120, 194, 0.7)',
                    borderColor: 'rgba(12, 120, 194, 1)',
                    borderWidth: 1,
                    yAxisID: 'y0', // Use the first axis
                },
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

}

document.addEventListener('DOMContentLoaded', function () {
    peIndustryChart(); // Ensure the DOM is loaded before generating the chart
});