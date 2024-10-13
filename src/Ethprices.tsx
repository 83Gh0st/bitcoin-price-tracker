import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Price {
  source: string;
  price: string;
}

const Ethprices: React.FC = () => {
  const [prices, setPrices] = useState<Price[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/ethereum-prices');
        setPrices(response.data.sortedPrices);
      } catch (error) {
        console.error('Error fetching ethereum prices:', error);
      }
    };

    fetchPrices();
  }, []);

  return (
    <div>
      <h1>Ethereum Prices</h1>
      <ul>
        {prices.map((item, index) => (
          <li key={index}>
            Source: {item.source}, Price: ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ethprices;

