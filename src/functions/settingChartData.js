import { convertDate } from "./convertDate";

export const settingChartData = (setChartData, prices1, prices2, coin1Name = 'Coin 1', coin2Name = 'Coin 2') => {
  const cleanPrices = (prices) => (Array.isArray(prices) ? prices : []).filter(
    (point) => Array.isArray(point)
      && point.length > 1
      && Number.isFinite(Number(point[0]))
      && Number.isFinite(Number(point[1]))
  );
  const firstPrices = cleanPrices(prices1);
  const secondPrices = cleanPrices(prices2);

  if (firstPrices.length === 0 && secondPrices.length === 0) {
    setChartData({ labels: [], datasets: [] });
    return;
  }

  const labelsSource = firstPrices.length > 0 ? firstPrices : secondPrices;
  const datasets = [];

  if (firstPrices.length > 0) {
    datasets.push({
      label: coin1Name,
      data: firstPrices.map((point) => Number(point[1])),
      borderColor: '#3a80e9',
      borderWidth: 2,
      fill: false,
      tension: 0.25,
      pointRadius: 0,
      yAxisID: 'crypto1',
    });
  }

  if (secondPrices.length > 0) {
    datasets.push({
      label: coin2Name,
      data: secondPrices.map((point) => Number(point[1])),
      borderColor: '#61c96f',
      borderWidth: 2,
      fill: false,
      tension: 0.25,
      pointRadius: 0,
      yAxisID: 'crypto2',
    });
  }

  setChartData({
    labels: labelsSource.map((point) => convertDate(point[0])),
    datasets,
  });
};
