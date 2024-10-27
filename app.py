from flask import Flask, render_template, request, send_file, jsonify, redirect, url_for
from dotenv import load_dotenv
import mysql.connector
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)


# Enforce content-type check for JSON
@app.before_request
def before_request():
    if request.method == 'POST' and request.is_json:
        try:
            request.get_json()
        except Exception:
          return jsonify({"error": "Invalid JSON data"}), 400

# Connection to the database
def get_db_connection():
    connection = mysql.connector.connect(
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )
    return connection

# fetch and render the homepage
@app.route('/')
def index():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    # query the server for avg pe ratio by sector
    query = '''
        SELECT sector, AVG(trailingPE) as peRatio, AVG(profitMargins) as profitMargin, AVG(dividendYield) as divYield
        FROM MetaData
        GROUP BY sector
        ORDER BY sector
    '''
    cursor.execute(query)
    avg_pe_sector = cursor.fetchall()

    return render_template('index.html', avg_pe_sector=avg_pe_sector)

@app.route('/sub-page')
def subPage():
    return render_template('sub-page.html')

# fetch and render metaData page
@app.route('/metaData')
def send_meta_form():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    # query the server for metadata
    cursor.execute("SELECT * FROM MetaData ORDER BY Ticker")
    metadata = cursor.fetchall()

    # query the server for all stock forecast data (including archived data)
    cursor.execute(f"""
        SELECT id, Ticker, previousClose as `Prev Close`, MarketValuePerShare as Mkt, NominalValuePerShare as NOM, profitMargins, beta, dividendRate as Dividend, exDividendDate, TargetPriceUpside as `NOM Upside`, IRR, targetMeanPrice as `Target Price`, exDividendDate as `Ex Div Date`, freeCashflow
        FROM ArchiveStockForecast
        GROUP BY id, Ticker, `Prev Close`, Mkt, NOM, profitMargins, beta, dividendRate, exDividendDate, `NOM Upside`, IRR, `Target Price`, `Ex Div Date`, freeCashflow
    """)
    forecast_data = cursor.fetchall()

    # query the server for all stock income statement data
    cursor.execute(f"""
        SELECT id, Ticker, asOfYear, periodType, TotalRevenue, CostOfRevenue, GrossProfit, TotalExpenses, EBIT, BasicEPS, NetIncome
        FROM incomeStatement
        WHERE periodType <> 'TTM'
        GROUP BY id, Ticker, asOfYear, periodType, TotalRevenue, CostOfRevenue, GrossProfit, TotalExpenses, EBIT, BasicEPS, NetIncome
    """)
    income_data = cursor.fetchall()

    # query the server for all stock balance sheet data
    cursor.execute(f"""
        SELECT id, Ticker, asOfYear, periodType, CurrentAssets, CashAndCashEquivalents, AccountsReceivable, Inventory, GrossPPE, TotalAssets, CurrentLiabilities, Payables, CurrentDebtAndCapitalLeaseObligation as CurrentDebt, LongTermDebt, TotalLiabilitiesNetMinorityInterest as TotalLiabilities, RetainedEarnings, CommonStock, AdditionalPaidInCapital, TotalEquityGrossMinorityInterest as TotalEquity
        FROM balanceSheet
        WHERE periodType <> 'TTM'
        GROUP BY id, Ticker, asOfYear, periodType, CurrentAssets, CashAndCashEquivalents, AccountsReceivable, Inventory, GrossPPE, TotalAssets, CurrentLiabilities, Payables, CurrentDebtAndCapitalLeaseObligation, LongTermDebt, TotalLiabilitiesNetMinorityInterest, RetainedEarnings, CommonStock, AdditionalPaidInCapital, TotalEquityGrossMinorityInterest
    """)
    balance_sheet_data = cursor.fetchall()

    # query the server for all stock cash flow data
    cursor.execute(f"""
        SELECT id, Ticker, asOfYear, periodType, OperatingGainsLosses, DepreciationAndAmortization, ChangeInWorkingCapital, CashFlowFromContinuingOperatingActivities, CapitalExpenditure, CashFlowFromContinuingInvestingActivities, CashFlowFromContinuingInvestingActivities, NetIssuancePaymentsOfDebt, NetCommonStockIssuance, CashFlowFromContinuingFinancingActivities, ChangesInCash, EndCashPosition
        FROM cashFlow
        WHERE periodType <> 'TTM'
        GROUP BY id, Ticker, asOfYear, periodType, OperatingGainsLosses, DepreciationAndAmortization, ChangeInWorkingCapital, CashFlowFromContinuingOperatingActivities, CapitalExpenditure, CashFlowFromContinuingInvestingActivities, CashFlowFromContinuingInvestingActivities, NetIssuancePaymentsOfDebt, NetCommonStockIssuance, CashFlowFromContinuingFinancingActivities, ChangesInCash, EndCashPosition
    """)
    cash_flow_data = cursor.fetchall()


    # query the server for all stock forecast data (including archived data)
    cursor.execute(f"""
        SELECT id, asOfYear, TotalRevenue, Revenue_Growth, CostOfRevenue, OperatingExpense, EBIT, ReconciledDepreciation, Less_Cash_Taxes, Less_CAPEX, ChangeInNetWorkingCapital, UnleveredFCF
        FROM ArchiveStockForecast
        ORDER BY id, asOfYear
    """)
    financial_forecast_data = cursor.fetchall()

    # close the connection to the database
    cursor.close()
    connection.close()

    return render_template('meta.html', metadata=metadata, forecast_data=forecast_data, financial_forecast_data=financial_forecast_data, income_data = income_data, balance_sheet_data = balance_sheet_data, cash_flow_data = cash_flow_data)



