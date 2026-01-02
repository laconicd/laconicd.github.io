+++
title = "Test Post 6 (bash)"
date = 2026-01-02
description = "This is test post number 6 demonstrating bash syntax highlighting using Zola."
[taxonomies]
categories = ["test"]
tags = ["test", "bash"]
+++

# Test Post 6 - bash

This post demonstrates syntax highlighting for **bash** using **Zola**.

```bash
#!/bin/bash

# Configuration
SOURCE_DIR="./src"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
    echo "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
fi

# Function to perform backup
do_backup() {
    local target="$BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
    echo "Starting backup of $SOURCE_DIR to $target..."
    
    if tar -czf "$target" "$SOURCE_DIR"; then
        echo "Backup successful!"
    else
        echo "Error: Backup failed" >&2
        return 1
    fi
}

# Run backup
do_backup
```
