---
layout: home
title: Camarilla Futures
---

<div class="container">
    <div class="sidebar">
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
            <h2>Zack's Playbook</h2>
        <ul>
            
                <a href="{{ '/playbook' | relative_url }}" class="view-more-link"> Trading Strategies Playbook</a>
            
        </ul>
    
    </div>

    <div class="main-content">
    <h2>Latest</h2>
        {% assign latest_post = site.posts | sort: 'date' | last %}
        <p>{{ latest_post.content }}</p>
    </div>
</div>

<script src="{{ '/assets/js/table.js' | relative_url }}"></script>
