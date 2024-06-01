---
layout: default
title: Trade Recaps
---

<div class="container">
<h1>Trade Recaps</h1>
<ul>
    {% for post in site.posts %}
    <li>
        <a href="{{ post.url | relative_url }}">{{ post.date | date: "%B %d, %Y" }}</a>
    </li>
    {% endfor %}
</ul>
</div>