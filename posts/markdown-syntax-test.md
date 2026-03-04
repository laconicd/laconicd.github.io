---
title: "The Ultimate Markdown Stress Test"
date: 2026-03-02
type: post
layout: layouts/page.vto
category: Guide
tags: ["markdown", "typography", "test", "styling", "gfm"]
description: "A definitive, all-in-one markdown syntax test page to verify every possible styling case for the Hyper-minimalist Lofi Editorial blog."
img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop"
---

Markdown is beautiful because of its simplicity. However, a truly robust editorial system must handle every edge case.
This page serves as a "Stress Test" for our CSS, typography, and Lume's Markdown renderer. If it looks good here, it
looks good everywhere.

## 1. Headings & Hierarchy

# Heading Level 1

## Heading Level 2

### Heading Level 3

#### Heading Level 4

##### Heading Level 5

###### Heading Level 6

---

## 2. Inline Text Decorations

- **Bold**: `**Bold**` or `__Bold__`
- _Italic_: `*Italic*` or `_Italic_`
- _**Bold and Italic**_: `***Bold & Italic***`
- ~~Strikethrough~~: `~~Strikethrough~~`
- ==Highlight==: `==Highlight==` (Requires plugin, otherwise rendered as text)
- Subscript: H~2~O (`H~2~O`)
- Superscript: X^2^ (`X^2^`)
- `Inline Code`: `Inline Code`
- [Standard Link](https://google.com)
- [Link with Title](https://google.com "This is a title")
- Automatic Link: <https://lume.land>
- Email: <hello@example.com>
- **Emoji**: :sparkles: :rocket: :art: (If plugin enabled)

---

## 3. Lists (Nested & Varied)

### Unordered Mixed List

- Level 1 Item
  - Level 2 Nested Item
    - Level 3 Deeply Nested Item
- Level 1 Another Item
  - [x] Task List Item (Checked)
  - [ ] Task List Item (Unchecked)

### Ordered Mixed List

1. First main point
2. Second main point
   - Sub-point A
   - Sub-point B
3. Third main point
   1. Nested ordered 1
   2. Nested ordered 2

### Definition List (Common Extension)

Term 1 : Definition 1 : Definition 2

Term 2 : Definition 3

---

## 4. Blockquotes & Pull Quotes

> "The Void is not empty; it is pregnant with possibility."
>
> — **Editorial Philosophy**

Nested Blockquotes:

> Primary Quote
>
>> Secondary Quote
>>
>>> Tertiary Quote

---

## 5. Code & Syntax Highlighting

### Indented Code Block (4 Spaces)

    // This is an indented code block
    function hello() {
      console.log("Hello Void");
    }

### Fenced Code Block (with language)

```javascript
// A simple function to test syntax highlighting
function generateOklch(h) {
  const l = 70;
  const c = 0.15;
  return `oklch(${l}% ${c} ${h})`;
}

console.log(generateOklch(250));
```

---

## 6. Tables (Alignment & Style)

| Element     |   Type    |         Status | Alignment      |
| :---------- | :-------: | -------------: | :------------- |
| **Grid**    |  Layout   |        _Ready_ | Left (Default) |
| **Flex**    | Component |       _Stable_ | Center         |
| **Float**   |  Legacy   | ~~Deprecated~~ | Right          |
| **Subgrid** | Advanced  | _Experimental_ | Mixed          |

---

## 7. Media & Figures

### Reference Image

![Alt Text][ref-img]

[ref-img]: https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=2066&auto=format&fit=crop

### Figure with Caption (HTML in MD)

<figure>
  <img src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop" alt="Gradient Background">
  <figcaption>Fig 1. A study of digital gradients in OKLCH space.</figcaption>
</figure>

---

## 8. Interactive Elements (HTML)

<details>
<summary><b>Click to expand</b> (Details/Summary Test)</summary>
This is hidden content that should be styled nicely within the prose.
- Item 1
- Item 2
</details>

---

## 9. Footnotes & References

This statement needs a source[^1]. This one needs another one[^ref].

[^1]: This is the first footnote.

[^ref]: This is a named reference footnote with more [links](https://example.com).

---

## 10. Math & Formulas

Inline: $E = mc^2$

Block: $$
\int_{a}^{b} x^2 \,dx
$$

---

## 11. Links (Reference Style)

Check out [Lume][lume-site] or [Deno][deno-site] for more info.

[lume-site]: https://lume.land
[deno-site]: https://deno.com

---

## 12. Final Horizontal Rule Variations

## Using `---`:

Using `***`:

---

Using `___`:

---

---

## Conclusion

Every element above should adhere to the **Hyper-minimalist Lofi Editorial** aesthetic. If any element breaks the layout
or looks unpolished, we must adjust the `_includes/css/prose.css` or the base tokens.
