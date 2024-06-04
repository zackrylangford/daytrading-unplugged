---
layout: default
title: Playbook
permalink: /playbook/
---

<div class="playbook-header">
    <h1>Trading Strategies Playbook</h1>
    <p>Welcome to Zack's Trading Strategies Playbook. Here you'll find all the strategies I use for trading futures.</p>
</div>

<div class="playbook-content">
    <div class="card-container">
        {% assign strategies = site.posts | where: "categories", "strategy" | sort: 'date' | reverse %}
        {% for post in strategies %}
        <div class="card">
            <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
            <a href="{{ post.url | relative_url }}" class="read-more-link">View Strategy</a>
        </div>
        {% endfor %}
    </div>
</div>

<link rel="stylesheet" href="{{ '/assets/css/playbook.css' | relative_url }}">
