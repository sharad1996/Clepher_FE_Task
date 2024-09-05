import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate, useParams } from "react-router-dom";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const API_KEY = "HD4VDRQXBH5KK2ZM";
const BASE_URL = "https://www.alphavantage.co/query";

interface StockData {
  symbol: string;
  name: string;
  type: string;
  dates: string[];
  prices: number[];
}

const fetchStockData = async (symbol: string): Promise<StockData> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();

    const dates = Object.keys(data["Time Series (Daily)"]);
    const prices = dates.map(
      (date) => data["Time Series (Daily)"][date]["4. close"]
    );

    return {
      symbol,
      name: symbol,
      type: "Stock",
      dates,
      prices: prices.map((price: string) => parseFloat(price)),
    };
  } catch (error) {
    throw new Error("Failed to fetch stock data");
  }
};

const StockData: React.FC = () => {
  const [stockData, setStockData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { symbol = "" } = useParams();
  const getStockData = async () => {
    if (symbol.trim()) {
      setError(null);
      try {
        const data = await fetchStockData(symbol);
        setStockData(data);
      } catch (error) {
        setError("Failed to fetch data");
      }
    }
  };
  useEffect(() => {
    getStockData();
  }, []);

  const formatChartData = (data: any) => {
    return {
      labels: data.dates,
      datasets: [
        {
          label: "Stock Price",
          data: data.prices,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    };
  };

  return (
    <div className="text-center pb-20">
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {stockData && !error && (
        <div className="mt-4">
          <div className="bg-white shadow-md rounded-lg p-6 mt-4">
            <h2 className="text-2xl text-left font-semibold mb-4 text-gray-800">
              Stock Information
            </h2>
            <div className="text-gray-700 text-left">
              <p className="mb-2">
                <strong className="text-gray-900">Symbol:</strong>{" "}
                {stockData.symbol}
              </p>

              <p className="mb-2">
                <strong className="text-gray-900">Type:</strong>{" "}
                {stockData.type}
              </p>
            </div>
            <div className="mt-8 max-w-4xl mx-auto">
              <Line data={formatChartData(stockData)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockData;
