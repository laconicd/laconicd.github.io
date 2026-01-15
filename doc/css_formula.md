# 🎨 2026 현대 CSS 마스터 가이드라인 (v2.1)

이 가이드는 현대 CSS의 핵심 원칙인 **유지보수성, 독립성, 접근성**을 극대화하기 위한 실전 공식과 패턴을 집대성한 문서입니다. 최신 명세와 브라우저 기능을 기반으로, 복잡한 CSS를 단순하고 예측 가능하게 관리하는 방법을 제시합니다.

## 1. 🧱 레이아웃 결정 매트릭스 (Layout Decision Matrix)

> **핵심 원칙: "2차원은 Grid, 1차원은 Flexbox"**

어떤 상황에서 어떤 기술을 써야 할지 결정하는 가장 빠른 기준입니다.

| 구분 | 주 사용 기술 | 상황 (WHEN) | 핵심 공식 (FORMULA) | 결정적 이유 (WHY) |
| :--- | :--- | :--- | :--- | :--- |
| **2차원 (2D)** | **Grid** | 페이지 전체 구조, 복잡한 격자 | `display: grid` | 가로(행)와 세로(열)를 동시에 제어하는 **2차원** 구조에 최적화. |
| **페이지 섹션** | **Subgrid** | 부모 Grid의 트랙을 자식에게 상속 | `grid-template-columns: subgrid` | 컴포넌트 간 줄 맞춤이 완벽해져 디자인 일관성 유지. |
| **1차원 (1D)** | **Flexbox** | 메뉴, 버튼 그룹 등 한 방향 배열 | `display: flex` | 가로(행) **또는** 세로(열) 중 한 축을 따라 흐르는 **1차원** 구조에 최적화. |
| **독립 컴포넌트**| **@container**| 부품(Component)의 독립적 반응형 | `container-type: inline-size` | 부모 요소의 크기에 반응. Viewport가 아닌 컨텍스트 기반. |
| **글로벌 반응형**| **@media** | 기기별 큰 구조(Viewport) 변경 | `@media (min-width: 768px)` | 모바일/태블릿/PC 등 기기별 대응에 필수. |
| **논리적 방향** | **Logical Prop.**| 여백, 테두리, 크기 지정 | `margin-inline`, `padding-block` | 글쓰기 방향(LTR/RTL)에 관계없이 일관된 디자인 제공. |

---

## 2. 📍 배치 공식: 포지셔닝 계층 (Positioning Hierarchy)

> **공식: "Relative는 기준점(Anchor), Absolute는 유령(Ghost), Sticky는 끈끈이(Glue)"**

| 속성 | 기준점 (Origin) | 핵심 특징 | 실전 예제 |
| :--- | :--- | :--- | :--- |
| `static` | 문서 흐름 | 기본값, 기준점이 될 수 없음. | 일반적인 요소 배치 |
| `relative` | **자기 자신** | **자신의 자리를 유지**하며, `absolute` 자식의 기준점이 됨. | Absolute 자식을 가두는 부모 컨테이너. |
| `absolute`| 가장 가까운 `relative` 부모 | **공중에 뜨며** 문서 흐름에서 제외. | 알림 배지, 닫기 버튼, 툴팁. |
| `fixed` | 브라우저 화면(Viewport) | 화면에 고정되어 스크롤을 무시함. | 상단 네비바, '맨 위로' 버튼. |
| `sticky` | 스크롤 컨테이너 | 부모 안에서만 스크롤을 따라 움직임. | 표 헤더 고정, 목차 사이드바. |

#### 💻 `sticky`가 작동하지 않을 때 체크리스트
1.  **부모/조상에 `overflow: hidden | auto | scroll`이 있는가?** → `overflow: visible` 이거나 없어야 함.
2.  **`top`, `bottom`, `left`, `right` 중 하나라도 지정했는가?** → 고정될 위치를 알려줘야 함.
3.  **부모의 높이가 `sticky` 요소보다 큰가?** → 부모 높이가 같거나 작으면 고정될 공간이 없음.

