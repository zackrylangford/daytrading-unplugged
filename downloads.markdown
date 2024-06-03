---
layout: default
title: Downloads
---

<div class="container">
  <div class="downloads-list">
    <h1>{{ page.title }}</h1>
    <ul>
        {% assign download_posts = site.posts | where: "categories", "downloads" | sort: 'date' | reverse %}
        {% for post in download_posts %}
        <li>
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            <p>{{ post.date | date: "%B %d, %Y" }}</p>
        </li>
        {% endfor %}
    </ul>
  </div>
</div>
