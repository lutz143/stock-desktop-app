const bellCurveCard = document.getElementById("bell-curve");

let dict = {};
let nominalCurve = 0
let conservativeCurve = 0
let currentPriceCurve = 0

let nominalHoldValue = 0 // update only once when the stock is loaded and hold for repitive calculations in the manipulateArray function

function calcConfidence () {
    bellCurveCard.style.display = "none";
    const selectedTicker = ticker.value
    const forecastGuids = forecastData.filter(forecast => forecast.Ticker === selectedTicker);

    if (forecastGuids.length > 0) {
        // Target the first record
        const forecast = forecastGuids[0];
        // let costDataKeys = ['NominalValuePerShare', 'MarketValuePerShare', 'previousClose', 'beta']
        // let percentDataKeys = ['TargetPriceUpside', 'IRR']

        // Render the values to the page
        if (forecast.id) {
            bellCurveCard.style.display = "flex";
            nominalCurve = forecast.NominalValuePerShare;
            nominalHoldValue = forecast.NominalValuePerShare;
            conservativeCurve = forecast.targetMeanPrice;
            currentPriceCurve = forecast.previousClose;

            const stDev = (conservativeCurve - nominalCurve) / jStat.normal.inv(0.8, 0, 1);
            const dollarPerPoint = (conservativeCurve - nominalCurve) / 30
            const stepDollarPerPoint = dollarPerPoint * 2
            
            if (stDev == 0) {
                bellCurveCard.style.display = "none";
            }

            manipulateArray(nominalCurve, stepDollarPerPoint, stDev, conservativeCurve, currentPriceCurve)
        }
    }
}

// ====================== START OF ARRAY MANIPULATION TO CALCULATE X & Y INTERCEPTS ======================
let nomNormalValue = 0;
let conNormalValue = 0;
let stockPriceNormalValue = 0;

function manipulateArray(nominalCurve, stepDollarPerPoint, stDev, conservativeCurve, currentPriceCurve) {
    let arrayMean = nominalCurve;

    // set the value at index 49 to be the nominal curve input value
    dict[49] = nominalCurve

    // loop through the array from index 48 to 0, subtracting stepDollarPerPoint from nominalCurve
    for (var i = 48; i >= 0; i--) {
        nominalCurve -= stepDollarPerPoint;
        dict[i] = nominalCurve
        arrayMean += parseFloat(dict[i]);
    }

    nominalCurve = parseFloat(nominalHoldValue); // reset the nominal value

    // loop through the array from index 50 to 99, adding stepDollarPerPoint from nominal
    for (var i = 50; i < 100; i++) {
        nominalCurve += stepDollarPerPoint;
        dict[i] = nominalCurve
        arrayMean += parseFloat(dict[i]);
    }

    // calc the new mean of the array
    arrayMean /= Object.keys(dict).length;

    // adjustments to array to set mean to NOM
    var adjustment = dict[49] - arrayMean;
    for (var key in dict) {
        dict[key] = (parseFloat(dict[key]) + adjustment);
    }

    nominalCurve = parseFloat(nominalHoldValue); // reset nominal value

    // calculate the normal distribution for NOM, CON, and stock positions to use as y-intercept
    nomNormalValue = jStat.normal.pdf(nominalCurve, arrayMean, stDev);
    conNormalValue = jStat.normal.pdf(conservativeCurve, arrayMean, stDev);
    stockPriceNormalValue = jStat.normal.pdf(currentPriceCurve, arrayMean, stDev);

    chartGenerator ();
}

