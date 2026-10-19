import React, { useCallback, useEffect, useState } from 'react';
import Header from '../components/Common/Header';
import SelectCoins from '../components/Compare/SelectCoins';
import Grid from '../components/Dashboard/Grid';
import SelectDays from '../components/Coin/SelectDays';
import CoinInfo from '../components/Coin/CoinInfo';
import LineChart from '../components/Coin/LineChart';
import TogglePriceType from '../components/Coin/PriceType';
import Loader from '../components/Common/Loader';
import { coinObject } from '../functions/convertObject';
import { settingChartData } from '../functions/settingChartData';
import { getCoinPrices } from '../functions/getCoinPrices';
import { getCoinData } from '../functions/getCoinData';

function ComparePage() {
  const [crypto1, setCrypto1] = useState('bitcoin');
  const [crypto2, setCrypto2] = useState('ethereum');
  const [crypto1Data, setCrypto1Data] = useState({});
  const [crypto2Data, setCrypto2Data] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [priceType, setPriceType] = useState('prices');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [days, setDays] = useState(30);

  const loadChart = useCallback(async (firstCoin, secondCoin, range, type) => {
    const [prices1, prices2] = await Promise.all([
      getCoinPrices(firstCoin, range, type),
      getCoinPrices(secondCoin, range, type),
    ]);
    settingChartData(setChartData, prices1, prices2);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [data1, data2] = await Promise.all([
          getCoinData(crypto1),
          getCoinData(crypto2),
        ]);
        if (cancelled) return;
        if (data1) coinObject(setCrypto1Data, data1);
        if (data2) coinObject(setCrypto2Data, data2);
        await loadChart(crypto1, crypto2, days, priceType);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    loadInitialData();
    return () => { cancelled = true; };
  }, [crypto1, crypto2, days, priceType, loadChart]);

  const handleDaysChange = async (event) => {
    const range = event.target.value;
    setDays(range);
    setIsLoading(true);
    try {
      await loadChart(crypto1, crypto2, range, priceType);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceTypeChange = async (event, newType) => {
    if (!newType) return;
    setPriceType(newType);
    setIsLoading(true);
    try {
      await loadChart(crypto1, crypto2, days, newType);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChartRetry = async () => {
    setIsLoading(true);
    try {
      await loadChart(crypto1, crypto2, days, priceType);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoinChange = async (event, isCoin2) => {
    const selectedCoin = event.target.value;
    const firstCoin = isCoin2 ? crypto1 : selectedCoin;
    const secondCoin = isCoin2 ? selectedCoin : crypto2;
    setIsLoading(true);
    if (isCoin2) setCrypto2(selectedCoin);
    else setCrypto1(selectedCoin);
    try {
      const [coinData] = await Promise.all([
        getCoinData(selectedCoin),
        loadChart(firstCoin, secondCoin, days, priceType),
      ]);
      if (coinData) {
        coinObject(isCoin2 ? setCrypto2Data : setCrypto1Data, coinData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="coins-days-flex">
            <SelectCoins
              crypto1={crypto1}
              handleCoinChange={handleCoinChange}
              crypto2={crypto2}
            />
            <SelectDays days={days} handleDaysChange={handleDaysChange} noPTag />
          </div>
          <div className="grey-wrapper" style={{ padding: '0rem 1rem' }}>
            {crypto1Data.id ? <Grid coin={crypto1Data} /> : <p>Coin data is unavailable. Check your connection and try again.</p>}
          </div>
          <div className="grey-wrapper" style={{ padding: '0rem 1rem' }}>
            {crypto2Data.id ? <Grid coin={crypto2Data} /> : <p>Coin data is unavailable. Check your connection and try again.</p>}
          </div>
          <div className="grey-wrapper">
            <TogglePriceType
              priceType={priceType}
              handlePriceTypeChange={handlePriceTypeChange}
            />
            {chartData.datasets.length > 0 ? (
              <LineChart chartData={chartData} priceType={priceType} multiAxis />
            ) : (
              <>
              <p style={{ color: 'var(--white)', textAlign: 'center', padding: '1rem' }}>
                Chart data is temporarily unavailable. Try again in a moment.
              </p>
              <div style={{ textAlign: 'center', paddingBottom: '1rem' }}>
                <button type="button" onClick={handleChartRetry}>Retry chart</button>
              </div>
              </>
            )}
          </div>
          <CoinInfo heading={crypto1Data.name} desc={crypto1Data.desc} />
          <CoinInfo heading={crypto2Data.name} desc={crypto2Data.desc} />
        </>
      )}
    </div>
  );
}

export default ComparePage;
