---
layout: default
title: Trade Recaps
---

<div class="trade-recaps-container">
    <div class="trade-recaps-list">
    <h1>{{ page.title }}</h1>
        <ul>
            {% assign trade_recaps = site.posts | where: "categories", "trade-recap" | sort: 'date' | reverse %}
            {% for post in trade_recaps %}
            <li class="trade-recap-item">
                <a class="trade-recap-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
                <p class="trade-recap-date">{{ post.date | date: "%B %d, %Y" }}</p>
            </li>
            {% endfor %}
        </ul>
    </div>
</div>
<link rel="stylesheet" href="{{ '/assets/css/trade-recaps-blog.css' | relative_url }}">

