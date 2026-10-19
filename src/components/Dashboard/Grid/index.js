import React from 'react';
import './styles.css';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import { IconButton, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isCoinWatchlisted, toggleWatchlistCoin } from '../../../functions/watchlist';

function Grid({ coin }) {
  const [isSaved, setIsSaved] = useState(() => isCoinWatchlisted(coin.id));
  const toFiniteNumber = (value) => value != null && value !== '' && Number.isFinite(Number(value))
    ? Number(value)
    : null;
  const change = toFiniteNumber(coin.price_change_percentage_24h);
  const currentPrice = toFiniteNumber(coin.current_price);
  const volume = toFiniteNumber(coin.total_volume);
  const marketCap = toFiniteNumber(coin.market_cap);
  const hasChange = change !== null;
  useEffect(() => {
    setIsSaved(isCoinWatchlisted(coin.id));
  }, [coin.id]);

  const handleWatchlistToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsSaved(toggleWatchlistCoin(coin));
  };

  return (
    <div className="grid-card-wrapper">
    <Tooltip title={isSaved ? 'Remove from watchlist' : 'Add to watchlist'}>
      <IconButton
        className="watchlist-toggle"
        aria-label={isSaved ? `Remove ${coin.name} from watchlist` : `Add ${coin.name} to watchlist`}
        onClick={handleWatchlistToggle}
        size="small"
      >
        {isSaved ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
      </IconButton>
    </Tooltip>
    <Link to={`/coin/${coin.id}`}>
    <div
      className={`grid-container ${
        hasChange && change < 0 && 'grid-container-red'
      }`}
    >
      <div className="info-flex">
        <img src={coin.image} alt="coin.name" className="coin-logo" />
        <div className="name-col">
          <p className="coin-symbol">{coin.symbol}</p>
          <p className="coin-name">{coin.name}</p>
        </div>
      </div>

      {hasChange && change > 0 ? (
        <div className="chip-flex">
          <div className="price-chip">
            {change.toFixed(2)}%
          </div>
          <div className="icon-chip">
            <TrendingUpRoundedIcon />
          </div>
        </div>
      ) : (
        <div className="chip-flex">
          <div className="price-chip chip-red">
            {hasChange ? `${change.toFixed(2)}%` : '—'}
          </div>
          <div className="icon-chip chip-red">
            <TrendingDownRoundedIcon />
          </div>
        </div>
      )}

      <div className="info-container">
        <h3
          className="coin-price"
          style={{
            color:
              hasChange && change < 0
                ? 'var(--red)'
                : 'var(--green)',
          }}
        >
          {currentPrice !== null ? `$${currentPrice.toLocaleString()}` : '—'}
        </h3>
        <p className="total_volume">
          Total Volume : {volume !== null ? volume.toLocaleString() : '—'}
        </p>
        <p className="total_volume">
          Market Cap : {marketCap !== null ? `$${marketCap.toLocaleString()}` : '—'}
        </p>
      </div>
    </div>
    </Link>
    </div>
  );
}

export default Grid;
