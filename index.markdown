---
layout: home
title: Camarilla Futures
---

<div class="container">
    <div class="sidebar">
         <h2>Trade Recaps</h2>
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
            
                <a href="{{ '/playbook' | relative_url }}" class="view-more-link"> Trading Strategies Playbook</a>
        </ul>
    </div>

    <div class="main-content">
        <h2>Latest Post</h2>
        {% assign latest_post = site.posts | sort: 'date' | last %}
        <h2>{{ latest_post.title }}</h2>
        <p><i>{{ latest_post.date | date: "%B %d, %Y" }}</i></p>
        <p>{{ latest_post.content }}</p>
    </div>


<script src="{{ '/assets/js/table.js' | relative_url }}"></script>
