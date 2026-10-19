import axios from "axios";
import { getCachedApiData } from "./apiCache";
import { get100Coins } from "./get100Coins";

export const getCoinData = async (id) => {
  try {
    return await getCachedApiData(
      `coin:${id}`,
      async () => {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`, {
          timeout: 15000,
          params: { localization: false, tickers: false, market_data: true, community_data: false, developer_data: false, sparkline: false },
        });
        return response.data;
      },
      5 * 60_000,
      (data) => Boolean(data && typeof data === 'object' && data.id)
    );
  } catch (error) {
    // CoinGecko may rate-limit the detailed endpoint. Use the market list as a
    // lightweight fallback so a coin page can still show its market summary.
    const marketCoins = await get100Coins();
    return marketCoins.find((coin) => coin.id === id);
  }
};
