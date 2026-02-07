# CSS 컨벤션 가이드

본 프로젝트는 유지보수가 쉽고 확장 가능한 스타일 작성을 위해 다음 지침을 엄격히
준수합니다.

## 1. CUBE CSS 방법론 준수

모든 CSS는 [CUBE CSS](https://cube.fyi/) 방법론에 따라 작성합니다.

- **Composition (구성)**: 레이아웃의 큰 틀을 잡는 역할을 하며, 시각적
  스타일보다는 공간 배분에 집중합니다. (예: `.flow`, `.cluster`, `.grid`)
- **Utility (유틸리티)**: 단일 책임을 갖는 클래스로, 반복되는 스타일을
  정의합니다. (예: `.margin-top-600`, `.text-step-1`)
- **Block (블록)**: 독자적인 컴포넌트 단위입니다.
- **Exception (예외)**: 데이터 상태나 특정 조건에 따른 변화를 처리합니다.
  `data-state`나 `data-type` 같은 data 속성을 활용합니다.

## 2. 논리적 속성 (Logical Properties) 사용

물리적 방향(top, bottom, left, right) 대신 논리적 방향(block, inline)을 사용하는
속성을 우선적으로 사용합니다. 이는 다국어 대응 및 쓰기 방향 변화에 유연하게
대처하기 위함입니다.

- `width`, `height` → `inline-size`, `block-size`
- `margin-top`, `margin-right` → `margin-block-start`, `margin-inline-end`
- `padding-left`, `padding-bottom` → `padding-inline-start`, `padding-block-end`
- `border-left` → `border-inline-start`
- `text-align: left` → `text-align: start`

## 3. 최신 CSS 문법 적극 활용

브라우저 지원 범위를 고려하되, 다음의 최신 CSS 기능을 적극적으로 사용하여 코드의
가독성과 제어력을 높입니다.

- **`@scope`**: 스타일의 범위를 특정 컴포넌트 내부로 제한하여 스타일 오염을
  방지합니다.
- **`@layer`**: CSS 우선순위(Cascade)를 명시적으로 관리합니다. (예: `base`,
  `layouts`, `components`, `utilities` 레이어 구분)
- **`:has()`**: 부모 선택자나 이전 형제 요소의 상태에 따른 스타일링을
  수행합니다.
- **`:is()` 및 `:where()`**: 선택자 그룹화 및 명시도(Specificity) 관리에
  활용합니다. (`:where()`는 명시도를 0으로 유지하고 싶을 때 사용)
- **Container Queries (`@container`)**: 뷰포트 기준이 아닌 부모 요소의 크기에
  반응하는 디자인을 구현합니다.
- **`@property`**: 커스텀 속성에 타입을 지정하여 그라데이션이나 특정 수치 값의
  부드러운 애니메이션 보간(Interpolation)을 구현합니다.
- **Scroll-driven Animations**: `scroll-timeline`, `view-timeline` 등을 사용하여
  스크롤 위치에 반응하는 선언적 애니메이션을 구현합니다.
- **Modern Scroll Features**: `scroll-snap`, `scroll-behavior`,
  `overscroll-behavior` 등을 적극 활용하여 네이티브에 가까운 스크롤 경험을
  제공합니다.
- **View Transition API**: 페이지 전환이나 요소의 상태 변경 시 부드러운
  애니메이션 효과를 제공하기 위해 `@view-transition` 및 관련 API를 활용합니다.
- **Modern Color & Lighting (Specular)**:
  - `oklch()`, `color-mix()`, **Relative Color Syntax**를 사용하여 지각적으로
    일관된 색상 체계와 하이라이트(Specular) 효과를 구현합니다.
  - 하드코딩된 투명도 대신
    `color-mix(in oklch, var(--color), transparent 20%)`와 같은 방식을
    지향합니다.
- **Speculation Rules API**: 페이지 전환 성능 극대화를 위해 `prefetch` 및
  `prerender`를 제어하는 Speculation Rules를 적극적으로 활용하여
  즉각적인(instant) 페이지 로딩을 구현합니다.

## 4. 단위 및 타이포그래피 (Units)

절대 단위인 `px` 사용을 지양하고, 유연한 레이아웃과 접근성을 위해 상대 단위를
사용합니다.

- **`rem`**: 루트 폰트 사이즈 기준 단위로, 일반적인 텍스트 크기 및 레이아웃
  간격에 사용합니다.
- **`em`**: 부모 요소의 폰트 사이즈 기준 단위로, 특정 컴포넌트 내부에서 비례적인
  크기 조절이 필요한 경우 사용합니다.
- **`dvi` / `dvh`**: 동적 뷰포트(Dynamic Viewport) 단위로, 모바일 브라우저의 UI
  요소(주소창 등) 변화에 대응해야 하는 전체 화면 레이아웃에 사용합니다.
- **`svh` / `lvh`**: 상황에 따라 최소/최대 뷰포트 높이가 고정되어야 하는 경우
  적절히 선택하여 사용합니다.

## 5. 기타 원칙

- 변수는 CSS Custom Properties(`--var-name`)를 사용하여 테이밍 및 토큰화합니다.
- 명시도 경쟁을 피하기 위해 가급적 낮은 명시도를 유지합니다.
- 하드코딩된 수치 대신 사전에 정의된 디자인 토큰(Spacing, Color, Typography)을
  사용합니다.

## 6. 디자인 토큰 사용 (Design Token Usage)

프로젝트 전반의 일관된 디자인과 손쉬운 유지보수를 위해
`styles/base/tokens.css`에 정의된 CSS Custom Properties(디자인 토큰)를
적극적으로 활용합니다.

- **원칙**: 모든 스타일 값(색상, 간격, 폰트, 그림자, 애니메이션 등)은 가능한 한
  디자인 토큰을 통해 참조합니다. 하드코딩된 리터럴 값을 직접 사용하는 것을
  지양합니다.
- **예시**:
  - `padding: 1rem;` 대신 `padding: var(--space-md);`
  - `color: #00CC99;` 대신 `color: var(--color-primary);`
  - `border-radius: 0.25rem;` 대신 `border-radius: var(--radius-md);`
- **테마 적용**: `oklch` 기반의 색상 토큰은
  `:root:has(input.theme-controller[value="lofi"]:checked)`와 같이 테마 선택자에
  의해 동적으로 변경됩니다. 테마 전환이 필요한 요소에는 `var(--color-...)`
  형태의 색상 토큰을 사용합니다.
- **세분화된 토큰**: Spacing, Typography, Color, Border, Radius, Shadow,
  Animation 등 모든 디자인 요소에 대해 세분화된 토큰을 활용하여 스타일의 예측
  가능성과 재사용성을 높입니다.
