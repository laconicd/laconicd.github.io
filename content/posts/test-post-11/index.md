+++
title = "Test Post 11 (yaml)"
date = 2026-01-02
description = "This is test post number 11 demonstrating yaml syntax highlighting using Zola."
authors = ["laconicd"]
[taxonomies]
categories = ["test"]
tags = ["test", "yaml"]
[extra]
image = "test-post-11-yaml.jpg"
+++

# Test Post 11 - yaml



This post demonstrates syntax highlighting for **yaml** using **Zola**.

<!-- more -->



```yaml
# GitHub Actions workflow example



name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x

      - name: Build site
        run: deno task prd

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: public
```
