---
layout: home
title: Camarilla Futures
---

<div class="container">
<div class="sidebar">
    <h2>Zack's Trade Recaps</h2>
    <ul>
        {% for post in site.posts limit:5 %}
        <li>
            <a href="{{ post.url | relative_url }}">{{ post.date | date: "%B %d, %Y" }}</a>
        </li>
        {% endfor %}
    </ul>
    <a href="{{ '/trade-recaps' | relative_url }}" class="view-more-link">More Recaps</a>
</div>

<div class="main-content">
    <h1>Camarilla Pivot Points</h1>
    <p>Below is a table of the Camarilla pivot points for topstep eligible futures tickers. The values update everyday at 4:00pm CT</p>
    <div id="clock"></div>
    <div id="valid-date"></div>
    <div id="next-valid-date"></div>
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
