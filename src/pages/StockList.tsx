import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { API_KEY, BASE_URL } from "../constants";

interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  assetType: string;
  ipoDate: string;
  delistingDate: string | null;
  status: string;
}

const StockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const startIndex = (currentPage - 1) * 50;
  const endIndex = startIndex + 50;
  const paginatedStocks = stocks.slice(startIndex, endIndex);
  const navigate = useNavigate();

  const totalPages = Math.ceil(stocks.length / 50);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}?function=LISTING_STATUS&apikey=${API_KEY}`
        );
        const csvData = await response.text();

        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setStocks(result.data as Stock[]);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center ">
        <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );

  return paginatedStocks.length ? (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stock Data</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-800 text-white text-left">
            <th className="py-2 px-4 border-b">Symbol</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Exchange</th>
            <th className="py-2 px-4 border-b">Asset Type</th>
            <th className="py-2 px-4 border-b">IPO Date</th>
            <th className="py-2 px-4 border-b">Delisting Date</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStocks.map((stock) => (
            <tr
              key={stock.symbol}
              className="cursor-pointer border-b"
              onClick={() => navigate(`/stock-data/${stock.symbol}`)}
            >
              <td className="py-4 px-6">{stock.symbol}</td>
              <td className="py-4 px-6">{stock.name}</td>
              <td className="py-4 px-6">{stock.exchange}</td>
              <td className="py-4 px-6">{stock.assetType}</td>
              <td className="py-4 px-6">{stock.ipoDate}</td>
              <td className="py-4 px-6 text-red-500">
                {stock.delistingDate || "N/A"}
              </td>
              <td className="py-4 px-6 text-green-500">{stock.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <button
          className="bg-blue-500 text-white py-1 px-3 rounded"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-blue-500 text-white py-1 px-3 rounded"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  ) : (
    <h1 className="text-2xl font-bold my-4 text-center">
      No stocks available right now!
    </h1>
  );
};

export default StockList;
