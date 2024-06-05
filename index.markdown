---
layout: home
title: Camarilla Futures
---

<div class="container">
    <div class="sidebar">
        <h2><i class="fas fa-chart-line"></i> Trade Recaps</h2>
        <ul>
            {% assign trade_recaps = site.posts | where: "categories", "trade-recap" | sort: 'date' | reverse %}
            {% for post in trade_recaps limit:5 %}
            <li>
                <a href="{{ post.url | relative_url }}"><i class="far fa-file-alt"></i> {{ post.date | date: "%B %d, %Y" }}</a>
            </li>
            {% endfor %}
        </ul>
        <a href="{{ '/trade-recaps' | relative_url }}" class="view-more-link"><i class="fas fa-arrow-right"></i> More Recaps</a>
        <h2><i class="fas fa-book"></i> Playbook</h2>
        <ul>
            <li>
                <a href="{{ '/playbook' | relative_url }}" class="view-more-link"><i class="fas fa-arrow-right"></i> Trading Strategies Playbook</a>
            </li>
        </ul>
    </div>

    <div class="main-content">
        <h2>Latest Post</h2>
        {% assign latest_post = site.posts | sort: 'date' | last %}
        <h2>{{ latest_post.title }}</h2>
        <p><i>{{ latest_post.date | date: "%B %d, %Y" }}</i></p>
        <p>{{ latest_post.content }}</p>
    </div>

    <div class="featured-posts">
        <h2>More Posts</h2>
        <div class="featured-posts-grid">
            {% for post in site.posts limit:3 %}
            <div class="featured-post">
                <div class="featured-post-text">
                    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
                    <p>{{ post.date | date: "%B %d, %Y" }}</p>
                    <a href="{{ post.url | relative_url }}">Read More</a>
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</div>

<script src="{{ '/assets/js/table.js' | relative_url }}"></script>
