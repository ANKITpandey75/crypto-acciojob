import { convertDate } from "./convertDate";

export const settingChartData = (setChartData, prices1, prices2) =>{
  const firstPrices = Array.isArray(prices1)
    ? prices1.filter((price) => Array.isArray(price) && price.length > 1 && Number.isFinite(Number(price[0])) && Number.isFinite(Number(price[1])))
    : [];
  const secondPrices = Array.isArray(prices2)
    ? prices2.filter((price) => Array.isArray(price) && price.length > 1 && Number.isFinite(Number(price[0])) && Number.isFinite(Number(price[1])))
    : [];
  if(firstPrices.length === 0) {
    setChartData({ labels: [], datasets: [] });
    return;
  }
  if(secondPrices.length > 0){
    setChartData({
                labels: firstPrices.map((price) => convertDate(price[0])),
                datasets: [
                  {
                    label: "crypto1",
                    data: firstPrices.map((price) => price[1]),
                    borderColor: "#3a80e9",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.25,
                    pointRadius: 0,
                    yAxisID: 'crypto1',
                  },
                  {
                    label: "crypto2",
                    data: secondPrices.map((price) => price[1]),
                    borderColor: "#3a80e9",
                    borderWidth: 2,
                    fill: false,
                    tension: 0.25,
                    borderColor: "#61c96f",
                    pointRadius: 0,
                    yAxisID: 'crypto2',
                  },
                ],
              });
  }
  else{
    setChartData({
                labels: firstPrices.map((price) => convertDate(price[0])),
                datasets: [
                  {
                    data: firstPrices.map((price) => price[1]),
                    borderColor: "#3a80e9",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.25,
                    backgroundColor: "rgba(58, 128, 233, 0.1)",
                    pointRadius: 0,
                    yAxisID: 'crypto1',
                  },
                ],
              });
  }
    
};
