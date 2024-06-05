---
layout: default
title: Playbook
permalink: /playbook/
---

<div class="playbook-header">
    <h1>Zack's Futures Playbook</h1>
    <p>Here are my strategies for trading futures.</p>
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
