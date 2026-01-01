# Zola Concepts: Section vs Page vs Post

This document explains the core concepts in Zola based on the current project structure.

## 1. Section (e.g., `index.html`)

- **Concept**: A container, like a folder or bookshelf.
- **Role**: Collects other pages and displays them as a list (e.g., a blog feed).
- **Project Example**: `content/posts` directory.
  - The folder itself acts as a section.
  - Uses `index.html` template to iterate through posts (`{% for page in paginator.pages %}`).

## 2. Page (e.g., `page.html`)

- **Concept**: An independent, standalone document.
- **Role**: Displays static information that doesn't change much over time (timeless content).
- **Project Example**: `content/about.md`.
  - Used for "About" or "Contact" pages.
  - Uses `page.html` template, displaying primarily title and content.

## 3. Post (e.g., `post.html`)

- **Concept**: Technically identical to a **Page** in the file system.
- **Role**: An **Article** or record with a date and order.
- **Project Example**: Files inside `content/posts/`.
  - Used for blog posts, diaries, or technical articles.
  - Uses `post.html` template, including date, categories, authors, and navigation (previous/next).

## Summary Table

| Type        | Template     | Purpose         | Analogy               |
| ----------- | ------------ | --------------- | --------------------- |
| **Section** | `index.html` | Listing content | Bookshelf / Folder    |
| **Page**    | `page.html`  | Static info     | Flyer / Notice        |
| **Post**    | `post.html`  | Dated content   | Diary Entry / Article |
