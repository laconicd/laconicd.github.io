+++
title = "Test Post 4 (python)"
date = 2026-01-02
description = "This is test post number 4 demonstrating python syntax highlighting using Zola."
[taxonomies]
categories = ["test"]
tags = ["test", "python"]
+++

# Test Post 4 - python

This post demonstrates syntax highlighting for **python** using **Zola**.

```python
import asyncio
import random

class DataProcessor:
    def __init__(self, name):
        self.name = name
        self.data = []

    async def fetch_data(self):
        print(f"[{self.name}] Fetching data...")
        await asyncio.sleep(1)
        self.data = [random.randint(1, 100) for _ in range(5)]
        print(f"[{self.name}] Data received: {self.data}")

    def process(self):
        result = sum(self.data) / len(self.data) if self.data else 0
        return f"Average: {result:.2f}"

async def main():
    processors = [DataProcessor(f"Worker-{i}") for i in range(3)]
    
    # Run tasks concurrently
    tasks = [p.fetch_data() for p in processors]
    await asyncio.gather(*tasks)

    for p in processors:
        print(f"[{p.name}] {p.process()}")

if __name__ == "__main__":
    asyncio.run(main())
```
