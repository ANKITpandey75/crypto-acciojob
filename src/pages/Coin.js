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
        const prices = await getCoinPrices(id, days, priceType);
        if (Array.isArray(prices) && prices.length > 0) settingChartData(setChartData, prices);
      } catch {
        setLoadError("Coin details are temporarily unavailable. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, [id, days, priceType]);

    useEffect(() => {
      getData();
    }, [getData]);
    const handleDaysChange = async (event) => {
      setIsLoading(true);
      setDays(event.target.value);
      const prices = await getCoinPrices(id, event.target.value, priceType);
        if (prices.length > 0) {
          settingChartData(setChartData, prices);
          setIsLoading(false);
        }
    };

    const handlePriceTypeChange = async (event, newType) => {
      if (!newType) return;
      setPriceType(newType);
      const prices = await getCoinPrices(id, days, newType);
        if (prices.length > 0) {
          settingChartData(setChartData, prices);
          setIsLoading(false);
        }
    };
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
      {chartData.datasets.length > 0 ? (
        <LineChart chartData={chartData} priceType={priceType} />
      ) : (
        <p style={{ color: "var(--white)", textAlign: "center", padding: "1rem" }}>
          Chart data is temporarily unavailable.
        </p>
      )}
     </div>
     <CoinInfo heading={coinData.name} desc={coinData.desc} />
     </>
     )}
  </div>
  );
  
}

export default CoinPage;
