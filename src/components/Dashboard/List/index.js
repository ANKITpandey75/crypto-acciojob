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
    <Link to={`/coin/${coin.id}`}>
    <tr className="list-row">
      <Tooltip title="Coin Logo">
        <td className="td-image">
          <img src={coin.image} alt="coin.name" className="coin-logo" />
        </td>
      </Tooltip>

      <Tooltip title="Coin Info" placement="bottom-start">
        <td>
          <div className="name-col">
            <p className="coin-symbol">{coin.symbol}</p>
            <p className="coin-name">{coin.name}</p>
          </div>
        </td>
      </Tooltip>

      <Tooltip title="Price Change In 24Hrs">
        {hasChange && change > 0 ? (
          <td className="chip-flex">
            <div className="price-chip">
              {change.toFixed(2)}%
            </div>
            <div className="icon-chip td-icon">
              <TrendingUpRoundedIcon />
            </div>
          </td>
        ) : (
          <td className="chip-flex">
            <td className="price-chip chip-red td-icon">
              {hasChange ? `${change.toFixed(2)}%` : '—'}
            </td>
            <td className="icon-chip chip-red">
              <TrendingDownRoundedIcon />
            </td>
          </td>
        )}
      </Tooltip>

      <Tooltip title="Current Price">
        <td>
          <h3
            className="coin-price td-centre-align"
            style={{
              color:
                hasChange && change < 0
                  ? 'var(--red)'
                  : 'var(--green)',
            }}
          >
            {currentPrice !== null ? `$${currentPrice.toLocaleString()}` : '—'}
          </h3>
        </td>
      </Tooltip>

      <Tooltip title="Total Volume" placement="bottom-end">
        <td>
          <p className="total_volume td-right-align td-total-volume">
            {volume !== null ? volume.toLocaleString() : '—'}
          </p>
        </td>
      </Tooltip>

      <Tooltip title="Market Cap">
        <td className="desktop-td-mkt">
          <p className="total_volume td-right-align" placement="bottom-end">
            {marketCap !== null ? `$${marketCap.toLocaleString()}` : '—'}
          </p>
        </td>
      </Tooltip>

      <Tooltip title="Market Cap">
        <td className="mobile-td-mkt">
          <p className="total_volume td-right-align" placement="bottom-end">
            {marketCap !== null ? `$${convertNumber(marketCap)}` : '—'}
          </p>
        </td>
      </Tooltip>
    </tr>
    </Link>
  );
}

export default List;
