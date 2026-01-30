---
# 🎨 Pure CSS Architecture Guide (2026) - Elite Edition

이 가이드는 **Clean Architecture**와 **2026년형 현대적 웹 표준**을 기반으로 한 최상위 기술 명세서입니다. 모든 에이전트는 본 문서에 정의된 **'Golden Patterns'**를 복제하여 일관된 품질을 유지해야 합니다.

---

## 0. 핵심 전략 (Core Strategy)

### 📐 Engineering Excellence & Paradigms
이 프로젝트의 모든 코드는 다음 원칙을 엄격히 준수합니다.
- **Verification First:** 에이전트는 모든 답변 전 반드시 외부 검색(Google, GitHub 등)을 통해 사실 기반으로 대답하고 출처를 명시해야 합니다. 사실 확인이 불가능한 경우 "모르겠다"고 명시하고 사용자에게 판단을 위한 구체적인 선택지를 제공합니다.
- **Clean Architecture & Clean Code:** 관심사의 분리와 가독성을 최우선으로 합니다.
- **Strict Paradigms:** 상황에 따라 OOP, Functional Programming, 최적의 Design Patterns를 선택하여 현대적이고 최적화된 솔루션을 제공합니다.
- **Modern Standards:** 기술 관련 정보는 항상 현재 날짜(2026-01-31) 기준의 최신 표준 및 기술 동향을 확인하여 제안합니다.
- **Visual Verification:** 작업 전후 `chrome-devtools` 기반 실시간 검증 및 스크린샷 증명을 의무화합니다.

---

## 1. 지능형 레이아웃 (Intelligent Layout)

### 1.1 @scope 기반 캡슐화
모든 컴포넌트 스타일은 전역 오염을 방지하기 위해 반드시 `@scope` 블록 내에 작성합니다.

```css
@layer components {
  @scope (.c-card) {
    :scope {
      /* 부모 컨테이너 기준 정의 */
      container-type: inline-size;
      background-color: var(--ui-color-canvas);
    }
    
    .c-card__title {
      font-size: var(--fs-large);
      margin-block-end: var(--ui-space-sm);
    }
  }
}
```

### 1.3 Blueprint-First Strategy
모든 레이아웃 배치 작업은 반드시 `static/css/layouts/blueprints.css`에 정의된 엔진을 최우선으로 사용합니다.
- **Mandatory Use:** `.l-stack`, `.l-cluster`, `.l-between`, `.l-grid` 등 이미 정의된 추상화 객체를 조립하여 레이아웃을 구성합니다.
- **Exception Rule:** 엔진만으로 구현이 불가능한 특수한 기하학적 구조에 한해서만 `style="--areas: ..."`와 같은 인라인 커스텀을 허용합니다. 이 경우에도 엔진의 기본 변수(`--gap`, `--align` 등)를 최대한 재활용해야 합니다.

---

## 2. 스크롤 엔지니어링 (Scroll Engineering)

### 2.1 CSS Scroll-driven Animations (SDA)
자바스크립트 없이 브라우저 네이티브 타임라인을 사용하여 매거진 스타일의 동적 리빌(Reveal)을 구현합니다.

```css
.c-reveal-item {
  view-timeline: --reveal block;
  animation: fade-in-up both;
  animation-timeline: --reveal;
  animation-range: entry 10% contain 40%;
}

@keyframes fade-in-up {
  from { opacity: 0; translate: 0 20px; }
  to { opacity: 1; translate: 0 0; }
}
```

### 2.2 Editorial Scroll Snap
정교한 읽기 경험을 위해 스크롤 스냅을 활용합니다.

```css
.l-magazine-section {
  scroll-snap-type: y mandatory;
  overflow-y: auto;
}

.c-article-page {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

---

## 3. 시각적 연속성 (Visual Continuity)

### 3.1 View Transitions API (MPA)
페이지 전환 시 요소 간의 부드러운 연결을 위해 `view-transition-name`을 지정합니다.

```css
/* templates/section.html (포스트 목록) */
<img class="c-thumb" style="view-transition-name: post-hero-{{ post.id }}" ... />

/* templates/page.html (포스트 본문) */
<img class="c-hero" style="view-transition-name: post-hero-{{ post.id }}" ... />
```

### 3.2 Speculation Rules API
사용자의 다음 행동을 예견하여 페이지를 미리 로드합니다.

```html
<script type="speculationrules">
{
  "prerender": [{
    "source": "list",
    "urls": ["/posts/next-article/"],
    "score": 0.5
  }]
}
</script>
```

---

## 4. 위치 논리 (Anchor Positioning)

팝오버, 툴팁 등은 JS 좌표 계산 없이 앵커 기능을 사용합니다.

```css
.c-anchor-button {
  anchor-name: --nav-menu;
}

.c-popover-menu {
  position: absolute;
  position-anchor: --nav-menu;
  inset-block-start: anchor(end);
  inset-inline-start: anchor(start);
}
```

---

## 5. 현대적 컬러 엔진 (RCS)

투명도 조절 및 색상 변형 시 반드시 **Relative Color Syntax**를 사용합니다.

```css
/* ✅ 권장: RCS */
--ui-color-faint: oklch(from var(--ui-color-ink) l c h / 0.08);

/* ❌ 금지: opacity 또는 수동 배합 */
opacity: 0.08;
```

---

## 💡 유지보수 원칙
1. **Physical properties are Forbidden.** 오직 Logical Properties만 사용합니다.
2. **Main Thread is Sacred.** 애니메이션은 오직 Compositor Thread에서 처리합니다.
3. **Architecture is Logic.** `l-blueprint` 엔진의 매칭 원칙을 최우선으로 합니다.