@app.route('/todayStocksData', methods=['GET'])
def get_today_stocks():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM TodayStockForecast")
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(results)


@app.route('/todayStocksForecast', methods=['GET'])
def get_stocks():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(f"""
      SELECT Ticker, previousClose, MarketValuePerShare, NominalValuePerShare, profitMargins, beta, dividendRate, exDividendDate, TargetPriceUpside, IRR
      FROM TodayStockForecast
      GROUP BY Ticker, previousClose, MarketValuePerShare, NominalValuePerShare, profitMargins, beta, dividendRate, exDividendDate, TargetPriceUpside, IRR
    """)

    results = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify(results)

# get all metadata
@app.route('/metadata', methods=['Get'])
def metadataAll():
    # establish connnection to database
    connection = get_db_connection()
    cursor = connection.cursor()

    # query the database
    cursor.execute(f"""
        SELECT *
        FROM MetaData
        ORDER BY Ticker, Pull_Date
    """)

    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]

    # convert rows to list of dictionaries
    data = [dict(zip(columns, row)) for row in rows]

    # close the connection to the database
    cursor.close()
    connection.close()

    return jsonify(data)


# get all forecasted stocks (including archived)
@app.route('/forecast-all', methods=['Get'])
def forecastAll():
    # establish connnection to database
    connection = get_db_connection()
    cursor = connection.cursor()

    # query the database
    cursor.execute(f"""
        SELECT Ticker, previousClose, MarketValuePerShare, NominalValuePerShare, targetMeanPrice, profitMargins, returnOnAssets, returnOnEquity, TargetPriceUpside, IRR, COGS_Perct_Revenue_Avg, Oper_Exp_Perct_Revenue_Avg, CAPEX_Rate, AR_Days_Avg, Inventory_Days_Avg, AP_Days_Avg, freeCashflow
                   
        FROM ArchiveStockForecast
                   
        GROUP BY Ticker, previousClose, MarketValuePerShare, NominalValuePerShare, targetMeanPrice, profitMargins, returnOnAssets, returnOnEquity, TargetPriceUpside, IRR, COGS_Perct_Revenue_Avg, Oper_Exp_Perct_Revenue_Avg, CAPEX_Rate, AR_Days_Avg, Inventory_Days_Avg, AP_Days_Avg, freeCashflow
                   
        ORDER BY TargetPriceUpside
    """)

    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]

    # convert rows to list of dictionaries
    data = [dict(zip(columns, row)) for row in rows]

    # close the connection to the database
    cursor.close()
    connection.close()

    return jsonify(data)

# get all forecasted stock details (including archived)
# @app.route('/forecast-all-details', methods=['Get'])
# def forecastAll():
    # establish connnection to database
    connection = get_db_connection()
    cursor = connection.cursor()

    # query the database
    cursor.execute(f"""
        SELECT Ticker, previousClose, MarketValuePerShare, NominalValuePerShare, profitMargins, TargetPriceUpside, IRR, targetMeanPrice
        FROM ArchiveStockForecast
        GROUP BY Ticker, previousClose, MarketValuePerShare, NominalValuePerShare, profitMargins, TargetPriceUpside, IRR, targetMeanPrice
        ORDER BY TargetPriceUpside
    """)

    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]

    # convert rows to list of dictionaries
    data = [dict(zip(columns, row)) for row in rows]

    # close the connection to the database
    cursor.close()
    connection.close()

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)