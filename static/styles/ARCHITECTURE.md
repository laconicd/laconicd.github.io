---
# 🎨 Pure CSS Architecture Guide (2026) - Final Edition

이 가이드는 **[그릇]**, **[성질]**, **[부품]**, **[환경 규칙]**, **[상태]**, **[기능]**의 역할을 엄격히 분리하여 조립하기 위해 작성되었습니다.
---

## 1. 접두사 규칙 (Prefix Convention)

| 접두사    | 타입          | 대상                 | 핵심 질문 (1인칭 테스트)                           |
| --------- | ------------- | -------------------- | -------------------------------------------------- |
| **`l-`**  | **Layout**    | **부모** (Container) | "내 안에 들어올 자식들을 **어디에 배치할까?**"     |
| **`u-`**  | **Utility**   | **자기 자신** (Item) | "나는 이 구역에서 **어떤 성질**을 가질까?"         |
| **`c-`**  | **Component** | **완성형 부품**      | "내가 직접 **부품들을 하나하나 조립**하는가?"      |
| **`s-`**  | **Scope**     | **환경 규칙 묶음**   | "클래스 없는 **일반 태그들이 쏟아지는 구역**인가?" |
| **`is-`** | **State**     | **상태**             | "현재 **어떤 상태**(활성, 오류 등)에 있는가?"      |
| **`js-`** | **JS Hook**   | **기능 연결**        | "스타일 없이 **JS 동작**만을 위한 연결고리인가?"   |

---

## 2. 상세 가이드

### 🟢 Layout (`l-`) - `layout.css`

- **역할:** 요소 간의 관계, 간격, 배치 구조 결정.
- **예제:** `.l-stack`, `.l-cluster`, `.l-grid`.

### 🔵 Utility (`u-`) - `utilities.css`

- **역할:** 개별 요소의 본질적 성질 결정.
- **예제:** `.u-fixed` (너비 고정), `.u-fill` (공간 점유).

### 🔴 Component (`c-`) - `components.css`

- **역할:** 특정한 디자인 정체성을 가진 독립적 부품. (직접 조립하는 영역)
- **예제:** `.c-card`, `.c-badge`, `.c-button`.

### 🟣 Scope (`s-`) - `scopes.css`

- **역할:** 일반 태그들(h1, p 등)을 한꺼번에 묶어서 제어. (마크다운 본문 등)
- **예제:** `.s-post-content`, `.s-dark-theme`.

### 🟡 State (`is-`) - `states.css` (또는 각 파일 하단)

- **역할:** 자바스크립트나 사용자 상호작용에 의해 **변하는 모습**을 정의.
- **특징:** 반드시 다른 클래스(`c-`, `l-`, `u-`)와 결합하여 사용합니다. 단독 스타일링은 지양합니다.
- **예제:** `.is-active` (활성화), `.is-loading` (로딩 중), `.is-error` (오류 발생).

### ⚪ JavaScript Hook (`js-`) - (CSS 설정 금지)

- **역할:** 자바스크립트가 DOM 요소를 찾기 위한 **순수한 탐색용 이름표**.
- **특징:** **이 클래스에는 절대 CSS 스타일을 부여하지 않습니다.** 스타일이 바뀌어 클래스명이 변경되어도 기능이 깨지지 않게 보호합니다.
- **예제:** `.js-modal-open`, `.js-like-count`, `.js-search-input`.

---

## 3. 레이아웃 조립 원칙 (Layout Composing)

레이아웃 클래스(`l-`)는 서로 다른 `display` 속성을 가질 수 있으므로, 혼합 시 주의가 필요합니다.

- **원칙 1: 기본 엔진 유지** - `l-stack`(세로), `l-cluster`(가로)는 Flexbox를 기반으로 "흐름"을 담당합니다.
- **원칙 2: 충돌 방지** - `l-stack`과 `l-center`(Grid)를 한 요소에 동시에 쓰지 않습니다. 대신 정렬 유틸리티(`u-items-center` 등)를 조합합니다.
- **원칙 3: 유틸리티 활용** - 세밀한 정렬은 `u-` 클래스로 보완합니다. (예: `l-stack u-items-center`)

---

## 4. 클래스 판별 FAQ

**Q. 컴포넌트(`c-`)와 스코프(`s-`)의 차이가 무엇인가요?**

> - **컴포넌트:** 클래스가 붙은 특정 부품들을 내가 의도한 대로 직접 조립한 것. (예: 뱃지가 포함된 카드)
> - **스코프:** 클래스가 없는 일반 태그들이 자유롭게 들어오는 구역에 환경 규칙을 부여한 것. (예: 마크다운 글 본문)

**Q. `is-`와 `js-`를 왜 구분해야 하나요?**

> 디자인(`is-active`)과 기능(`js-toggle`)을 분리하기 위해서입니다. 디자인 수정을 위해 클래스명을 바꿔도 자바스크립트 코드는 수정할 필요가 없도록 만들기 위함입니다.

---

## 4. 최종 실전 조립 예시 (All-in-One)

```html
<div class="l-cluster">
  <article class="c-card l-stack is-active">
    <header class="l-cluster" style="justify-content: space-between;">
      <span class="c-badge">Notice</span>
      <button class="c-btn-icon js-close-btn">X</button>
    </header>

    <div class="s-card-body l-stack">
      <h3>아키텍처 가이드 완료</h3>
      <p>모든 접두사를 포함한 최종 조립 예제입니다.</p>
    </div>

    <footer class="l-cluster">
      <span class="u-text-small">조회수: <span class="js-view-count">0</span></span>
    </footer>
  </article>
</div>
```

---

### 💡 최종 유지보수 원칙

> **"배치는 `l-`, 성질은 `u-`, 디자인은 `c-`, 환경은 `s-`, 상태는 `is-`, 기능은 `js-`가 책임진다."**
