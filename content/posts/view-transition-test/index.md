+++
title = "View Transitions API Test"
date = 2025-12-22
description = "네이티브 View Transitions API를 활용한 부드러운 페이지 전환 애니메이션 구현 테스트입니다."
authors = ["laconicd"]

[taxonomies]
tags = ["test", "frontend", "animation"]
categories = ["Development"]
[extra]
image = "view-transitions-api-test.jpg"
+++

# View Transitions: 웹의 차세대 애니메이션 표준

최신 브라우저에서 제공하는 **View Transitions API**를 테스트하기 위한 샘플 포스트입니다. 별도의 무거운 라이브러리 없이도 네이티브 레벨에서 제공하는 우아한 슬라이드 및 페이드 효과를 확인해보세요.

<!-- more -->




## Testing View Transitions

This is a test post to verify the **View Transitions API** implementation.

When you navigate between this page and the home page, you should see a smooth
**slide-up** animation if you are using a supported browser (Chrome, Edge,
Safari, etc.).

## Why Native API?

1. **Zero Bundle Size**: No heavy libraries required.
2. **Performance**: Handling snapshots at the browser engine level is extremely
   fast.
3. **Simplicity**: Just wrap your DOM update in
   `document.startViewTransition()`.

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
