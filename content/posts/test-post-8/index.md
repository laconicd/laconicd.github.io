+++
title = "Test Post 8 (css)"
date = 2026-01-02
description = "This is test post number 8 demonstrating css syntax highlighting using Zola."
authors = ["laconicd"]
[taxonomies]
categories = ["test"]
tags = ["test", "css"]
[extra]
image = "test-post-8-css.jpg"
+++

# Test Post 8 - css



This post demonstrates syntax highlighting for **css** using **Zola**.

<!-- more -->


```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --bg-color: #f3f4f6;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1f2937;
    --text-color: #f9fafb;
  }
}

.card {
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-4px);
  border: 2px solid var(--primary-color);
}

.btn-primary {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  text-decoration: none;
  font-weight: 600;
}
```
