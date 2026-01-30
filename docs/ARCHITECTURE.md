---
# 🎨 Pure CSS Architecture Guide (2026) - Functional Edition

이 가이드는 **[그릇(l-)]**, **[성질(u-)]**, **[부품(c-)]**, **[움직임(a-)]**, **[환경 규칙]**, **[상태(is-)]**, **[기능(js-)]**의 역할을 엄격히 분리하여 조립하기 위해 작성되었습니다.

---

## 0. 핵심 전략 (Core Strategy)

### 📱 Mobile-First
모든 스타일은 **모바일(작은 화면)**을 기준으로 먼저 작성합니다.
- 미디어 쿼리는 점진적으로 큰 화면으로 확장할 때만 사용합니다 (`min-width`).
- `@media (max-width: ...)`의 사용을 최소화하고, 기본 스타일이 곧 모바일 스타일이 되도록 합니다.

### 🧩 Component-First
UI는 독립적이고 재사용 가능한 **컴포넌트** 단위로 개발합니다.
- **Template:** `templates/partials/c-name.html` 또는 명확한 명칭의 파셜로 분리.
- **Style:** `static/css/components/name.css`에 1:1 매칭.
- **Naming:** 반드시 `c-` 접두사를 사용하며, 내부 요소는 BEM 패턴(`c-name__element`)을 권장합니다.

---

## 1. 접두사 규칙 (Prefix Convention)

| 접두사    | 타입          | 대상                 | 핵심 질문 (1인칭 테스트)                           |
| --------- | ------------- | -------------------- | -------------------------------------------------- |
| **`l-`**  | **Layout**    | **구조 엔진**        | "자식들을 어디에 배치할지 결정하는 **그리드 엔진**인가?" |
| **`u-`**  | **Utility**   | **성질 & 프리셋**    | "나는 이 구역에서 **어떤 디자인적 성질(간격, 선, 배경)**을 가질까?" |
| **`c-`**  | **Component** | **완성형 부품**      | "내가 직접 **부품들을 하나하나 조립**하는가?"      |
| **`a-`**  | **Animation** | **움직임** (Motion)  | "나는 어떤 **부드러운 움직임**을 가질까?"          |
| **`s-`**  | **Scope**     | **환경 규칙 묶음**   | "클래스 없는 **일반 태그들이 쏟아지는 구역**인가?" |
| **`is-`** | **State**     | **상태**             | "현재 **어떤 상태**(활성, 오류 등)에 있는가?"      |
| **`js-`** | **JS Hook**   | **기능 연결**        | "스타일 없이 **JS 동작**만을 위한 연결고리인가?"   |

---

## 2. Unit & Layout Principles (Updated 2026)
- **Fluid Units:** 모든 크기 정의에는 `rem`(루트 기준)과 `em`(부모 기준)을 우선합니다.
- **Viewport:** 동적 환경에 대응하기 위해 vh 대신 `dvb`, `dvi` 등 논리적 뷰포트 단위를 사용합니다.
- **No Hardcoding:** 레이아웃의 핵심 수치(예: 3.5rem, 4.5rem)나 반복되는 값은 직접 하드코딩하지 않고 `static/css/init/properties.css`에 변수로 정의하여 관리합니다.
- **Fixed-width Content:** 헤더 및 푸터의 배경은 전체 너비(100%)를 갖지만, 내부 요소는 `u-container`를 통해 특정 너비(예: 70rem) 내에 가둡니다.
- **B-Plan UI:** 검색 기능은 공간 효율성을 위해 아이콘(돋보기) 기반으로 제공하며, 클릭 시 상호작용합니다.

---

## 3. 상세 가이드

### 🟢 Layout (`l-`) - `static/css/layout/blueprint.css`
- **역할:** 순수하게 **'배치 구조'**만 결정합니다. 이름(header, main 등)에 의존하지 않고 변수로 작동합니다.
- **핵심 엔진:** `.l-blueprint` (Auto-placement 지원)
- **작동 원리:** 부모는 구조(`--areas`)를 정의하고, 자식은 자신의 위치(`--area`)를 인자로 전달하거나 순서대로 자동 배치됩니다.

