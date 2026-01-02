+++
title = "Test Post 15 (rust)"
date = 2026-01-02
description = "This is test post number 15 demonstrating rust syntax highlighting using Zola."
[taxonomies]
categories = ["test"]
tags = ["test", "rust"]
+++

# Test Post 15 - rust

This post demonstrates syntax highlighting for **rust** using **Zola**.

```rust
// Error Handling in Rust

use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username_file = File::open("hello.txt")?;
    let mut username = String::new();
    username_file.read_to_string(&mut username)?;
    Ok(username)
}

// More concise version using chaining
fn read_username_concise() -> Result<String, io::Error> {
    let mut s = String::new();
    File::open("hello.txt")?.read_to_string(&mut s)?;
    Ok(s)
}

fn main() {
    match read_username_from_file() {
        Ok(name) => println!("Username: {}", name),
        Err(e) => eprintln!("Error reading file: {}", e),
    }
}
```
