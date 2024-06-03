---
layout: default
title: Downloads
---

<div class="downloads-container">
  <div class="downloads-list">
    <h1>{{ page.title }}</h1>
    <ul>
        {% assign download_posts = site.posts | where: "categories", "downloads" | sort: 'date' | reverse %}
        {% for post in download_posts %}
        <li class="download-item">
            <a class="download-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </li>
        {% endfor %}
    </ul>
  </div>
</div>
<link rel="stylesheet" href="{{ '/assets/css/downloads-blog.css' | relative_url }}">
