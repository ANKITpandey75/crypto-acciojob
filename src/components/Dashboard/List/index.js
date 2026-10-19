import React from 'react';
import './styles.css';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import { Tooltip } from '@mui/material';
import { convertNumber } from '../../../functions/convertNumbers';
import { Link } from 'react-router-dom';

function List({ coin }) {
  const toFiniteNumber = (value) => value != null && value !== '' && Number.isFinite(Number(value))
    ? Number(value)
    : null;
  const change = toFiniteNumber(coin.price_change_percentage_24h);
  const currentPrice = toFiniteNumber(coin.current_price);
  const volume = toFiniteNumber(coin.total_volume);
  const marketCap = toFiniteNumber(coin.market_cap);
  const hasChange = change !== null;

  return (
    <Link to={`/coin/${coin.id}`} className="list-row">
      <Tooltip title="Coin Logo">
        <div className="list-cell td-image">
          <img src={coin.image} alt={coin.name || 'Cryptocurrency'} className="coin-logo" />
        </div>
      </Tooltip>
      <Tooltip title="Coin Info" placement="bottom-start">
        <div className="list-cell">
          <div className="name-col">
            <p className="coin-symbol">{coin.symbol}</p>
            <p className="coin-name">{coin.name}</p>
          </div>
        </div>
      </Tooltip>
      <Tooltip title="Price Change In 24Hrs">
        <div className="list-cell chip-flex">
          <div className={`price-chip ${hasChange && change > 0 ? '' : 'chip-red'}`}>
            {hasChange ? `${change.toFixed(2)}%` : '—'}
          </div>
          <div className={`icon-chip td-icon ${hasChange && change > 0 ? '' : 'chip-red'}`}>
            {hasChange && change > 0 ? <TrendingUpRoundedIcon /> : <TrendingDownRoundedIcon />}
          </div>
        </div>
      </Tooltip>
      <Tooltip title="Current Price">
        <div className="list-cell">
          <h3
            className="coin-price td-centre-align"
            style={{ color: hasChange && change < 0 ? 'var(--red)' : 'var(--green)' }}
          >
            {currentPrice !== null ? `$${currentPrice.toLocaleString()}` : '—'}
          </h3>
        </div>
      </Tooltip>
      <Tooltip title="Total Volume" placement="bottom-end">
        <div className="list-cell">
          <p className="total_volume td-right-align td-total-volume">
            {volume !== null ? volume.toLocaleString() : '—'}
          </p>
        </div>
      </Tooltip>
      <Tooltip title="Market Cap">
        <div className="list-cell desktop-td-mkt">
          <p className="total_volume td-right-align">
            {marketCap !== null ? `$${marketCap.toLocaleString()}` : '—'}
          </p>
        </div>
      </Tooltip>
      <Tooltip title="Market Cap">
        <div className="list-cell mobile-td-mkt">
          <p className="total_volume td-right-align">
            {marketCap !== null ? `$${convertNumber(marketCap)}` : '—'}
          </p>
        </div>
      </Tooltip>
    </Link>
  );
}

export default List;
