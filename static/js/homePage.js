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
        industry.push(item.sector);
        peRatio.push(item.peRatio);
        profitMargins.push(item.profitMargin * 100);
        divYield.push(item.divYield * 100);
    });

    // Populate the industry filter dropdown
    populateIndustryFilter(industry);

    // Render the initial chart
    peChart = barLineChart(industry, 'PE Ratio', 'Profit Margin', 'Div Yield', peRatio, profitMargins, divYield, ctx2, 'industryChart');
}

// Function to populate industry filter dropdown as Bootstrap switches
function populateIndustryFilter(industry) {
    const industryFilter = document.getElementById('industryFilter');
    industryFilter.innerHTML = ''; // Clear any previous content

    industry.forEach(ind => {
        const switchWrapper = document.createElement('div');
        switchWrapper.className = 'custom-control custom-switch mb-2';

        const switchInput = document.createElement('input');
        switchInput.type = 'checkbox';
        switchInput.className = 'custom-control-input';
        switchInput.id = `switch-${ind}`;
        switchInput.value = ind;

        const switchLabel = document.createElement('label');
        switchLabel.className = 'custom-control-label';
        switchLabel.setAttribute('for', `switch-${ind}`);
        switchLabel.textContent = ind;

        switchWrapper.appendChild(switchInput);
        switchWrapper.appendChild(switchLabel);
        industryFilter.appendChild(switchWrapper);
    });
}

// Function to filter data by selected industries
function filterDataByIndustry(selectedIndustries, peAvg) {
    let filteredIndustry = [];
    let filteredPeRatio = [];
    let filteredProfitMargins = [];
    let filteredDivYield = [];

    peAvg.forEach(item => {
        if (selectedIndustries.includes(item.sector)) {
            filteredIndustry.push(item.sector);
            filteredPeRatio.push(item.peRatio);
            filteredProfitMargins.push(item.profitMargin * 100);
            filteredDivYield.push(item.divYield * 100);
        }
    });

    return {filteredIndustry, filteredPeRatio, filteredProfitMargins, filteredDivYield};
}

// Function to generate or update the bar/line chart
function barLineChart(xaxis, label1, label2, label3, bar1data, bar2data, linedata, ctx, chartType) {
    bar1data = replaceNullWithZero(bar1data);
    bar2data = replaceNullWithZero(bar2data);

    const newChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: xaxis,
            datasets: [
                {
                    label: label1,
                    data: bar1data,
                    backgroundColor: 'rgba(217, 217, 217, 0.6)',
                    borderColor: 'rgba(217, 217, 217, 1)',
                    yAxisID: 'y0',
                    fill: false
                },
                {
                    label: label2,
                    data: bar2data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                    yAxisID: 'y1'
                },
                {
                    label: label3,
                    data: linedata,
                    backgroundColor: 'rgba(12, 120, 194, 0.7)',
                    borderColor: 'rgba(12, 120, 194, 1)',
                    borderWidth: 1,
                    yAxisID: 'y1'
                },
            ]
        },
        options: {
            legend: {
                position: 'bottom'
            },
            scales: {
                yAxes: [
                    {
                        id: 'y0',
                        position: 'left',
                        scaleLabel: {
                            display: true,
                            labelString: `${label1}`
                        },
                        ticks: {
                            callback: function (value) {
                                return '$' + value.toLocaleString(); // Format as currency
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
                            labelString: `${label2} / ${label3}`
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: function (value) {
                                return formatPercent(value); // Convert to percentage
                            }
                        }
                    }
                ]
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        let datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                        let value = tooltipItem.yLabel;
                        
                        // Determine which label is being hovered over to format correctly
                        if (datasetLabel === label1) {
                            return datasetLabel + ': $' + value.toFixed(2).toLocaleString();
                        } else if (datasetLabel === label2 || datasetLabel === label3) {
                            return datasetLabel + ': ' + formatPercent(value);
                        }
                    }
                }
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
    return value.toFixed(2) + '%';
}

// Apply filter on button click
document.getElementById('applyFilter').addEventListener('click', function () {
    const selectedIndustries = Array.from(document.querySelectorAll('#industryFilter input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

    const {filteredIndustry, filteredPeRatio, filteredProfitMargins, filteredDivYield} = filterDataByIndustry(selectedIndustries, peAvg);

    // Destroy the previous chart instance if it exists
    if (peChart) {
        peChart.destroy();
    }

    // Create a new chart with the filtered data
    const ctx2 = document.getElementById('industryChart').getContext('2d');
    peChart = barLineChart(filteredIndustry, 'PE Ratio', 'Profit Margin', 'Div Yield', filteredPeRatio, filteredProfitMargins, filteredDivYield, ctx2, 'industryChart');
});

// Initialize the chart when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    peIndustryChart(); // Ensure the DOM is loaded before generating the chart
});
