import axios from "axios";
import { getCachedApiData } from "./apiCache";

export const getCoinPrices = async (id, days, priceType = "prices") => {
  try {
    const values = await getCachedApiData(
      `chart:${id}:${days}:${priceType}`,
      async () => {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
          { timeout: 15000 }
        );
        return response.data?.[priceType];
      },
      60_000,
      (data) => Array.isArray(data) && data.length > 0
    );
    return Array.isArray(values) ? values : [];
  } catch (error) {
    console.error("Unable to load coin chart data:", error);
    return [];
  }
};
