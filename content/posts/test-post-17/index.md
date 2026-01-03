+++
title = "Test Post 17 (json)"
date = 2026-01-02
description = "This is test post number 17 demonstrating json syntax highlighting using Zola."
authors = ["laconicd"]
[taxonomies]
categories = ["test"]
tags = ["test", "json"]
[extra]
image = "test-post-17-json.jpg"
+++

# Test Post 17 - json



This post demonstrates syntax highlighting for **json** using **Zola**.

<!-- more -->


```json
{
  "api_response": {
    "status": "success",
    "data": {
      "items": [
        {
          "id": 1,
          "name": "Widget A",
          "price": 19.99,
          "tags": ["mechanical", "blue"]
        },
        {
          "id": 2,
          "name": "Widget B",
          "price": 24.50,
          "tags": ["electronic", "red"]
        }
      ],
      "pagination": {
        "current_page": 1,
        "total_pages": 5,
        "has_more": true
      }
    },
    "metadata": {
      "timestamp": "2026-01-02T12:00:00Z",
      "request_id": "req_882910"
    }
  }
}
```
