import { useState, useEffect } from 'react';
import './index.css';
import AmountInput from './AmountInput';
import ResultRow from './ResultRow'; // For BTC
import ResultRowETH from './ResultRowETH'; // For ETH

interface PriceData {
  sortedPrices: Array<{ price: number; source: string }>;
}

function App() {
  const [amount, setAmount] = useState<string>('100');
  const [btcPrice, setBtcPrice] = useState<Array<{ price: number; source: string }>>([]);
  const [ethPrice, setEthPrice] = useState<Array<{ price: number; source: string }>>([]);
  
  const [btcLoading, setBtcLoading] = useState<boolean>(true);
  const [ethLoading, setEthLoading] = useState<boolean>(true);
  const [btcError, setBtcError] = useState<string | null>(null);
  const [ethError, setEthError] = useState<string | null>(null);
  const [btcAmount, setBtcAmount] = useState<number | null>(null); // To store calculated BTC amount
  const [ethAmount, setEthAmount] = useState<number | null>(null); // To store calculated ETH amount

  useEffect(() => {
    const fetchBtcPrice = async () => {
      setBtcLoading(true);
      setBtcError(null);
      try {
        const response = await fetch('http://localhost:3000/bitcoin-prices');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: PriceData = await response.json();
        const sortedPrices = data.sortedPrices.sort((a, b) => a.price - b.price);
        setBtcPrice(sortedPrices);
      } catch (error: any) {
        console.error('Error fetching BTC price:', error);
        setBtcError('Failed to fetch Bitcoin prices.');
      } finally {
        setBtcLoading(false);
      }
    };

    fetchBtcPrice();
  }, []);

  useEffect(() => {
    const fetchEthPrice = async () => {
      setEthLoading(true);
      setEthError(null);
      try {
        const response = await fetch('http://localhost:3000/ethereum-prices');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: PriceData = await response.json();
        const sortedPrices = data.sortedPrices.sort((a, b) => a.price - b.price);
        setEthPrice(sortedPrices);
      } catch (error: any) {
        console.error('Error fetching ETH price:', error);
        setEthError('Failed to fetch Ethereum prices.');
      } finally {
        setEthLoading(false);
      }
    };

    fetchEthPrice();
  }, []);

  // Calculate the amount of BTC that can be bought with the given USD amount
  const calculateBtcAmount = (usdAmount: string) => {
    const amountInNumber = parseFloat(usdAmount);
    if (isNaN(amountInNumber) || btcPrice.length === 0) {
      setBtcAmount(null);
      return;
    }
    const lowestPrice = btcPrice[0].price; // Get the lowest BTC price
    setBtcAmount(amountInNumber / lowestPrice); // Calculate BTC amount
  };

  // Calculate the amount of ETH that can be bought with the given USD amount
  const calculateEthAmount = (usdAmount: string) => {
    const amountInNumber = parseFloat(usdAmount);
    if (isNaN(amountInNumber) || ethPrice.length === 0) {
      setEthAmount(null);
      return;
    }
    const lowestPrice = ethPrice[0].price; // Get the lowest ETH price
    setEthAmount(amountInNumber / lowestPrice); // Calculate ETH amount
  };

  useEffect(() => {
    calculateBtcAmount(amount); // Recalculate BTC amount when USD amount or BTC prices change
    calculateEthAmount(amount); // Recalculate ETH amount when USD amount or ETH prices change
  }, [amount, btcPrice, ethPrice]);

  return (
    <main className='max-w-2xl mx-auto px-4 py-8'>
      <h1 className='uppercase text-5xl text-center font-bold bg-gradient-to-br from-purple-700 to-sky-400 bg-clip-text text-transparent'>
        Find Cheapest BTC & ETH
      </h1>
      
      <div className='flex justify-center mt-8'>
        <AmountInput 
          value={amount} 
          onChange={e => setAmount(e.target.value)} 
        />
      </div>

      {/* BTC Section */}
      <div className="mt-6">
        <h2 className="text-center text-xl font-semibold">BTC Price</h2>
        {btcLoading && <div className="loading">Loading BTC prices...</div>}
        {btcError && <div className="error">{btcError}</div>}
        <ResultRow loading={btcLoading} btcPrice={btcPrice} />

        {btcAmount !== null && (
          <div className="text-center mt-4">
            <h3 className="font-semibold">
              You can buy {btcAmount.toFixed(6)} BTC with ${amount}.
            </h3>
          </div>
        )}
      </div>

{/* ETH Section */}
<div className="mt-6">
  <h2 className="text-center text-xl font-semibold">
    ETH Price
  </h2>
  {ethLoading && <div className="loading">Loading ETH prices...</div>}
  {ethError && <div className="error">{ethError}</div>}
  <ResultRowETH loading={ethLoading} ethPrice={ethPrice} />

  {ethAmount !== null && (
    <div className="text-center mt-4">
      <h3 className="font-semibold">
        You can buy {ethAmount.toFixed(6)} ETH with ${amount}.
      </h3>
    </div>
  )}
</div>



    </main>
  );
}

export default App;
