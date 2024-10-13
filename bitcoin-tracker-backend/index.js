const express = require('express');
const axios = require('axios');
const https = require('https');
const NodeCache = require('node-cache');
const cors = require('cors');

const app = express();
const port = 3000;
// Use CORS middleware
app.use(cors());

// Create a cache instance with a default TTL of 10 minutes
const cache = new NodeCache({ stdTTL: 600 });

const httpsAgent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false,
  secureProtocol: 'TLSv1_2_method',
});

// Fetch price function that checks different API sources
async function fetchPrice(apiUrl, sourceName, currency) {
  // Check if price is cached
  const cachedPrice = cache.get(sourceName + currency);
  if (cachedPrice) {
    return { source: sourceName, price: cachedPrice };
  }

  try {
    const response = await axios.get(apiUrl, { httpsAgent });
    let price;

    // Map the responses to extract prices
    switch (sourceName) {
      case 'CoinGecko':
        price = response.data[currency]?.usd;
        break;
      case 'CoinMarketCap':
        price = response.data.data?.find(item => item.symbol === currency)?.quote?.USD?.price;
        break;
      case 'Binance':
        price = response.data?.price;
        break;
      case 'Kraken':
        price = response.data.result[currency + 'USD']?.c[0];
        break;
      case 'Bitfinex':
        price = response.data.find(item => item[0] === 't' + currency + 'USD')?.last_price;
        break;
      case 'Coinbase':
        price = response.data?.data?.amount;
        break;
      case 'Blockchain.com':
        price = response.data?.last;
        break;
      case 'CoinPaprika':
        price = response.data.quotes?.USD?.price;
        break;
      case 'CoinCap':
        price = response.data.data?.find(item => item.id === currency)?.priceUsd;
        break;
      case 'Coinlore':
        price = response.data.find(item => item.id === currency)?.price;
        break;
      case 'Gemini':
        price = response.data?.price;
        break;
      case 'Huobi':
        price = response.data.tick?.close;
        break;
      case 'OKX':
        price = response.data.data?.find(item => item.instId === currency + '-USD')?.last;
        break;
      case 'Bittrex':
        price = response.data.result?.find(item => item.Symbol === currency + '-USDT')?.Last;
        break;
      case 'Phemex':
        price = response.data.data?.find(item => item.symbol === currency + 'USDT')?.last;
        break;
      case 'CryptoCompare':
        price = response.data.DISPLAY?.[currency]?.USD?.PRICE;
        break;
      case 'Nomics':
        price = response.data.data?.find(item => item.id === currency)?.price;
        break;
      case 'Messari':
        price = response.data.data?.market_data?.price_usd;
        break;
      case 'CoinRanking':
        price = response.data.data?.coins?.find(item => item.id === currency)?.price;
        break;
      case 'Investing.com':
        price = response.data?.find(item => item.symbol === currency)?.last_price;
        break;
      default:
        price = null;
    }

    // Store the price in the cache if valid
    if (price !== undefined) {
      cache.set(sourceName + currency, parseFloat(price));
    }

    return { source: sourceName, price: price !== undefined ? parseFloat(price) : null };
  } catch (error) {
    console.error(`${sourceName} API error:`, error.message);
    return { source: sourceName, price: null };
  }
}


