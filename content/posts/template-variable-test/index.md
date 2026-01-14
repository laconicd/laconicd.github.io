+++
title = "Template Variable Verification Test"
date = 2026-01-14
description = "A test post to verify that all config variables are correctly linked to the templates."
authors = ["laconicd"]

[taxonomies]
tags = ["test", "config", "zola"]
categories = ["Internal"]

[extra]
image = "test-visual.jpg"
+++

# Template Variable Test

This post is designed to verify that the following variables from `config.toml` are correctly integrated into the blog templates:

## 1. Global Config
- **Hero Title & Subtitle**: Should appear on the home page as defined in `config.extra`.
- **Site Description**: Should appear in the footer.
- **Social Links**: GitHub, Twitter, and LinkedIn icons in the footer should point to the configured URLs.

## 2. Post-Specific Config (Linked to `config.extra`)
- **Author Name**: `{{ config.extra.author_name }}`
- **Author Role**: `{{ config.extra.author_role }}`
- **Author Avatar**: Should display the image from `{{ config.extra.author_avatar }}`.
- **Date Format**: The date below the title should follow the format `{{ config.extra.date_format }}`.

## 3. Verification Steps
1. **Home Page**: Check if the H1 and P tag in the header match your `config.toml`.
2. **Post Page**: Check the author profile at the bottom of this post.
3. **Footer**: Verify social icons and the site description.
4. **Date Display**: Ensure the date is formatted as "January 14, 2026" (or your chosen format).

---

*This is an automated test post.*
