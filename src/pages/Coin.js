import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Common/Header';
import Loader from '../components/Common/Loader';
import { coinObject } from '../functions/convertObject';
import List from '../components/Dashboard/List';
import CoinInfo from '../components/Coin/CoinInfo';
import { getCoinData } from '../functions/getCoinData';
import { getCoinPrices } from '../functions/getCoinPrices';
import LineChart from '../components/Coin/LineChart';
import SelectDays from '../components/Coin/SelectDays';
import { settingChartData } from '../functions/settingChartData';
import TogglePriceType from '../components/Coin/PriceType';

  function CoinPage() {
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [coinData, setCoinData] = useState();
    const [days, setDays] = useState(60);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [priceType, setPriceType] = useState("prices");
    const [loadError, setLoadError] = useState("");
    const [chartRetry, setChartRetry] = useState(0);
    const [isChartLoading, setIsChartLoading] = useState(true);

    const getData = useCallback(async () => {
      if (!id) return;
      setIsLoading(true);
      setLoadError("");
      try {
        const data = await getCoinData(id);
        if (!data) {
          setLoadError("Coin details are temporarily unavailable. Please try again.");
          return;
        }
        coinObject(setCoinData, data);
      } catch {
        setLoadError("Coin details are temporarily unavailable. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, [id]);

    useEffect(() => {
      getData();
    }, [getData]);
    const handleDaysChange = (event) => {
      setDays(event.target.value);
    };

    const handlePriceTypeChange = (event, newType) => {
      if (!newType) return;
      setPriceType(newType);
    };

    useEffect(() => {
      let active = true;
      setChartData({ labels: [], datasets: [] });
      setIsChartLoading(true);
      getCoinPrices(id, days, priceType)
        .then((prices) => {
          if (active && prices.length > 0) settingChartData(setChartData, prices);
        })
        .finally(() => {
          if (active) setIsChartLoading(false);
        });
      return () => { active = false; };
    }, [id, days, priceType, chartRetry]);
  return (
  <div>
    <Header/>
    {isLoading ? (
    <Loader/>
    ) : loadError || !coinData ? (
    <div role="alert" style={{ color: "var(--white)", textAlign: "center", padding: "2rem" }}>
      <p>{loadError || "Coin details are unavailable."}</p>
      <button type="button" onClick={getData}>Try again</button>
    </div>
    ) : (
     <>
     <div className='grey-wrapper'  style={{ padding: "0rem 1rem"}}>
        <List coin={coinData} />
     </div>
     <div className='grey-wrapper' >
      <SelectDays days={days} handleDaysChange={handleDaysChange} />
      <TogglePriceType 
      priceType={priceType} 
      handlePriceTypeChange={handlePriceTypeChange} 
      />
      {isChartLoading ? (
        <p style={{ color: "var(--white)", textAlign: "center", padding: "1rem" }}>
          Loading chart data…
        </p>
      ) : chartData.datasets.length > 0 ? (
        <LineChart chartData={chartData} priceType={priceType} />
      ) : (
        <div style={{ color: "var(--white)", textAlign: "center", padding: "1rem" }}>
          <p>Chart data is temporarily unavailable.</p>
          <button type="button" onClick={() => setChartRetry((attempt) => attempt + 1)}>
            Retry chart
          </button>
        </div>
      )}
     </div>
     <CoinInfo heading={coinData.name} desc={coinData.desc} />
     </>
     )}
  </div>
  );
  
}

export default CoinPage;
