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
            // console.log("Fetched data:", data);  // Log the fetched data
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
            // console.log(`Processing ticker: ${ticker.symbol}`, item);  
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



    const updateClock = () => {
        const clockElement = document.getElementById('clock');
        const validDateElement = document.getElementById('valid-date');
        const nextValidDateElement = document.getElementById('next-valid-date');
        const now = new Date();

        // Convert to Central Time (CT)
        const centralTime = now.toLocaleString('en-US', { timeZone: 'America/Chicago' });
        const centralDate = new Date(centralTime);

        // Format current time
        const timeString = centralDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        // Format current date
        const dateString = centralDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        clockElement.innerHTML = `Central Time (CST): ${dateString}, ${timeString}`;

        // Calculate the valid date for the trading data
        const validDate = calculateValidDate(centralDate);
        const validDateString = validDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        validDateElement.innerHTML = `Data calculated from the last completed trading day:<br> ${validDateString}`;

        // Calculate the next valid trading date range
        const { startDate, endDate } = calculateNextValidDateRange(validDate);
        const startDateString = startDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const endDateString = endDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        nextValidDateElement.innerHTML = `Data is valid for the next trading session:<br> ${startDateString} 5:00 PM CT to ${endDateString} 3:10 PM CST`;
    };

    const calculateValidDate = (centralDate) => {
        let validDate = new Date(centralDate);
        const day = validDate.getDay(); // Sunday - Saturday : 0 - 6
        const hour = validDate.getHours();

        // Adjust validDate to the last completed trading day
        if (day === 0 || (day === 1 && hour < 17)) {
            // Sunday or before 5 PM Monday: use Friday
            validDate.setDate(validDate.getDate() - (day === 0 ? 2 : 3));
        } else if (hour < 17 && day !== 1) {
            // Before 5 PM on any other weekday: use the previous weekday
            validDate.setDate(validDate.getDate() - 1);
        }

        // Adjust if it's after 3:10 PM and before 5 PM on Friday
        if (day === 5 && hour >= 15 && (hour < 17 || (hour === 15 && validDate.getMinutes() >= 10))) {
            validDate.setDate(validDate.getDate() - 1);
        }

        return validDate;
    };

    const calculateNextValidDateRange = (validDate) => {
        let startDate = new Date(validDate);
        let endDate = new Date(validDate);

        startDate.setDate(startDate.getDate() + 1);
        startDate.setHours(17, 0, 0, 0); // 5:00 PM CT

        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(15, 10, 0, 0); // 3:10 PM CT

        // If the start date is Saturday, skip to Sunday evening
        if (startDate.getDay() === 6) {
            startDate.setDate(startDate.getDate() + 1); // Move to Sunday 5:00 PM
            endDate.setDate(endDate.getDate() + 1); // Move to Monday 3:10 PM
        }

        // If the start date is Sunday, adjust end date to Monday 3:10 PM
        if (startDate.getDay() === 0) {
            endDate.setDate(endDate.getDate() + 1); // Move to Monday 3:10 PM
        }

        return { startDate, endDate };
    };

    // Initial call to fetch data and update clock
    fetchAndPopulateTable();
    updateClock();

    // Update the clock every second
    setInterval(updateClock, 1000);
});