document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "https://egu1j7o6aj.execute-api.us-east-1.amazonaws.com/default/return-futures-data";

    const tickers = [
        { symbol: 'ES', name: 'E-mini S&P 500', category: 'CME Equity Futures', decimals: 2 },
        { symbol: 'NQ', name: 'E-mini NASDAQ 100', category: 'CME Equity Futures', decimals: 2 },
        { symbol: 'RTY', name: 'E-mini Russell 2000', category: 'CME Equity Futures', decimals: 2 },
        { symbol: 'NKD', name: 'Nikkei NKD', category: 'CME Equity Futures', decimals: 2 },
        { symbol: '6A', name: 'Australian $', category: 'CME Foreign Exchange Futures', decimals: 5 },
        { symbol: '6B', name: 'British Pound', category: 'CME Foreign Exchange Futures', decimals: 5 },
        { symbol: '6C', name: 'Canadian $', category: 'CME Foreign Exchange Futures', decimals: 5 },
        { symbol: '6E', name: 'Euro FX', category: 'CME Foreign Exchange Futures', decimals: 5 },
        { symbol: '6J', name: 'Japanese Yen', category: 'CME Foreign Exchange Futures', decimals: 5 },
        { symbol: '6S', name: 'Swiss Franc', category: 'CME Foreign Exchange Futures', decimals: 5 },
        { symbol: 'E7', name: 'E-mini Euro FX', category: 'CME Foreign Exchange Futures', decimals: 5 },
        { symbol: '6M', name: 'Mexican Peso', category: 'CME Foreign Exchange Futures', decimals: 5 },
        { symbol: '6N', name: 'New Zealand $', category: 'CME Foreign Exchange Futures', decimals: 5 },
        { symbol: 'HE', name: 'Lean Hogs', category: 'CME Agricultural Futures', decimals: 2 },
        { symbol: 'LE', name: 'Live Cattle', category: 'CME Agricultural Futures', decimals: 2 },
        { symbol: 'CL', name: 'Crude Oil', category: 'CME NYMEX Futures', decimals: 2 },
        { symbol: 'QM', name: 'E-mini Crude Oil', category: 'CME NYMEX Futures', decimals: 2 },
        { symbol: 'NG', name: 'Natural Gas', category: 'CME NYMEX Futures', decimals: 3 },
        { symbol: 'QG', name: 'E-mini Natural Gas', category: 'CME NYMEX Futures', decimals: 3 },
        { symbol: 'RB', name: 'RBOB Gasoline', category: 'CME NYMEX Futures', decimals: 3 },
        { symbol: 'HO', name: 'Heating Oil', category: 'CME NYMEX Futures', decimals: 3 },
        { symbol: 'PL', name: 'Platinum', category: 'CME NYMEX Futures', decimals: 2 },
        { symbol: 'ZC', name: 'Corn', category: 'CME CBOT Agricultural Futures', decimals: 2 },
        { symbol: 'ZW', name: 'Wheat', category: 'CME CBOT Agricultural Futures', decimals: 2 },
        { symbol: 'ZS', name: 'Soybeans', category: 'CME CBOT Agricultural Futures', decimals: 2 },
        { symbol: 'ZM', name: 'Soybean Meal', category: 'CME CBOT Agricultural Futures', decimals: 2 },
        { symbol: 'ZL', name: 'Soybean Oil', category: 'CME CBOT Agricultural Futures', decimals: 2 },
        { symbol: 'YM', name: 'Mini-DOW', category: 'CME CBOT Equity Futures', decimals: 2 },
        { symbol: 'ZT', name: '2-Year Note', category: 'CME CBOT Financial/Interest Rate Futures', decimals: 2 },
        { symbol: 'ZF', name: '5-Year Note', category: 'CME CBOT Financial/Interest Rate Futures', decimals: 2 },
        { symbol: 'ZN', name: '10-Year Note', category: 'CME CBOT Financial/Interest Rate Futures', decimals: 2 },
        { symbol: 'TN', name: '10-Year Ultra-Note', category: 'CME CBOT Financial/Interest Rate Futures', decimals: 2 },
        { symbol: 'ZB', name: '30-Year Bond', category: 'CME CBOT Financial/Interest Rate Futures', decimals: 2 },
        { symbol: 'UB', name: 'Ultra-Bond', category: 'CME CBOT Financial/Interest Rate Futures', decimals: 2 },
        { symbol: 'GC', name: 'Gold', category: 'CME COMEX Futures', decimals: 2 },
        { symbol: 'SI', name: 'Silver', category: 'CME COMEX Futures', decimals: 3 },
        { symbol: 'HG', name: 'Copper', category: 'CME COMEX Futures', decimals: 4 }
    ];

    const fetchAndPopulateTable = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log("Fetched data:", data);  // Log the fetched data
            populateTable(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const populateTable = (data) => {
        const tableBody = document.getElementById('pivotTableBody');
        tableBody.innerHTML = ""; // Clear existing table data

        tickers.forEach(ticker => {
            const item = data.find(d => d.symbol === `${ticker.symbol}=F`);
            console.log(`Processing ticker: ${ticker.symbol}`, item);  // Log each ticker and the corresponding item
            if (item) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td data-label="Ticker">${ticker.symbol}</td>
                    <td data-label="Name">${ticker.name}</td>
                    <td data-label="R4">${item.resistance_4.toFixed(ticker.decimals)}</td>
                    <td data-label="R3">${item.resistance_3.toFixed(ticker.decimals)}</td>
                    <td data-label="R2">${item.resistance_2.toFixed(ticker.decimals)}</td>
                    <td data-label="R1">${item.resistance_1.toFixed(ticker.decimals)}</td>
                    <td data-label="P">${item.pivot_point.toFixed(ticker.decimals)}</td>
                    <td data-label="S1">${item.support_1.toFixed(ticker.decimals)}</td>
                    <td data-label="S2">${item.support_2.toFixed(ticker.decimals)}</td>
                    <td data-label="S3">${item.support_3.toFixed(ticker.decimals)}</td>
                    <td data-label="S4">${item.support_4.toFixed(ticker.decimals)}</td>
                `;
                tableBody.appendChild(row);
            }
        });
    };

    // Fetch and populate the table on page load
    fetchAndPopulateTable();
});
