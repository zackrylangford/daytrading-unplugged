---
layout: home
title: Camarilla Futures
---

<div class="container">
    <div class="sidebar">
        <h2>Camarilla Pivot Points Calculator</h2>
        <div class="calculator">
            <div class="input-group">
                <label for="high">Previous day high:</label>
                <input type="text" id="high">
            </div>
            <div class="input-group">
                <label for="low">Previous day low:</label>
                <input type="text" id="low">
            </div>
            <div class="input-group">
                <label for="close">Previous day close:</label>
                <input type="text" id="close">
            </div>
            <button id="calculate-button">Calculate</button>
            <div class="results">
                <h3>Results</h3>
                <p>Breakout Target: <span id="breakout_target"></span></p>
                <p>Resistance 4: <span id="resistance_4"></span></p>
                <p>Resistance 3: <span id="resistance_3"></span></p>
                <p>Resistance 2: <span id="resistance_2"></span></p>
                <p>Resistance 1: <span id="resistance_1"></span></p>
                <p>Support 1: <span id="support_1"></span></p>
                <p>Support 2: <span id="support_2"></span></p>
                <p>Support 3: <span id="support_3"></span></p>
                <p>Support 4: <span id="support_4"></span></p>
                <p>Breakdown Target: <span id="breakdown_target"></span></p>
                <div class="pivot-section">
                    <p>Pivot Point: <span id="pivot_point"></span></p>
                </div>
            </div>
        </div>
    </div>
    <div class="main-content">
        <h1>Camarilla Pivot Points</h1>
        <p>Below is a table of the Camarilla pivot points for topstep eligible futures tickers. The values update everyday at 4:15pm EST</p>
        <table class="cam-table">
            <thead>
                <tr>
                    <th>Ticker</th>
                    <th>Name</th>
                    <th>R4</th>
                    <th>R3</th>
                    <th>R2</th>
                    <th>R1</th>
                    <th>P</th>
                    <th>S1</th>
                    <th>S2</th>
                    <th>S3</th>
                    <th>S4</th>
                </tr>
            </thead>
            <tbody id="pivotTableBody"></tbody>
        </table>
    </div>
</div>
<script src="{{ '/assets/js/calc.js' | relative_url }}"></script>
<script src="{{ '/assets/js/table.js' | relative_url }}"></script>
