+++
title = "View Transitions API Test"
date = 2025-12-22
description = "A sample post to test the native View Transitions API implementation."
[taxonomies]
tags = ["test", "frontend", "animation"]
categories = ["Development"]
+++

# Testing View Transitions

This is a test post to verify the **View Transitions API** implementation.

When you navigate between this page and the home page, you should see a smooth **slide-up** animation if you are using a
supported browser (Chrome, Edge, Safari, etc.).

## Why Native API?

1. **Zero Bundle Size**: No heavy libraries required.
2. **Performance**: Handling snapshots at the browser engine level is extremely fast.
3. **Simplicity**: Just wrap your DOM update in `document.startViewTransition()`.

## Code Example

Here is how we implemented it in `scripts/main.ts`:

```typescript
if (document.startViewTransition) {
  document.startViewTransition(() => updateDOM(newDoc));
} else {
  updateDOM(newDoc);
}
```

## CSS Magic

The animation is controlled via pure CSS in `static/transitions.css`:

```css
::view-transition-old(root) {
  animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out;
}

::view-transition-new(root) {
  animation: 300ms cubic-bezier(0, 0, 0.2, 1) both slide-up-fade;
}
```

Try clicking the **Home** link in the navbar to see the transition in action!
