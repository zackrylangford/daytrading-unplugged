---
layout: home
title: Camarilla Futures
---

<div class="container">
    <div class="sidebar">
        <div class="info-section">
            <div id="clock" class="info-box"></div>
        </div>
        <h2>Zack's Trade Recaps</h2>
        <ul>
            {% assign trade_recaps = site.posts | where: "categories", "trade-recap" | sort: 'date' | reverse %}
            {% for post in trade_recaps limit:5 %}
            <li>
                <a href="{{ post.url | relative_url }}">{{ post.date | date: "%B %d, %Y" }}</a>
            </li>
            {% endfor %}
        </ul>
        <a href="{{ '/trade-recaps' | relative_url }}" class="view-more-link">More Recaps</a>
            <h2>Playbook</h2>
        <ul>
            <li>
                <a href="{{ '/playbook' | relative_url }}">Trading Strategies Playbook</a>
            </li>
        </ul>
    
    </div>

    <div class="main-content">
        {% assign latest_post = site.posts | sort: 'date' | last %}
        <p>{{ latest_post.content }}</p>
    </div>
</div>

<script src="{{ '/assets/js/table.js' | relative_url }}"></script>