### 🔵 Utility (`u-`) - `static/css/utilities/utilities.css`
- **역할:** 개별 요소의 공통적 디자인 성질(테두리, 배경, 정렬) 및 레이아웃 프리셋 결정.
- **현대적 표준:** 논리적 속성(`margin-inline`, `padding-block`)과 `oklch()` 컬러 시스템을 사용합니다.
- **레이아웃 프리셋:** `.u-layout-between`, `.u-layout-stack`, `.u-layout-cluster` 등을 조합해 사용합니다.
  - `.u-layout-between`: 양 끝 배치를 위한 프리셋 (`--cols: auto auto; --justify: space-between;`).
- **핵심 지침:** 패딩(`padding-block`)이나 마진처럼 변수로 제어 가능한 속성은 전용 유틸리티 클래스를 만들기보다 **인라인 스타일에서 직접 변수를 참조**(`style="padding-block: var(--ui-space-xl)"`)하는 것을 권장합니다. 이는 클래스 비대화를 막고 HTML의 가독성을 높입니다.

---

## 4. 레이아웃 조립 원칙 (Functional Composing)

레이아웃은 더 이상 고정된 클래스명이 아니라, **엔진 + 인자(Variable)**의 조합으로 완성됩니다.

1.  **배치와 디자인의 분리:** `l-blueprint`에는 절대 패딩이나 배경색을 넣지 않습니다. 이들은 `u-` 클래스나 인라인 스타일이 담당합니다.
2.  **슬롯 기반 배치:** 자식 요소는 클래스 없이 `style="--area: ..."` 만으로 배치를 결정할 수 있습니다.
3.  **유틸리티 우선 (Utility-First Layout):** 레이아웃 구성 시 가능한 한 `static/css/utilities/utilities.css`에 정의된 프리셋 클래스(`.u-layout-*`)를 우선적으로 사용합니다. 인라인 스타일을 통한 커스텀 레이아웃(`--areas` 등) 정의는 기존 유틸리티로 구현이 불가능한 특수한 경우에만 제한적으로 사용합니다.
4.  **가독성 균형:** 패딩 변수 할당 등 디자인 성질은 인라인 스타일을 권장하지만, 구조를 결정하는 레이아웃 인자들은 시스템의 일관성을 위해 유틸리티 클래스에 위임합니다.

---

## 6. 최종 실전 조립 예시 (All-in-One)

