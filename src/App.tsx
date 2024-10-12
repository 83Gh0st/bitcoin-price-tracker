import { useState } from 'react';
import './index.css';
import Input from './Input';
import AmountInput from './AmountInput';
import ResultRow from './ResultRow'; // Fixed import statement

function App() {
  const [amount, setAmount] = useState('100');

  return (
    <main className='max-w-2xl mx-auto px-4 py-8'>
      <h1 className='uppercase text-6xl text-center font-bold bg-gradient-to-br from-purple-700 to-sky-400 bg-clip-text text-transparent'>
        Find cheapest BTC
      </h1>
      
      <div className='flex justify-center mt-8'>
        <AmountInput 
          value={amount} 
          onChange={e => setAmount(e.target.value)} 
        />
      </div>

      <div className="mt-6">
       
        <ResultRow loading={true} />
      </div>
    </main>
  );
}

export default App;
