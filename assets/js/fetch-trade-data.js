console.log("fetch-trade-data.js loaded successfully");

function fetchTradeData(tradeDate, placeholderId, apiEndpoint) {
  fetch(`${apiEndpoint}?date=${tradeDate}`)
    .then(response => response.json())
    .then(data => {
      const placeholder = document.getElementById(placeholderId);
      if (!placeholder) return;

      if (data.error) {
        placeholder.innerText = `Error: ${data.error}`;
        return;
      }

      const trades = data;
      
      // Sort trades from earliest to latest
      trades.sort((a, b) => new Date(a.EnteredAt) - new Date(b.EnteredAt));
      
      // Calculate total net PnL
      let totalNetPnL = 0;

      trades.forEach(trade => {
        const netPnL = parseFloat(trade.TotalPnL) - parseFloat(trade.TotalFees);
        totalNetPnL += netPnL;
      });

      // Create table HTML
      let tableHTML = `<p><strong>Total Net PnL: ${totalNetPnL.toFixed(2)}</strong></p>`;
      tableHTML += '<table class="trade-table">';
      tableHTML += `
        <thead>
          <tr>
            <th>Entered At</th>
            <th>Exited At</th>
            <th>Entry Price</th>
            <th>Exit Price</th>
            <th>Size</th>
            <th>Fees</th>
            <th>PnL</th>
            <th>Net</th>
            <th>Type</th>
            <th>Contract</th>
            <th>W/L</th>
          </tr>
        </thead>
        <tbody>
      `;

      trades.forEach(trade => {
        const enteredAt = new Date(trade.EnteredAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const exitedAt = new Date(trade.ExitedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const netPnL = parseFloat(trade.TotalPnL) - parseFloat(trade.TotalFees);
        const wlClass = netPnL >= 0 ? 'win' : 'loss';
        const wlText = netPnL >= 0 ? 'W' : 'L';

        tableHTML += `
          <tr class="${wlClass}">
            <td data-label="Entered At">${enteredAt} (ET)</td>
            <td data-label="Exited At">${exitedAt} (ET)</td>
            <td data-label="Entry Price">${parseFloat(trade.EntryPrice).toFixed(2)}</td>
            <td data-label="Exit Price">${parseFloat(trade.ExitPrice).toFixed(2)}</td>
            <td data-label="Size">${trade.TotalSize}</td>
            <td data-label="Fees">${parseFloat(trade.TotalFees).toFixed(2)}</td>
            <td data-label="PnL">${parseFloat(trade.TotalPnL).toFixed(2)}</td>
            <td data-label="Net">${netPnL.toFixed(2)}</td>
            <td data-label="Type">${trade.Type}</td>
            <td data-label="Contract">${trade.FullContractName}</td>
            <td data-label="W/L">${wlText}</td>
          </tr>
        `;
      });

      tableHTML += '</tbody></table>';
      placeholder.innerHTML = tableHTML;
    })
    .catch(error => {
      document.getElementById(placeholderId).innerText = `Error fetching trade data: ${error}`;
    });
}
