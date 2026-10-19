import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Common/Header';
import Grid from '../components/Dashboard/Grid';
import { get100Coins } from '../functions/get100Coins';
import {
  getWatchlistCoins,
  refreshWatchlistCoins,
  WATCHLIST_EVENT,
} from '../functions/watchlist';
import './Watchlist.css';

function WatchlistPage() {
  const [coins, setCoins] = useState(getWatchlistCoins);

  useEffect(() => {
    let active = true;
    const updateFromStorage = () => setCoins(getWatchlistCoins());

    const refreshMarketData = async () => {
      const marketCoins = await get100Coins();
      if (!active) return;
      setCoins(refreshWatchlistCoins(marketCoins));
    };

    window.addEventListener(WATCHLIST_EVENT, updateFromStorage);
    window.addEventListener('storage', updateFromStorage);
    refreshMarketData();

    return () => {
      active = false;
      window.removeEventListener(WATCHLIST_EVENT, updateFromStorage);
      window.removeEventListener('storage', updateFromStorage);
    };
  }, []);

  return (
    <>
      <Header />
      <main className="watchlist-page">
        <h1>Watchlist</h1>
        {coins.length > 0 ? (
          <div className="watchlist-grid">
            {coins.map((coin) => <Grid coin={coin} key={coin.id} />)}
          </div>
        ) : (
          <section className="watchlist-empty">
            <p>Your watchlist is empty.</p>
            <Link to="/dashboard" className="watchlist-dashboard-link">Explore coins</Link>
          </section>
        )}
      </main>
    </>
  );
}

export default WatchlistPage;
