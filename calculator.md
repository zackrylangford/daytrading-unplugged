---
layout: home
title: Camarilla Calculator
---


<center><h2>Camarilla Calculator</h2></center>

<div class="container">

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