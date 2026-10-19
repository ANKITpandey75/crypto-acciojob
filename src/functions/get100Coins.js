import axios from "axios";
import { getCachedApiData } from "./apiCache";

export const get100Coins = async () => {
  try {
    const coins = await getCachedApiData(
      "market-list",
      async () => {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );
        return response.data;
      },
      60_000,
      (data) => Array.isArray(data) && data.length > 0
    );
    return Array.isArray(coins) ? coins : [];
  } catch (error) {
    console.error("Unable to load coin list:", error);
    return [];
  }
};
