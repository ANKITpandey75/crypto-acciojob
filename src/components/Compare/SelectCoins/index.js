import React, { useState, useEffect } from "react"
import { get100Coins } from '../../../functions/get100Coins';
import MenuItem from "@mui/material/MenuItem";
import Select from '@mui/material/Select';
import "./styles.css"

function SelectCoins({ crypto1, crypto2, handleCoinChange }) {
    const [allCoins, setAllCoins] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const styles = {
        height: "2.5rem",
            color:"var(--white)",
            "& MuiOutLinedInput-notchedOutline": {
                borderColor: " var(--white)",
            },
            "& .MuiSvgIcon-root": {
                color: "var(--white)",
            },
            "&:hover": {
                "&& fieldset": {
                    borderColor: "#3a80e9",
                },
            },
    };

    useEffect(() => {
      getData()
    }, [])

    async function getData() {
        setIsLoading(true);
        const myCoins = await get100Coins();
        setAllCoins(Array.isArray(myCoins) ? myCoins : []);
        setIsLoading(false);
    }

  return (
    <div className="coins-flex">
        <p>Crypto 1</p>
       <Select
        sx={styles}
          value={crypto1}
          label="Crypto 1"
          onChange={(event) => handleCoinChange(event, false)}
        >
            {allCoins.length === 0 && (
              <MenuItem disabled value={crypto1}>
                {isLoading ? 'Loading coins…' : 'Coin list unavailable; reopen Compare to retry'}
              </MenuItem>
            )}
            {allCoins
            .filter((item)=> item.id !== crypto2)
            .map((coin, i)=> (
            <MenuItem key={i} value={coin.id}>
                {coin.name}
                </MenuItem>
            ))}
        </Select>
        <p>Crypto 2</p>
       <Select
        sx={styles}
          value={crypto2}
          label="Crypto 2"
          onChange={(event) => handleCoinChange(event, true)}
        >
            {allCoins.length === 0 && (
              <MenuItem disabled value={crypto2}>
                {isLoading ? 'Loading coins…' : 'Coin list unavailable; reopen Compare to retry'}
              </MenuItem>
            )}
            {allCoins
            .filter((item)=> item.id !== crypto1)
            .map((coin, i)=> (
            <MenuItem key={i} value={coin.id}>{coin.name}</MenuItem>
            ))}
        </Select>
    </div>
  )
}

export default SelectCoins;
