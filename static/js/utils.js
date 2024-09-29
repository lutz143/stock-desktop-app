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

function formatDate(inputDate) {
    // check if the date is null or an invalid date
    if (!inputDate) {
        return 'N/A';
    }

    // convert the date to a JavaScript Date object
    let date = new Date(inputDate);

    // check if the date is invalid
    if (isNaN(date.getTime())) {
        return 'N/A';
    }

    // extract the month, date, and year
    let month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
    let day = date.getUTCDate().toString().padStart(2, '0'); // January is 0
    let year = date.getUTCFullYear();

    return `${month}/${day}/${year}`;

}

// Function to replace null values with 0 in an array
function replaceNullWithZero(dataArray) {
    return dataArray.map(item => (item === null || item === undefined) ? 0 : item);
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