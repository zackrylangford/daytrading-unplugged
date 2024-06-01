document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "https://egu1j7o6aj.execute-api.us-east-1.amazonaws.com/default/return-futures-data";
    const tableBody = document.querySelector("#pivotTable tbody");

    // Function to fetch data from API and populate the table
    async function fetchAndPopulateTable() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            populateTable(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Function to populate the table with fetched data
    function populateTable(data) {
        tableBody.innerHTML = ""; // Clear existing table data
        data.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.symbol}</td>
                <td>${item.resistance_4}</td>
                <td>${item.resistance_3}</td>
                <td>${item.resistance_2}</td>
                <td>${item.resistance_1}</td>
                <td>${item.pivot_point}</td>
                <td>${item.support_1}</td>
                <td>${item.support_2}</td>
                <td>${item.support_3}</td>
                <td>${item.support_4}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Fetch and populate the table on page load
    fetchAndPopulateTable();
});
