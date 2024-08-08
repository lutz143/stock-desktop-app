const ticker = document.getElementById("meta-stock");
const employeesId = document.getElementById("employees");
const websiteId = document.getElementById("website");
const industryId = document.getElementById("industry");
const sectorId = document.getElementById("sector");


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

    guids.forEach(item => {
        guid = item.id;
        console.log(guid);

        if (guid) {
            employeesId.value = item.fullTimeEmployees;
            websiteId.value = item.website;
            industryId.value = item.industry;
            sectorId.value = item.sector;
        }
    })
}

ticker.addEventListener("change", updateguid);

updateguid();