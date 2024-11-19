import { useState, useEffect } from 'react';
import { getStockPrices } from '../services/api';

const StockPrices = () => {
  const [stockPrices, setStockPrices] = useState([]);

  useEffect(() => {
    const fetchStockPrices = async () => {
      const data = await getStockPrices();
      setStockPrices(data);
    };
    fetchStockPrices();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Stock Prices</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stockPrices.map(stock => (
          <div key={stock.symbol} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold">{stock.symbol}</h2>
            <p className="text-gray-700 mt-2">Price: ${stock.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockPrices;
