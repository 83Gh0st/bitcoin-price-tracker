import { FC } from 'react';

interface ResultRowProps {
  loading: boolean;
  btcPrice: Array<{ price: string; source: string }>; // Expecting an array
}

const ResultRow: FC<ResultRowProps> = ({ loading, btcPrice }) => {
  return (
    <div className="relative border min-h-12 border-white/10 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4 my-2 overflow-hidden">
      <div className="flex flex-col gap-4">
        {loading ? (
          <span className="text-xl text-purple-200/80">Loading...</span>
        ) : (
          btcPrice.map((priceData, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center transition-all duration-300 p-3 my-1 rounded-md shadow-md border border-gray-300 bg-white/10 hover:bg-white/20" // Added styles for distinct rows
            >
              <img 
                src="/btc.jpeg" // Adjust the path to your Bitcoin logo image
                alt="Bitcoin Logo"
                className="w-6 h-6 mr-2" 
              />
              <span className="text-xl text-purple-200/80 font-semibold">{priceData.source}</span>
              <span className="text-xl text-purple-300/50">
                {parseFloat(priceData.price).toFixed(4)} BTC
              </span>
            </div>
          ))
        )}
      </div>
      {loading && (
        <div className="inset-0 absolute bg-gradient-to-r from-transparent via-red-900/50 to-transparent skelton-animation" />
      )}
    </div>
  );
};

export default ResultRow;
