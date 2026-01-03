+++
title = "Test Post 20 (toml)"
date = 2026-01-02
description = "This is test post number 20 demonstrating toml syntax highlighting using Zola."
authors = ["laconicd"]
[taxonomies]
categories = ["test"]
tags = ["test", "toml"]
[extra]
image = "test-post-20-toml.jpg"
+++

# Test Post 20 - toml



This post demonstrates syntax highlighting for **toml** using **Zola**.

<!-- more -->


```toml
# Deno project configuration



[project]
name = "laconicd.github.io"
version = "1.0.0"
authors = ["laconicd"]

[tasks]
dev = "deno task common && deno task zola:serve"
prd = "deno task common && deno task zola:build"
common = ["tailwindcss:build", "router:build"]
"tailwindcss:build" = "deno run -A @tailwindcss/cli -i assets/tailwind.css -o static/styles.css"
"router:build" = "deno bundle --platform browser --minify --outdir static/ scripts/router.ts"

[imports]
"@tailwindcss/cli" = "npm:@tailwindcss/cli@^4.0.0"
"daisyui" = "npm:daisyui@^5.0.0"
"fuse.js" = "npm:fuse.js@^7.1.0"
```
