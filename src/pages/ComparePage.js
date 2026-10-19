import React, { useCallback, useEffect, useState } from 'react';
import Header from '../components/Common/Header';
import SelectCoins from '../components/Compare/SelectCoins';
import Grid from '../components/Dashboard/Grid';
import SelectDays from '../components/Coin/SelectDays';
import CoinInfo from '../components/Coin/CoinInfo';
import LineChart from '../components/Coin/LineChart';
import TogglePriceType from '../components/Coin/PriceType';
import { coinObject } from '../functions/convertObject';
import { settingChartData } from '../functions/settingChartData';
import { getCoinPrices } from '../functions/getCoinPrices';
import { getCoinData } from '../functions/getCoinData';
import { get100Coins } from '../functions/get100Coins';

const availableRanges = [7, 30, 60, 90, 120, 365];
const formatCoinId = (id) => id
  .split('-')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ');

const coinFromMarketList = (coin) => coin ? ({
  id: coin.id,
  name: coin.name,
  symbol: coin.symbol,
  image: coin.image,
  desc: '',
  price_change_percentage_24h: coin.price_change_percentage_24h,
  total_volume: coin.total_volume,
  current_price: coin.current_price,
  market_cap: coin.market_cap,
}) : null;

function ComparePage() {
  const [crypto1, setCrypto1] = useState('bitcoin');
  const [crypto2, setCrypto2] = useState('ethereum');
  const [crypto1Data, setCrypto1Data] = useState({});
  const [crypto2Data, setCrypto2Data] = useState({});
  const [isCoinsLoading, setIsCoinsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [priceType, setPriceType] = useState('prices');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [days, setDays] = useState(() => {
    try {
      const savedRange = Number(window.localStorage.getItem('crypto-compare-days'));
      return availableRanges.includes(savedRange) ? savedRange : 30;
    } catch {
      return 30;
    }
  });
  const [chartRetry, setChartRetry] = useState(0);
  const [coinRetry, setCoinRetry] = useState(0);

  const loadChart = useCallback(async (firstCoin, secondCoin, range, type, firstName, secondName, isCurrent) => {
    const prices1 = await getCoinPrices(firstCoin, range, type);
    const prices2 = await getCoinPrices(secondCoin, range, type);
    if (isCurrent()) settingChartData(setChartData, prices1, prices2, firstName, secondName);
  }, []);

  useEffect(() => {
    let active = true;
    setIsCoinsLoading(true);
    setCrypto1Data({});
    setCrypto2Data({});
    const loadCoinDetails = async () => {
      const [data1, data2, marketCoins] = await Promise.all([
        getCoinData(crypto1),
        getCoinData(crypto2),
        get100Coins(),
      ]);
      if (!active) return;
      const marketCoin1 = marketCoins.find((coin) => coin.id === crypto1);
      const marketCoin2 = marketCoins.find((coin) => coin.id === crypto2);
      if (data1) coinObject(setCrypto1Data, data1);
      else setCrypto1Data(coinFromMarketList(marketCoin1) || {});
      if (data2) coinObject(setCrypto2Data, data2);
      else setCrypto2Data(coinFromMarketList(marketCoin2) || {});
    };
    loadCoinDetails().finally(() => {
      if (active) setIsCoinsLoading(false);
    });
    return () => { active = false; };
  }, [crypto1, crypto2, coinRetry]);

  useEffect(() => {
    let active = true;
    setIsChartLoading(true);
    setChartData({ labels: [], datasets: [] });
    loadChart(
      crypto1,
      crypto2,
      days,
      priceType,
      crypto1Data.name || formatCoinId(crypto1),
      crypto2Data.name || formatCoinId(crypto2),
      () => active
    )
      .finally(() => {
        if (active) setIsChartLoading(false);
      });
    return () => { active = false; };
  }, [crypto1, crypto2, days, priceType, chartRetry, loadChart, crypto1Data.name, crypto2Data.name]);

  useEffect(() => {
    try {
      window.localStorage.setItem('crypto-compare-days', String(days));
    } catch {
      // The selected range still works for this page if storage is unavailable.
    }
  }, [days]);

  const handleDaysChange = (event) => {
    const range = Number(event.target.value);
    if (Number.isFinite(range)) setDays(range);
  };

  const handlePriceTypeChange = (event, newType) => {
    if (!newType) return;
    setPriceType(newType);
  };

  const handleChartRetry = () => {
    setChartRetry((attempt) => attempt + 1);
  };

  const handleCoinRetry = () => {
    setCoinRetry((attempt) => attempt + 1);
  };

  const handleCoinChange = (event, isCoin2) => {
    const selectedCoin = event.target.value;
    if (isCoin2) setCrypto2(selectedCoin);
    else setCrypto1(selectedCoin);
  };

  return (
    <div>
      <Header />
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
          {crypto1Data.id ? <Grid coin={crypto1Data} /> : isCoinsLoading ? <p>Loading coin data…</p> : <div><p>Coin data is unavailable.</p><button type="button" onClick={handleCoinRetry}>Retry coin data</button></div>}
        </div>
        <div className="grey-wrapper" style={{ padding: '0rem 1rem' }}>
          {crypto2Data.id ? <Grid coin={crypto2Data} /> : isCoinsLoading ? <p>Loading coin data…</p> : <div><p>Coin data is unavailable.</p><button type="button" onClick={handleCoinRetry}>Retry coin data</button></div>}
        </div>
        <div className="grey-wrapper">
            <TogglePriceType
              priceType={priceType}
              handlePriceTypeChange={handlePriceTypeChange}
            />
            {isChartLoading ? (
              <p style={{ color: 'var(--white)', textAlign: 'center', padding: '1rem' }}>
                Loading chart data…
              </p>
            ) : chartData.datasets.length > 0 ? (
              <>
                <LineChart chartData={chartData} priceType={priceType} multiAxis />
                {chartData.datasets.length < 2 && (
                  <div style={{ textAlign: 'center', padding: '0.75rem 1rem 1rem', color: 'var(--white)' }}>
                    One coin’s history could not be loaded. Retry to load both comparison lines.
                    <div style={{ paddingTop: '0.5rem' }}>
                      <button type="button" onClick={handleChartRetry}>Retry chart</button>
                    </div>
                  </div>
                )}
              </>
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
        {crypto1Data.id && <CoinInfo heading={crypto1Data.name} desc={crypto1Data.desc} />}
        {crypto2Data.id && <CoinInfo heading={crypto2Data.name} desc={crypto2Data.desc} />}
      </>
    </div>
  );
}

export default ComparePage;
