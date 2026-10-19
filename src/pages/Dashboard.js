import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header";
import TabsComponent from "../components/Dashboard/Tabs";
import Search from "../components/Dashboard/Search";
import PaginationComponent from "../components/Dashboard/Pagination";
import Loader from "../components/Common/Loader";
import BackToTop from "../components/Common/BackToTop";
import { get100Coins } from "../functions/get100Coins";

function DashboardPage() {
  const [coins, setCoins] = useState([]);
  const [paginatedCoins, setPaginatedCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const handlePageChange = (event, value) => {
    setPage(value);

    const previousIndex = (value - 1) * 10;
    setPaginatedCoins(coins.slice(previousIndex, previousIndex + 10));
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const searchTerm = search.trim().toLowerCase();

  const filteredCoins = coins.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm) ||
      item.symbol?.toLowerCase().includes(searchTerm)
  );

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const myCoins = await get100Coins();
      const availableCoins = Array.isArray(myCoins) ? myCoins : [];
      setCoins(availableCoins);
      setPaginatedCoins(availableCoins.slice(0, 10));
      setPage(1);
      if (availableCoins.length === 0) {
        setLoadError("No coin data was returned. Check your connection or try again shortly.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
<>
<Header />
<BackToTop /> 
{isLoading ? (
<Loader /> 
) : loadError ? (
  <div role="alert" style={{ color: "var(--white)", textAlign: "center", padding: "2rem" }}>
    <p>{loadError}</p>
    <button type="button" onClick={getData}>Try again</button>
  </div>
) : ( <div>
    
    <Search search={search} onSearchChange={onSearchChange} />
    <TabsComponent
      coins={searchTerm ? filteredCoins : paginatedCoins}
    />
    {!searchTerm && coins.length > 10 && (
      <PaginationComponent
        page={page}
        handlePageChange={handlePageChange}
      />
    )}

  </div> 
  )}
  </>
  );
}

export default DashboardPage;
