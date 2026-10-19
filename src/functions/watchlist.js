const STORAGE_KEY = 'crypto-tracker-watchlist';
export const WATCHLIST_EVENT = 'crypto-tracker-watchlist-updated';

export const getWatchlistCoins = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((coin) => coin && coin.id) : [];
  } catch (error) {
    return [];
  }
};

export const isCoinWatchlisted = (id) =>
  getWatchlistCoins().some((coin) => coin.id === id);

const saveWatchlistCoins = (coins) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(coins));
    window.dispatchEvent(new Event(WATCHLIST_EVENT));
  } catch (error) {
    // Keep the app usable if browser storage is unavailable.
  }
};

export const toggleWatchlistCoin = (coin) => {
  const coins = getWatchlistCoins();
  const alreadySaved = coins.some((savedCoin) => savedCoin.id === coin.id);
  const nextCoins = alreadySaved
    ? coins.filter((savedCoin) => savedCoin.id !== coin.id)
    : [...coins, coin];
  saveWatchlistCoins(nextCoins);
  return !alreadySaved;
};

export const refreshWatchlistCoins = (marketCoins) => {
  if (!Array.isArray(marketCoins) || marketCoins.length === 0) return getWatchlistCoins();
  const savedCoins = getWatchlistCoins();
  const marketById = new Map(marketCoins.map((coin) => [coin.id, coin]));
  const updatedCoins = savedCoins.map((coin) => marketById.get(coin.id) || coin);
  saveWatchlistCoins(updatedCoins);
  return updatedCoins;
};
