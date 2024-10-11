let peChart; // Global variable to store the chart instance

function peIndustryChart() {
    const industryChartCard = document.getElementById("industry-chart");
    const ctx2 = document.getElementById('industryChart').getContext('2d');

    let industry = [];
    let peRatio = [];
    let profitMargins = [];
    let divYield = [];

    // Assuming peAvg is your data source, this needs to be defined elsewhere
    peAvg.forEach((item) => {
        industryChartCard.style.display = "flex";
        industry.push(item.industry);
        peRatio.push(item.peRatio * 100);
        profitMargins.push(item.profitMargin);
        divYield.push(item.divYield);        
    });

    // Populate the industry filter dropdown
    populateIndustryFilter(industry);

    // Render the initial chart
    peChart = barLineChart(industry, 'PE Ratio', 'Profit Margin', 'Dividend Yield', peRatio, profitMargins, divYield, ctx2, 'industryChart');
}

// Function to populate industry filter dropdown
function populateIndustryFilter(industry) {
    const industryFilter = document.getElementById('industryFilter');
    industry.forEach(ind => {
        const option = document.createElement('option');
        option.value = ind;
        option.textContent = ind;
        industryFilter.appendChild(option);
    });
}

// Function to filter data by selected industries
function filterDataByIndustry(selectedIndustries, peAvg) {
    let filteredIndustry = [];
    let filteredPeRatio = [];
    let filteredProfitMargins = [];
    let filteredDivYield = [];

    peAvg.forEach(item => {
        if (selectedIndustries.includes(item.industry)) {
            filteredIndustry.push(item.industry);
            filteredPeRatio.push(item.peRatio);
            filteredProfitMargins.push(item.profitMargin);
            filteredDivYield.push(item.divYield)
        }
    });

    return {filteredIndustry, filteredPeRatio, filteredProfitMargins, filteredDivYield};
}

// Function to generate or update the bar/line chart
function barLineChart(xaxis, label1, label2, label3, bar1data, bar2data, linedata, ctx, chartType) {

    // Replace null values with 0
    bar1data = replaceNullWithZero(bar1data);
    bar2data = replaceNullWithZero(bar2data);

    const newChart = new Chart(ctx, {
        type: 'bar', // Main chart type
        data: {
            labels: xaxis, // Industry names as x-axis labels
            datasets: [
                {
                    label: label1,
                    data: bar1data,
                    backgroundColor: 'rgba(217, 217, 217, 0.6)',
                    borderColor: 'rgba(217, 217, 217, 1)',
                    borderWidth: 1,
                    yAxisID: 'y0', // Use the first axis
                },
                {
                    label: label3,
                    data: linedata,
                    // type: 'line', // Line chart for this dataset
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    yAxisID: 'y1', // Use the second axis
                    fill: false
                },
                {
                    label: label2,
                    data: bar2data,
                    backgroundColor: 'rgba(12, 120, 194, 0.7)',
                    borderColor: 'rgba(12, 120, 194, 1)',
                    borderWidth: 1,
                    yAxisID: 'y1', // Use the first axis
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
                        labelString: `${label1}`
                    },
                    ticks: {
                        callback: function(value) {
                            value = value / 1000000;
                            return '$' + value.toLocaleString(); // Format as currency
                        }
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem) {
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
                        labelString: `${label3} / / ${label2}`
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: function(value) {
                            value = value * 100
                            return formatPercent(value); // Convert to percentage
                        }
                    }
                }]
            }
        }
    });

    return newChart;
}

// Function to replace null values with 0 in datasets
function replaceNullWithZero(data) {
    return data.map(item => item === null ? 0 : item);
}

// Function to format percentages
function formatPercent(value) {
    return value + '%';
}

// Apply filter on button click
document.getElementById('applyFilter').addEventListener('click', function () {
    const selectedIndustries = Array.from(document.getElementById('industryFilter').selectedOptions).map(option => option.value);

    const {filteredIndustry, filteredPeRatio, filteredProfitMargins, filteredDivYield} = filterDataByIndustry(selectedIndustries, peAvg);

    // Destroy the previous chart instance if it exists
    if (peChart) {
        peChart.destroy();
    }

    // Create a new chart with the filtered data
    const ctx2 = document.getElementById('industryChart').getContext('2d');
    peChart = barLineChart(filteredIndustry, 'PE Ratio', 'Profit Margin', 'Dividend Yield', filteredPeRatio, filteredProfitMargins, filteredDivYield, ctx2, 'industryChart');
});

// Initialize the chart when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    peIndustryChart(); // Ensure the DOM is loaded before generating the chart
});
