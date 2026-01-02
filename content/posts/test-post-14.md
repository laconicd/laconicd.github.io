+++
title = "Test Post 14 (python)"
date = 2026-01-02
description = "This is test post number 14 demonstrating python syntax highlighting using Zola."
[taxonomies]
categories = ["test"]
tags = ["test", "python"]
+++

# Test Post 14 - python

This post demonstrates syntax highlighting for **python** using **Zola**.

```python
# Data Analysis with Python

data = [
    {"name": "Alice", "score": 85},
    {"name": "Bob", "score": 92},
    {"name": "Charlie", "score": 78},
    {"name": "David", "score": 95}
]

def analyze_scores(students):
    scores = [s["score"] for s in students]
    average = sum(scores) / len(scores)
    highest = max(data, key=lambda x: x["score"])
    
    return {
        "average": average,
        "highest_student": highest["name"],
        "highest_score": highest["score"]
    }

stats = analyze_scores(data)

print(f"Average Score: {stats['average']}")
print(f"Top Student: {stats['highest_student']} with {stats['highest_score']}")

# List comprehension filtering
passing_students = [s["name"] for s in data if s["score"] >= 90]
print(f"Passing Students (>=90): {', '.join(passing_students)}")
```
