import axios from "axios";
import { getCachedApiData } from "./apiCache";

export const getCoinData = async (id) => {
  try {
    return await getCachedApiData(
      `coin:${id}`,
      async () => {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`, { timeout: 15000 });
        return response.data;
      },
      5 * 60_000,
      (data) => Boolean(data && typeof data === 'object' && data.id)
    );
  } catch (error) {
    return undefined;
  }
};
