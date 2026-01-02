+++
title = "Test Post 2 (typescript)"
date = 2026-01-02
description = "This is test post number 2 demonstrating typescript syntax highlighting using Zola."
[taxonomies]
categories = ["test"]
tags = ["test", "typescript"]
+++

# Test Post 2 - typescript

This post demonstrates syntax highlighting for **typescript** using **Zola**.

```typescript
interface User {
  id: number;
  name: string;
  role: "admin" | "user";
}

async function fetchUser(id: number): Promise<User> {
  console.log(`Fetching user with ID: ${id}...`);
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: "John Doe",
        role: "user"
      });
    }, 1000);
  });
}

const main = async () => {
  try {
    const user = await fetchUser(1);
    console.log("User found:", user.name);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

main();
```