// Route to get Bitcoin prices
app.get('/bitcoin-prices', async (req, res) => {
  const prices = await Promise.all([
    fetchPrice('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', 'CoinGecko', 'bitcoin'),
    fetchPrice('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=YOUR_API_KEY', 'CoinMarketCap', 'BTC'),
    fetchPrice('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', 'Binance', 'BTC'),
    fetchPrice('https://api.kraken.com/0/public/Ticker?pair=XBTUSD', 'Kraken', 'XBT'),
    fetchPrice('https://api.bitfinex.com/v2/tickers?symbols=tBTCUSD', 'Bitfinex', 'BTC'),
    fetchPrice('https://api.coinbase.com/v2/prices/spot?currency=USD', 'Coinbase', 'BTC'),
    fetchPrice('https://api.blockchain.com/v3/exchange/tickers/BTC-USD', 'Blockchain.com', 'BTC'),
    fetchPrice('https://api.coinpaprika.com/v1/tickers/btc-bitcoin', 'CoinPaprika', 'btc'),
    fetchPrice('https://api.coincap.io/v2/assets/bitcoin', 'CoinCap', 'bitcoin'),
    fetchPrice('https://api.coinlore.net/api/ticker/?id=90', 'CoinLore', '90'), // Bitcoin ID
    fetchPrice('https://api.gemini.com/v1/pubticker/btcusd', 'Gemini', 'BTC'),
    fetchPrice('https://api.huobi.pro/market/detail/merged?symbol=btcusdt', 'Huobi', 'BTC'),
    fetchPrice('https://www.okx.com/api/v5/market/tickers?instId=BTC-USD', 'OKX', 'BTC'),
    fetchPrice('https://api.bittrex.com/v3/markets/BTC-USDT/ticker', 'Bittrex', 'BTC'),
    fetchPrice('https://api.phemex.com/v2/exchange/tickers', 'Phemex', 'BTC'),
    fetchPrice('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD', 'CryptoCompare', 'BTC'),
    fetchPrice('https://api.nomics.com/v1/currencies/ticker?key=YOUR_API_KEY&ids=BTC', 'Nomics', 'BTC'),
    fetchPrice('https://data.messari.io/api/v1/assets/bitcoin', 'Messari', 'BTC'),
    fetchPrice('https://api.coinranking.com/v1/public/coins', 'CoinRanking', 'bitcoin'),
    fetchPrice('https://api.investing.com/api/cryptocurrencies/BTC', 'Investing.com', 'BTC'),
  ]);

  const validPrices = prices.filter(p => p.price !== null);
  const sortedPrices = validPrices.sort((a, b) => a.price - b.price).map(p => ({
    source: p.source,
    price: p.price ? p.price.toFixed(4) : 'N/A'
  }));

  res.json({ sortedPrices });
});

// Route to get Ethereum prices
app.get('/ethereum-prices', async (req, res) => {
  const prices = await Promise.all([
    fetchPrice('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd', 'CoinGecko', 'ethereum'),
    fetchPrice('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=YOUR_API_KEY', 'CoinMarketCap', 'ETH'),
    fetchPrice('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT', 'Binance', 'ETH'),
    fetchPrice('https://api.kraken.com/0/public/Ticker?pair=ETHUSD', 'Kraken', 'ETH'),
    fetchPrice('https://api.bitfinex.com/v2/tickers?symbols=tETHUSD', 'Bitfinex', 'ETH'),
    fetchPrice('https://api.coinbase.com/v2/prices/spot?currency=ETHUSD', 'Coinbase', 'ETH'),
    fetchPrice('https://api.blockchain.com/v3/exchange/tickers/ETH-USD', 'Blockchain.com', 'ETH'),
    fetchPrice('https://api.coinpaprika.com/v1/tickers/eth-ethereum', 'CoinPaprika', 'eth'),
    fetchPrice('https://api.coincap.io/v2/assets/ethereum', 'CoinCap', 'ethereum'),
    fetchPrice('https://api.coinlore.net/api/ticker/?id=80', 'CoinLore', '80'), // Ethereum ID
    fetchPrice('https://api.gemini.com/v1/pubticker/ethusd', 'Gemini', 'ETH'),
    fetchPrice('https://api.huobi.pro/market/detail/merged?symbol=ethusdt', 'Huobi', 'ETH'),
    fetchPrice('https://www.okx.com/api/v5/market/tickers?instId=ETH-USD', 'OKX', 'ETH'),
    fetchPrice('https://api.bittrex.com/v3/markets/ETH-USDT/ticker', 'Bittrex', 'ETH'),
    fetchPrice('https://api.phemex.com/v2/exchange/tickers', 'Phemex', 'ETH'),
    fetchPrice('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD', 'CryptoCompare', 'ETH'),
    fetchPrice('https://api.nomics.com/v1/currencies/ticker?key=YOUR_API_KEY&ids=ETH', 'Nomics', 'ETH'),
    fetchPrice('https://api.nomics.com/v1/currencies/ticker?key=YOUR_API_KEY&ids=ETH', 'Nomics', 'ETH'),
    fetchPrice('https://data.messari.io/api/v1/assets/ethereum', 'Messari', 'ETH'),
    fetchPrice('https://api.coinranking.com/v1/public/coins', 'CoinRanking', 'ethereum'),
    fetchPrice('https://api.investing.com/api/cryptocurrencies/ETH', 'Investing.com', 'ETH'),
  ]);

  const validPrices = prices.filter(p => p.price !== null);
  const sortedPrices = validPrices.sort((a, b) => a.price - b.price).map(p => ({
    source: p.source,
    price: p.price ? p.price.toFixed(4) : 'N/A'
  }));

  res.json({ sortedPrices });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
