+++
title = "Test Post 16 (bash)"
date = 2026-01-02
description = "This is test post number 16 demonstrating bash syntax highlighting using Zola."
[taxonomies]
categories = ["test"]
tags = ["test", "bash"]
+++

# Test Post 16 - bash

This post demonstrates syntax highlighting for **bash** using **Zola**.

```bash
#!/bin/bash

# System Information Script

echo "=== System Information ==="
echo "Date: $(date)"
echo "User: $(whoami)"
echo "Host: $(hostname)"
echo "Uptime: $(uptime -p)"

echo -e "\n=== CPU Info ==="
grep "model name" /proc/cpuinfo | head -n 1

echo -e "\n=== Memory Usage ==="
free -h

echo -e "\n=== Disk Usage ==="
df -h | grep '^/dev/'

echo -e "\n=== Network Interfaces ==="
ip addr show | grep 'inet ' | awk '{print $NF ": " $2}'

echo "=========================="
```
