+++
title = "Test Post 13 (javascript)"
date = 2026-01-02
description = "This is test post number 13 demonstrating javascript syntax highlighting using Zola."
[taxonomies]
categories = ["test"]
tags = ["test", "javascript"]
+++

# Test Post 13 - javascript

This post demonstrates syntax highlighting for **javascript** using **Zola**.

```javascript
// Functional Programming in JS

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const isEven = n => n % 2 === 0;
const square = n => n * n;
const add = (a, b) => a + b;

const result = numbers
  .filter(isEven)
  .map(square)
  .reduce(add, 0);

console.log(`Sum of squares of even numbers: ${result}`);

// Currying example
const multiply = a => b => a * b;
const double = multiply(2);
const triple = multiply(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```
