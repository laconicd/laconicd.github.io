+++
title = "Test Post 10 (toml)"
date = 2026-01-02
description = "This is test post number 10 demonstrating toml syntax highlighting using Zola."
authors = ["laconicd"]
[taxonomies]
categories = ["test"]
tags = ["test", "toml"]
[extra]
image = "test-post-10-toml.jpg"
+++

# Test Post 10 - toml



This post demonstrates syntax highlighting for **toml** using **Zola**.

<!-- more -->


```toml
# Zola configuration file



base_url = "https://laconicd.github.io"
title = "The Blog"
description = "A personal blog about software development."
authors = ["laconicd"]
default_language = "ko"

[markdown]
highlight_code = true
highlight_theme = "ayu-light"
render_emoji = true

[extra]
author_name = "laconicd"
date_format = "%Y-%m-%d"

[[taxonomies]]
name = "tags"
feed = true

[[taxonomies]]
name = "categories"
feed = true

[search]
index_format = "fuse_javascript"
```
