+++
title = "Test Post 3 (javascript)"
date = 2026-01-02
description = "This is test post number 3 demonstrating javascript syntax highlighting using Zola."
[taxonomies]
categories = ["test"]
tags = ["test", "javascript"]
+++

# Test Post 3 - javascript

This post demonstrates syntax highlighting for **javascript** using **Zola**.

```javascript
/**
 * Simple counter object demonstrating closures and ES6 features.
 */
const createCounter = (initialValue = 0) => {
  let count = initialValue;

  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    getValue() {
      return count;
    },
    reset() {
      count = initialValue;
    }
  };
};

const counter = createCounter(10);
console.log("Initial:", counter.getValue());
console.log("Increment:", counter.increment());
console.log("Increment:", counter.increment());
console.log("Decrement:", counter.decrement());

const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 }
];

const names = users
  .filter(user => user.age > 28)
  .map(user => user.name);

console.log("Users over 28:", names);
```