---

## 3. 📏 크기 및 단위 공식 (Sizing & Units)

> **공식: "글자는 `rem`, 간격은 `rem`, 컴포넌트 내부는 `em`, 유연한 크기는 `clamp()`"**

| 상황 | 추천 단위 | 이유 (WHY) |
| :--- | :--- | :--- |
| **폰트 사이즈, 여백** | **`rem`** | 사용자의 브라우저 기본 폰트 크기 설정을 존중하여 **접근성**을 높임. |
| **컴포넌트 내부 간격** | **`em`** | 부모 폰트 크기에 비례. `font-size`가 바뀌면 내부 `padding`도 함께 조절됨. |
| **반응형 폰트** | **`clamp()`** | Breakpoint 없이 최소-가변-최대 크기를 지정해 부드러운 스케일링 구현. |
| **전체 화면 높이** | **`dvh`** | 모바일 브라우저의 주소창/툴바를 고려한, 실제 보이는 영역의 1% 높이. |
| **컨테이너 반응형** | **`cqw` / `cqi`** | 컨테이너 너비(width) 또는 인라인(inline) 크기의 1%. |

#### 💻 실전 코드
```css
/* 실용적인 반응형 타이틀 */
h1 {
  /* 뷰포트 너비의 5%로 가변, 최소 1.5rem, 최대 3rem 보장 */
  font-size: clamp(1.5rem, 5vw, 3rem);
}

/* 폰트 크기에 비례하는 패딩을 가진 버튼 */
.button {
  font-size: 1rem; /* rem으로 기준 크기 설정 */
  padding: 0.5em 1em; /* em으로 내부 비율 조절 */
}
```

---

## 4. 🎨 색상 및 상호작용 시스템 (Color & Interaction)

> **공식: "정의는 OKLCH로, 상태 변화는 `color-mix()`로, 테마는 `light-dark()`로"**

**OKLCH**: 사람이 인지하는 방식과 가장 유사한 색상 모델. `rgb()`나 `hsl()`보다 예측 가능한 결과를 만듭니다.
- **L (Lightness)**: 0%(검정) ~ 100%(흰색)
- **C (Chroma)**: 0(무채색) ~ 0.37(가장 선명함)
- **H (Hue)**: 0~360 사이의 색상 각도 (e.g., 0: 빨강, 140: 초록, 250: 파랑)

#### 💻 실전 코드
```css
:root {
  /* OKLCH로 기준 색상 정의 */
  --primary: oklch(65% 0.2 250); /* 선명한 파란색 */

  /* light-dark()로 라이트/다크 모드 동시 지원 */
  --text-color: light-dark(oklch(20% 0.01 250), oklch(95% 0.01 250));
  --bg-color: light-dark(white, black);
}

.button {
  background-color: var(--primary);
  transition: background-color 0.2s ease;
}

/* color-mix()로 상태 변화 정의 */
.button:hover {
  background-color: color-mix(in oklch, var(--primary), black 10%);
}
.button:active {
  background-color: color-mix(in oklch, var(--primary), black 20%);
}
```

---

## 5. ⚪ 도형 및 비율 공식 (Shapes & Aspect Ratio)

> **공식: "`aspect-ratio`로 틀을 잡고, `border-radius`로 다듬고, `clip-path`로 자른다"**

| 도형 타입 | 비율 (Aspect) | 곡률 (Radius) | 클리핑 (Clip-Path) |
| :--- | :--- | :--- | :--- |
| **정원** | `1 / 1` | `50%` | - |
| **알약** | - | `9999px` | - |
| **카드** | `16 / 9` | `1rem` | - |
| **마름모** | `1 / 1` | - | `polygon(50% 0, 100% 50%, 50% 100%, 0 50%)`|

