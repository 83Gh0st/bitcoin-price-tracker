import { FC } from 'react';

interface PriceData {
  price: string;  // Assuming price is a string
  source: string;
}

interface ResultRowProps {
  loading: boolean;
  ethPrice: Array<PriceData>; // This should be an array of price objects
}

const ResultRowETH: FC<ResultRowProps> = ({ loading, ethPrice }) => {
  return (
    <div className="relative border min-h-12 border-white/10 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4 my-2 overflow-hidden">
      <div className="flex flex-col gap-4">
        {loading ? (
          <span className="text-xl text-purple-200/80">Loading...</span>
        ) : ethPrice.length > 0 ? (
          ethPrice.map((entry, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center transition-all duration-300 p-3 my-1 rounded-md shadow-md border border-gray-300 bg-white/10 hover:bg-white/20" // Added styles for distinct rows
            >
              <img 
                src="/eth.jpeg" 
                alt="Ethereum Logo" 
                className="w-6 h-6 mr-2" 
              />
              <span className="text-xl text-purple-200/80 font-semibold">{entry.source}</span>
              <span className="text-xl text-purple-300/50">
                {parseFloat(entry.price).toFixed(4)} ETH
              </span>
            </div>
          ))
        ) : (
          <span className="text-xl text-purple-200/80">ETH Price Unavailable</span>
        )}
      </div>
      {loading && (
        <div className="inset-0 absolute bg-gradient-to-r from-transparent via-red-900/50 to-transparent skelton-animation" />
      )}
    </div>
  );
};

export default ResultRowETH;
