+++
title = "Test Post 18 (css)"
date = 2026-01-02
description = "This is test post number 18 demonstrating css syntax highlighting using Zola."
authors = ["laconicd"]
[taxonomies]
categories = ["test"]
tags = ["test", "css"]
[extra]
image = "test-post-18-css.jpg"
+++

# Test Post 18 - css



This post demonstrates syntax highlighting for **css** using **Zola**.

<!-- more -->


```css
/* Modern CSS Features */

@container card (min-width: 400px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.profile-pic {
  aspect-ratio: 1 / 1;
  object-fit: cover;
  clip-path: circle(50%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

.glow-text {
  background: linear-gradient(45deg, #ff00bd, #4444ff);
  -webkit-background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 8px rgba(255, 0, 189, 0.4));
}

@layer components {
  .btn {
    padding: 0.75em 1.5em;
    border: none;
    border-radius: var(--radius);
  }
}
```
