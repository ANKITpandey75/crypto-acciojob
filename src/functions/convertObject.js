export const coinObject = (setState, data) => {
    if (!data || typeof data !== 'object' || !data.id) {
        setState(null);
        return;
    }

    const marketData = data?.market_data || data || {};
    const getUsdValue = (value) => (
        value && typeof value === 'object' ? value.usd : value
    );

    setState ({
        id: data.id,
        name: data.name || data.symbol?.toUpperCase() || data.id,
        symbol: data.symbol || '',
        image: typeof data.image === 'string' ? data.image : data.image?.large || data.image?.small || '',
        desc: data.description?.en || data.desc || '',
        price_change_percentage_24h: marketData.price_change_percentage_24h ?? data.price_change_percentage_24h,
        total_volume: getUsdValue(marketData.total_volume),
        current_price: getUsdValue(marketData.current_price),
        market_cap: getUsdValue(marketData.market_cap),
        
    });
};
