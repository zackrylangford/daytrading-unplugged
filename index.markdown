---
layout: home
title: Camarilla Futures
---

<div class="container">
    <div class="sidebar">
        <center><h2><i class="fas fa-chart-line"></i> Trade Recaps</h2></center>
        <ul>
            {% assign trade_recaps = site.posts | where: "categories", "trade-recap" | sort: 'date' | reverse %}
            {% for post in trade_recaps limit:5 %}
            <li>
                <a href="{{ post.url | relative_url }}"><i class="far fa-file-alt"></i> {{ post.date | date: "%B %d, %Y" }}</a>
            </li>
            {% endfor %}
        </ul>
        <center><a href="{{ '/trade-recaps' | relative_url }}" class="view-more-link"> View All Recaps</a></center>
        <br>
        <ul>
            <li>
                <center><a href="{{ '/playbook' | relative_url }}" class="view-more-link"> <i class="fas fa-book"></i> Zack's Playbook</a></center>
            </li>
        </ul>
    </div>

    <div class="main-content">
        <h2>Latest Post</h2>
        {% assign latest_posts = site.posts | sort: 'date' | reverse %}
        {% assign latest_non_trade_recap_post = null %}
        {% for post in latest_posts %}
            {% unless post.tags contains "trade-recap" %}
                {% assign latest_non_trade_recap_post = post %}
                {% break %}
            {% endunless %}
        {% endfor %}
        {% if latest_non_trade_recap_post %}
            <h2>{{ latest_non_trade_recap_post.title }}</h2>
            <p><i>{{ latest_non_trade_recap_post.date | date: "%B %d, %Y" }}</i></p>
            <p>{{ latest_non_trade_recap_post.content }}</p>
        {% else %}
            <p>No posts available.</p>
        {% endif %}
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
