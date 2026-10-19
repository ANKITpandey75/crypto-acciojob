import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from "./pages/Home";
import DashboardPage from './pages/Dashboard';
import CoinPage from './pages/Coin';
import ComparePage from './pages/ComparePage';
import WatchlistPage from './pages/Watchlist';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<HomePage />}  />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/watchlist" element={<WatchlistPage />} />
      
      <Route path="/coin/:id" element={<CoinPage />} />
      <Route path="/compare" element={<ComparePage />} />

      </Routes>
      </BrowserRouter>
      
     
    </div>
  );
}

export default App;