```html
<!-- 1. 블루프린트 엔진(기본 3단 구조) + 화면 높이 조립 -->
<div class="l-blueprint u-h-screen">
  
  <!-- 2. 슬롯 지정 + 디자인(보더) 조립 + 패딩(변수) 조립 -->
  <header style="--area: header; padding-block: var(--ui-space-lg)" class="u-border-b">
    <!-- 반응형이 필요한 구조는 프리셋 클래스 사용 -->
    <div class="l-blueprint u-layout-between">
       <h1 style="--area: start;">Brand</h1>
       <nav style="--area: end;">...</nav>
    </div>
  </header>

  <!-- 3. 슬롯 지정 + 본문 폭 제한 + 표준 패딩 조립 -->
  <main style="--area: main; padding-block: var(--ui-space-xl)" class="u-container s-content">
    <article class="c-card a-subtle-lift">
      본문 내용
    </article>
  </main>

  <footer style="--area: footer; padding-block: var(--ui-space-xl)" class="u-bg-faint u-text-center">
    푸터 내용
  </footer>
</div>
  </header>

  <!-- 3. 슬롯 지정 + 본문 폭 제한 + 표준 패딩 조립 -->
  <main style="--area: main; padding-block: var(--ui-space-xl)" class="u-container s-content">
    <article class="c-card a-subtle-lift">
      본문 내용
    </article>
  </main>

  <footer style="--area: footer; padding-block: var(--ui-footer-padding)" class="u-bg-faint u-text-center">
    푸터 내용
  </footer>
</div>

---

### 💡 매칭 원칙 (The Matching Principle)
- **이름의 자율성:** `start`, `end`, `h`, `m` 등 모든 이름은 사용자가 정의하는 **임시 토큰**입니다.
- **연결 메커니즘:** 부모의 `--areas` 지도에 적힌 이름과 자식의 `--area` 이름표가 **서로 일치하는 순간** 배치가 완성됩니다.
- **안정성:** 이름을 명시하면 HTML 순서가 바뀌거나 요소가 동적으로 추가/삭제되어도 설계도상의 위치가 절대 변하지 않습니다.

---

## 6. 최종 실전 조립 예시 (All-in-One)

```html
<!-- 1. 블루프린트 엔진(기본 3단 구조) + 화면 높이 조립 -->
<div class="l-blueprint u-h-screen">
  
  <!-- 2. 슬롯 지정 + 디자인(보더, 패딩) 유틸리티 조립 -->
  <header style="--area: header;" class="u-border-b u-p-header">
    <!-- 반응형이 필요한 구조는 프리셋 클래스 사용 -->
    <div class="l-blueprint u-layout-between u-align-center">
       <h1 style="--area: start;">Brand</h1>
       <nav style="--area: end;">...</nav>
    </div>
  </header>

  <!-- 3. 슬롯 지정 + 본문 폭 제한 + 표준 패딩 조립 -->
  <main style="--area: main;" class="u-container u-p-main s-content">
    <article class="c-card a-subtle-lift">
      본문 내용
    </article>
  </main>

  <footer style="--area: footer;" class="u-bg-faint u-p-footer u-text-center">
    푸터 내용
  </footer>
</div>
```

---

## 9. Mobile Interaction Strategy (Anti-Sticky Hover)

모바일 환경에서의 호버(`:hover`)는 잔상이 남거나 의도치 않은 동작을 유발합니다. 이 프로젝트는 마우스 기반의 풍부한 경험과 터치 기반의 안정적인 경험을 분리하여 제공합니다.

### 9.1 Media Query Level 4: Hover Detection
가장 깔끔한 해결책은 기기가 호버를 지원하는지 CSS가 직접 판단하게 하는 것입니다.

```css
/* ✅ 호버 지원 기기 (데스크탑 등) */
@media (hover: hover) {
  .c-card:hover {
    transform: translateY(-10px);
    box-shadow: var(--ui-shadow-hover);
  }
}