#### 💻 실전 코드
```css
/* 반응형 이미지 썸네일 */
.thumbnail {
  aspect-ratio: 16 / 9; /* 비율 유지 */
  width: 100%;
  object-fit: cover; /* 이미지가 비율에 맞춰 잘리도록 */
  border-radius: 1rem;
}

/* 가장 많이 쓰는 알약 버튼 */
.btn-pill {
  padding: 0.6rem 1.2rem;
  border-radius: 9999px; /* 충분히 큰 값으로 항상 완벽한 반원 보장 */
  width: fit-content;
}
```

---

## 6. 🔄 논리적 속성 공식 (Logical Properties)

> **공식: "`left`/`right` 대신 `inline`, `top`/`bottom` 대신 `block`을 사용하라."**

다국어 지원(RTL) 시 레이아웃이 자동으로 전환되어 유지보수성이 극대화됩니다.

| 물리적 속성 (Physical) | 논리적 속성 (Logical) | 설명 |
| :--- | :--- | :--- |
| `margin-left` | `margin-inline-start` | 글이 시작되는 방향의 바깥 여백 |
| `padding-right` | `padding-inline-end` | 글이 끝나는 방향의 안쪽 여백 |
| `border-top` | `border-block-start` | 블록이 시작되는 위쪽 테두리 |
| `width` | `inline-size` | 인라인(텍스트) 방향의 크기 |
| `height` | `block-size` | 블록(단락) 방향의 크기 |

#### 💻 실전 코드
```css
.box {
  /* 수평 중앙 정렬의 현대적 방식 */
  margin-inline: auto;

  /* 상하 패딩 */
  padding-block: 2rem;

  /* 글 시작 방향에만 테두리 */
  border-inline-start: 4px solid var(--primary);
}
```

---

## 7. ✨ 모던 셀렉터 활용법 (Modern Selectors)

> **공식: `:is()`로 중복을 줄이고, `:where()`로 우선순위를 낮추고, `:has()`로 부모를 선택하라."**

| 셀렉터 | 설명 | 실전 예제 |
| :--- | :--- | :--- |
| `:is(h1, h2, h3)` | 괄호 안의 어떤 요소와도 일치. 셀렉터 중복 제거. | `.card :is(h1, h2, p) { margin-block-end: 0.5rem; }` |
| `:where(h1, h2)` | `:is`와 동일하나, **명시도(Specificity)가 0**. | `header :where(a) { color: inherit; }` (다른 링크 스타일 덮어쓰기 방지) |
| `:has(> .icon)`| 특정 자식을 가진 부모 요소를 선택. | `a:has(> img) { padding: 0; }` (이미지를 가진 링크는 패딩 없음) |
| `:not()` | 특정 조건 제외. | `a:not([class]) { text-decoration: underline; }` (클래스 없는 링크에만 밑줄) |

---

## 🚀 2026 권장 프로퍼티 정렬 순서 (Standard Order)

코드를 읽고 수정하는 속도를 높여주는 '관심사 분리' 기반 정렬 규칙입니다.

1.  **컨테이너 제어**: `@container`, `container-type`, `container-name`
2.  **위치 및 레이아웃**: `position`, `inset` (`top`, `right`, `bottom`, `left`), `z-index`, `display`, `flex`, `grid`...
3.  **박스 모델**: `width`, `height`, `margin`, `padding`, `border`, `box-sizing`
4.  **배경 및 시각 효과**: `background`, `color`, `box-shadow`, `opacity`, `filter`, `clip-path`
5.  **타이포그래피**: `font-family`, `font-size`, `font-weight`, `line-height`, `text-align`...
6.  **전환 및 애니메이션**: `transition`, `animation`, `transform`
7.  **기타**: `cursor`, `overflow`, `user-select`...

---

💡 **한 줄 총정리**
> **"전체 틀은 Grid, 부분은 Flex, 독립 부품은 Container로 짜고, 색상은 OKLCH로 정의하며 `light-dark()`로 테마를 입힌다. 여백은 논리적 속성과 `rem`으로 주고, 상태 변화는 `color-mix()`로, 셀렉터는 `:is()`와 `:has()`로 간결하게 관리하라."**