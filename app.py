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

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/metaData')
def send_meta_form():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    # query the server
    cursor.execute("SELECT * FROM MetaData")
    rows = cursor.fetchall()
    print(rows)

    # close the connection to the database
    cursor.close()
    connection.close()

    return render_template('meta.html', data=rows)



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


if __name__ == '__main__':
    app.run(debug=True)