/* ✅ 호버 미지원 기기 (모바일 등) 전용 스타일 */
@media (hover: none) {
  .c-card:active {
    scale: 0.98; /* 터치 시 시각적 피드백 */
    background: var(--ui-color-accent);
  }
}
```

### 9.2 Interaction Alternatives
*   **`:active` & `:focus-within`:** 터치하는 순간(`:active`)과 컨테이너 내부가 포커스되었을 때(`:focus-within`)를 활용하여 즉각적인 피드백을 제공합니다.
*   **Scroll-driven Animation:** 호버 대신 요소가 화면 중앙에 들어올 때 애니메이션을 트리거하여 역동성을 부여합니다. (Intersection Observer 또는 CSS `view-timeline` 활용)
*   **Visual Transitions:** 햅틱 피드백을 대신할 수 있는 탭 리플(Tap Ripple), 프로그레시브 블러(Progressive Blur) 등을 통해 상호작용성을 대체합니다.

### 9.3 Sticky Hover Prevention
모바일에서 사용자가 터치한 후 다른 곳을 터치하기 전까지 스타일이 유지되는 **Sticky Hover** 현상을 방지하기 위해, 모든 호버 스타일은 반드시 `@media (hover: hover)` 블록 내부에서 정의되어야 합니다.

---

## 10. Scroll-driven Animations-first Strategy

이 프로젝트는 자바스크립트의 스크롤 이벤트 리스너를 지양하고, 브라우저 네이티브인 **CSS Scroll-driven Animations**를 우선적으로 사용합니다. 이는 특히 매거진 스타일의 동적인 레이아웃 전환과 성능 최적화에 핵심적입니다.

### 10.1 View Timeline & Animation Range
요소가 뷰포트에 진입하거나 나갈 때 발생하는 애니메이션은 `view-timeline`을 사용합니다.
- **`view-timeline-name`**: 애니메이션의 타임라인 이름을 정의합니다.
- **`animation-range`**: 애니메이션이 시작되고 끝나는 지점(예: `entry 20% cover 50%`)을 정밀하게 제어합니다.

### 10.2 Use Cases (Editorial Effects)
*   **Parallax Headers:** 헤더 이미지가 스크롤에 따라 미세하게 움직이는 효과.
*   **Sticky Reveal:** 스크롤 시 아래에 숨겨져 있던 요소가 부드럽게 나타나는 잡지 특유의 전환.
*   **Progressive Blur:** 스크롤 위치에 따라 배경의 블러 강도가 변하는 시각적 깊이감 구현.
*   **Reading Progress:** 페이지 상단의 읽기 진행 바를 CSS만으로 구현.

### 10.3 Performance & Accessibility
*   **Main Thread Free:** CSS 애니메이션은 컴포지터 스레드에서 실행되므로 메인 스레드 부하가 없습니다.
*   **Reduced Motion:** `prefers-reduced-motion` 미디어 쿼리를 사용하여 애니메이션을 비활성화하거나 간소화하는 설정을 반드시 포함해야 합니다.

---

### 💡 최종 유지보수 원칙

> **"배치는 `l-blueprint` 엔진이, 구조 정의는 `--areas` 변수가, 위치 선택은 `--area` 변수가, 디자인 성질은 `u-` 유틸리티가 책임진다. 복잡한 구조는 클래스보다 인라인 지도가 더 명확하다."**

**[절대 금기 사항]**
- 레이아웃을 위해 HTML 태그에 직접 `display: flex`, `gap`, `justify-content` 등을 하드코딩하는 행위.
- `l-blueprint` 엔진을 우회하여 임의의 레이아웃 클래스를 생성하는 행위.
- 모든 배치는 반드시 Blueprint 엔진의 매칭 원칙(`--areas` <-> `--area`)을 통해 구현되어야 합니다.
- 작업 후에는 반드시 아키텍처 준수 여부를 확인하는 검수 단계를 포함해야 합니다.

---

## 7. Modern Animation Principle (@property)

이 프로젝트는 변수 기반 애니메이션의 정밀도와 강력한 캡슐화를 위해 CSS Houdini의 `@property`를 전략적으로 활용합니다.

### 7.1 @property Mandatory & Strict-Typing Strategy

이 프로젝트는 모든 변수를 `@property`로 정의하고, **와일드카드(`*`) 대신 가능한 가장 엄격한 타입을 지정**하는 것을 원칙으로 합니다. 또한 `initial-value`를 사용하여 시스템의 기본 스타일을 보장합니다.

| 구분 | 추천 방식 | 핵심 이유 | 주요 예시 |
| :--- | :--- | :--- | :--- |
| **대부분의 변수** | **Strict Typed `@property`** | **유효성 검증** 및 **최적의 렌더링 성능** | `--area`, `--ui-color-*` |
| **복잡한 구문** | **Wildcard `*`** | 현재 CSS syntax로 정의 불가능한 경우 | `--cols`, `--rows` |
| **참조형 변수** | **일반 Variable** | `initial-value`에서 **`var()` 사용 불가** 한계 극복 | `--ui-color-faint` |

### 7.2 Typed Variables vs. Raw Strings
일반적인 CSS 변수는 단순한 텍스트 치환 방식입니다. 반면 `@property`로 선언된 변수는 브라우저에게 데이터의 정체(타입)를 알려줍니다.
- **Raw Variable:** `--size: 10px;` (브라우저는 이것이 단순한 글자인지 숫자인지 모름)
- **Typed Property:** `@property --size { syntax: '<length>'; ... }` (브라우저가 '길이' 데이터로 인식)

### 7.3 Animation Hook
변수(Custom Property)를 `transition`이나 `animation`의 대상으로 삼으려면 반드시 타입이 정의되어야 합니다. 타입이 정의되어야만 브라우저가 값의 변화(예: 색상의 채도 변화나 투명도 변화)를 부드럽게 계산(Interpolate)할 수 있습니다.

### 7.4 Registry Pattern (Properties vs. Variables)
- **`static/css/init/properties.css` (Registry & Default Store):** 모든 변수의 정의와 **기본 디자인 값(`initial-value`)**을 담당합니다. 시스템의 표준 토큰은 이곳에 위치합니다.
- **`static/css/init/variables.css` (Exception Store):** `initial-value`로 표현할 수 없는 복잡한 계산식이나 변수 간 참조가 필요한 경우에만 예외적으로 사용합니다.

### 7.5 Inheritance Control (Encapsulation)
`inherits: false` 설정을 통해 부모 요소의 변수 값이 자식에게 전파되는 것을 차단할 수 있습니다. 이는 특히 `l-blueprint`와 같은 레이아웃 엔진에서 중첩된 구조 간의 변수 충돌을 방지하는 핵심 메커니즘으로 사용됩니다.

### 7.6 Supported Syntax Types
`@property`의 `syntax` 속성에는 다음과 같은 타입들을 지정할 수 있습니다.
- **기본 타입:** `<length>`, `<number>`, `<percentage>`, `<length-percentage>`, `<color>`, `<integer>`
- **물리/시간 타입:** `<angle>`, `<time>`, `<resolution>`
- **구조/복합 타입:** `<image>`, `<url>`, `<transform-function>`, `<transform-list>`, `<custom-ident>`
- **기타:** `*` (모든 토큰 허용, 단 보간은 불가능)

## 8. Universal UI Contract

이 프로젝트는 모든 UI 요소가 공통의 변수 인터페이스를 통해 소통하는 **'범용 UI 계약'** 원칙을 따릅니다.

### 8.1 Behavior-based Naming
특정 컴포넌트에 종속된 이름 대신, UI의 물리적 성질과 행동을 기준으로 이름을 정의합니다.
- `oklch(from var(--ui-color-ink) l c h / var(--ui-opacity-faint))` : 텍스트(잉크) 색상의 농도를 조절하여 배경이나 강조 효과를 생성합니다.
- `--ui-lift-y`, `--ui-scale`, `--ui-rotation` : 모든 요소의 상호작용 애니메이션을 제어하는 범용 인터페이스입니다.
- `--ui-duration-base`, `--ui-ease-bounce` : 시스템 전체의 애니메이션 리듬과 가속도를 결정하는 모션 계약입니다.
- `--ui-shadow-base` : `ui-shadow-y`, `ui-shadow-blur`, `ui-shadow-opacity`를 조합하여 일관된 깊이감을 제공하는 그림자 계약입니다.
- `--ui-z-drawer`, `--ui-z-fab` : 매직 넘버를 제거하고 레이어 순서를 체계적으로 관리하는 레이어링 계약입니다.

### 8.2 Zero-Redundancy Layout
`l-blueprint` 엔진은 `@property`로 정의된 `--area`를 사용하여 상속을 제어합니다. 자식 요소는 별도의 상속 차단 로직 없이도 독립적인 배치 정보를 가질 수 있으며, 부모는 오직 `grid-area: var(--area)`라는 계약을 통해 자식을 배치합니다.
