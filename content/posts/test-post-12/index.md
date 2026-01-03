+++
title = "Test Post 12 (typescript)"
date = 2026-01-02
description = "This is test post number 12 demonstrating typescript syntax highlighting using Zola."
authors = ["laconicd"]
[taxonomies]
categories = ["test"]
tags = ["test", "typescript"]
[extra]
image = "test-post-12-typescript.jpg"
comments = true  # 이 설정이 있는 포스트에만 댓글창이 나타납니다.
+++

# Test Post 12 - typescript



This post demonstrates syntax highlighting for **typescript** using **Zola**.

<!-- more -->


```typescript
// Advanced TypeScript: Generics and Mapped Types

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
}

const updatePost = (id: string, fields: PartialBy<Post, "title" | "content">) => {
  console.log(`Updating post ${id}...`);
  // Implementation here
};

updatePost("123", { published: true });

class Repository<T extends { id: string }> {
  private items: T[] = [];

  add(item: T) {
    this.items.push(item);
  }

  getById(id: string): T | undefined {
    return this.items.find(i => i.id === id);
  }
}

const postRepo = new Repository<Post>();
```
