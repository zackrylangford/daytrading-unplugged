---
layout: default
title: Camarilla Futures
---

<div class="container">
    <h1>Camarilla Pivot Points Calculator</h1>
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
            <h2>Results</h2>
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
    <div class="newsfeed">
        <h2>Latest Blog Posts</h2>
        <ul>
            {% for post in site.posts limit:5 %}
            <li>
                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                <p>{{ post.date | date: "%B %d, %Y" }}</p>
            </li>
            {% endfor %}
        </ul>
    </div>
</div>
<script src="{{ '/assets/js/calc.js' | relative_url }}"></script>
