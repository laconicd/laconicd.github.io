# CSS 컨벤션 가이드

본 프로젝트는 유지보수가 쉽고 확장 가능한 스타일 작성을 위해 CUBE CSS 방법론을
준수하며, 최신 CSS 표준 기술을 활용합니다.

## 1. CUBE CSS 방법론

모든 스타일은 [CUBE CSS](https://cube.fyi/) (Composition, Utility, Block,
Exception) 체계에 따라 명시적 레이어로 관리합니다. **접두사(Prefix)를 사용하지
않는 순수 클래스명**을 지향합니다.

### 1.1 Composition (구성)

레이아웃의 큰 틀을 잡는 알고리즘입니다. 시각적 스타일(색상, 테두리 등)을
배제하고 공간 배분에만 집중합니다.

- **예시**: `.stack`, `.cluster`, `.grid`, `.sidebar`, `.switcher`, `.wrapper`
- **원칙**: 자식 요소 간의 간격과 흐름을 제어합니다.

### 1.2 Utility (유틸리티)

단일 책임을 갖는 클래스로, 디자인 토큰을 적용하여 미세 조정합니다.

- **예시**: `.margin-block-start-md`, `.text-step-1`, `.bg-primary`,
  `.opacity-50`
- **추출 규칙**: 유틸리티로 먼저 작성하되, **동일한 유틸리티 조합이 3회 이상
  반복**될 경우 이를 **Block**으로 승격하거나 **Composition**으로 추상화합니다.

### 1.3 Block (블록)

독자적인 컴포넌트 단위입니다. 특정 맥락에서만 의미를 갖는 고유한 스타일을
정의합니다.

- **예시**: `.button`, `.post-card`, `.navbar`
- **원칙**: 내부 구조가 복잡하거나 고유한 시각적 아이덴티티가 필요할 때
  사용합니다.

### 1.4 Exception (예외)

데이터 상태나 특정 조건에 따른 변화를 처리합니다.

- **방식**: `[data-state="active"]`, `[data-type="featured"]` 등 속성 선택자를
  활용하여 기존 블록의 스타일을 확장합니다.

## 2. 레이어 아키텍처 (@layer)

우선순위(Cascade) 충돌을 방지하기 위해 CSS 레이어를 명시적으로 구분합니다.
리스트의 뒤로 갈수록 명시성이 높습니다.

```css
@layer reset, base, composition, blocks, exceptions, utilities;
```

1. **reset**: 브라우저 기본 스타일 초기화
2. **base**: 전역 타이포그래피, 디자인 토큰 적용
3. **composition**: 레이아웃 구조 (접두사 없음)
4. **blocks**: 개별 컴포넌트
5. **exceptions**: 상태 기반 스타일
6. **utilities**: 불변의 도구 (최상위 우선순위)

## 3. 논리적 속성 (Logical Properties)

물리적 방향(top, right, bottom, left) 대신 논리적 방향(block, inline)을 사용하는
속성을 사용합니다.

- `width` / `height` → `inline-size` / `block-size`
- `margin-top` / `margin-bottom` → `margin-block-start` / `margin-block-end`
- `margin-left` / `margin-right` → `margin-inline-start` / `margin-inline-end`
- `padding-*` → `padding-block-*` / `padding-inline-*`
- `border-left` → `border-inline-start`
- `text-align: left` → `text-align: start`

## 4. 디자인 토큰 및 단위

- **단위**: 절대 단위(`px`) 대신 상대 단위(`rem`, `em`) 및 뷰포트 단위(`dvh`,
  `dvb`)를 사용합니다.
- **변수**: `styles/base/tokens.css`에 정의된 CSS Custom Properties를 필수적으로
  참조합니다.
- **색상**: `oklch()` 및 `color-mix()`를 사용하여 지각적으로 일관된 색 체계를
  유지합니다.

## 5. 최신 CSS 기능 활용

- **@scope**: 컴포넌트 내부 스타일 캡슐화
- **:has()**: 부모 및 형제 상태 감지
- **Container Queries**: 부모 크기 기반 반응형 디자인
- **View Transition API**: 페이지 전환 애니메이션
- **Scroll-driven Animations**: 스크롤 연동 애니메이션
