+++
title = "Test Post 5 (rust)"
date = 2026-01-02
description = "This is test post number 5 demonstrating rust syntax highlighting using Zola."
authors = ["laconicd"]
[taxonomies]
categories = ["test"]
tags = ["test", "rust"]
[extra]
image = "test-post-5-rust.jpg"
+++

# Test Post 5 - rust



This post demonstrates syntax highlighting for **rust** using **Zola**.

<!-- more -->


```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }

    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            height: size,
        }
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };
    let rect2 = Rectangle::square(10);

    println!("rect1 is {:?}", rect1);
    println!("The area of rect1 is {} square pixels.", rect1.area());
    println!("Can rect1 hold rect2? {}", rect1.can_hold(&rect2));
}
```
