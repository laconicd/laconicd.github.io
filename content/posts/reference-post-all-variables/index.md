+++
# [기본 정보]
title = "Reference: All Possible Post Variables"
description = "이 포스트는 블로그 시스템에서 사용할 수 있는 모든 프론트매터 변수와 마크다운 스타일을 보여주기 위한 레퍼런스 가이드입니다."
date = 2026-01-16
updated = 2026-01-16
draft = false
weight = 1

# [분류]
[taxonomies]
categories = ["Guide", "Reference"]
tags = ["Markdown", "Zola", "CSS", "Tutorial"]

# [추가 설정 (page.extra)]
[extra]
# [중요] 대표 이미지는 static/media/posts/[포스트폴더명]/ 하위에 위치해야 합니다.
# 템플릿의 매크로가 자동으로 'static/media/posts/' 경로를 참조합니다.
image = "featured-image.jpg"
author_comment = "이 포스트는 미디어 관리 원칙을 포함하여 작성되었습니다."
+++

이곳은 포스트의 **요약(Summary)** 섹션입니다. `<!-- more -->` 태그 윗부분이 목록 페이지에서 요약으로 노출됩니다.

<!-- more -->

## 1. 이미지 관리 원칙 (중요)

이 블로그의 이미지는 `content/` 폴더가 아닌 별도의 `media` 저장소에서 관리됩니다.

1. **대표 이미지 (Featured Image)**: 
   - 위치: `static/media/posts/reference-post-all-variables/featured-image.jpg`
   - 프론트매터 설정: `extra.image = "featured-image.jpg"`
2. **본문 이미지 (Content Image)**:
   - 본문에서 이미지를 삽입할 때도 동일한 미디어 경로를 참조하는 것이 권장됩니다.

## 2. Typography 및 텍스트 스타일

- **굵은 글씨**와 *기울임꼴*
- ~~취소선~~ 및 `인라인 코드`

## 3. 코드 블록 테스트

```rust
fn main() {
    println!("Hello, Zola!");
}
```

## 4. 인용구 및 리스트

> "배움은 끝이 없으며, 기록은 그 배움을 완성시킨다." - laconicd

### 체크리스트
- [x] 미디어 경로 확인 (`static/media/posts/...`)
- [x] 프론트매터 변수 설정
- [x] 템플릿 매크로 작동 확인

## 5. 결론

이 문서를 복사하여 새로운 포스트를 시작하세요. 이미지를 추가할 때는 반드시 `assets/media/posts/` 하위에 포스트와 동일한 이름의 폴더를 만들고 그 안에 이미지를 넣으세요.

## 6. GitHub Alerts (Callouts)

`config.toml`에서 `github_alerts = true` 설정 시 사용할 수 있는 알림 스타일입니다.

> [!NOTE]
> 유용한 정보를 알릴 때 사용합니다.

> [!TIP]
> 팁이나 권장 사항을 보여줍니다.

> [!IMPORTANT]
> 사용자가 꼭 알아야 할 중요한 내용입니다.

> [!WARNING]
> 주의가 필요한 내용입니다.

> [!CAUTION]
> 위험하거나 부정적인 결과를 초래할 수 있는 내용입니다.

---

## 7. 🎨 2026 현대 CSS 마스터 가이드라인 (v2.3 Final)

이 가이드는 현대 CSS의 핵심 원칙인 **유지보수성, 독립성, 접근성**을 극대화하기 위한 실전 패턴을 집대성한 문서입니다.

### 7.1 🧱 레이아웃 결정 매트릭스 (Layout Decision Matrix)

> **핵심 원칙: "2차원은 Grid, 1차원은 Flexbox"**

| 구분 | 주 사용 기술 | 상황 (WHEN) | 결정적 이유 (WHY) |
| --- | --- | --- | --- |
| **2차원 (2D)** | **Grid** | 페이지 전체 구조, 복잡한 격자 | 가로와 세로를 동시에 제어. |
| **페이지 섹션** | **Subgrid** | 부모 Grid 트랙 상속 | 컴포넌트 간 줄 맞춤 일관성 유지. |
| **1차원 (1D)** | **Flexbox** | 메뉴, 버튼 그룹 등 한 방향 배열 | 한 축을 따라 흐르는 구조에 최적화. |
| **독립 컴포넌트** | **@container** | 부품 단위 독립 반응형 | 부모 요소 크기에 반응(Context 기반). |
| **논리적 방향** | **Logical Prop.** | 여백, 테두리, 크기 지정 | 글쓰기 방향(LTR/RTL) 자동 대응. |

---

### 7.2 📍 배치 및 크기 공식 (Positioning & Sizing)

* **Position**: `Relative`는 기준점, `Absolute`는 유령(공중 부양), `Sticky`는 부모 안의 끈끈이.
* **Sizing**: 글자/외부 간격은 **`rem`**, 컴포넌트 내부 간격은 **`em`**, 가변 크기는 **`clamp()`**.
* **Viewport**: 모바일 주소창을 고려한 실제 가시 영역은 **`dvh`** 사용.

---

### 7.3 🎨 색상 시스템: OKLCH & Interaction

> **공식: "정의는 OKLCH로, 상태 변화는 `color-mix()`로"**

```css
:root {
  /* OKLCH: 사람이 인지하는 밝기가 일정한 표준 색상 모델 (C값은 0.15 이하 권장) */
  --primary: oklch(65% 0.15 250);

  /* light-dark(): 시스템 테마에 자동 대응 */
  --text: light-dark(oklch(20% 0.01 250), oklch(95% 0.01 250));
}

.button:hover {
  /* color-mix: 별도 변수 없이 즉석에서 상태 색상 생성 */
  background-color: color-mix(in oklch, var(--primary), black 10%);
}
```

---

### 7.4 🔄 모션 시스템: 트랜지션 & 애니메이션

> **핵심 원칙: "상태 반응(A→B)은 Transition, 정해진 시나리오는 Animation"**

#### 🧪 5종 모션 황금 비율 변수

```css
:root {
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);    /* 표준: 가장 자연스러운 이동 */
  --ease-in:       cubic-bezier(0, 0, 0.2, 1);      /* 등장: 안으로 빠르게 나타날 때 */
  --ease-out:      cubic-bezier(0.4, 0, 1, 1);      /* 퇴장: 밖으로 빠르게 사라질 때 */
  --ease-bouncy:   cubic-bezier(0.34, 1.56, 0.64, 1); /* 반동: 쫀득하게 튕기는 탄성 */
  --ease-sharp:    cubic-bezier(0.7, 0, 0.3, 1);    /* 강조: 묵직하다 채찍처럼 가속 */
}
```

#### 📐 엇박자 시차 공식 (Staggered Motion)

`transition`의 **4번째 인자(Delay)**를 활용해 물리적 동선을 설계합니다.

```css
.card {
  /* 가로 이동(즉시) 후 세로 이동(0.2s 뒤) = 'ㄱ'자 동선 */
  transition:
    inset-inline-start 0.5s var(--ease-standard),
    inset-block-start 0.5s var(--ease-standard) 0.2s;
}
```

#### ⚡ 성능 및 접근성 최적화 (Critical)

* **성능**: 위치는 `translate`, 크기는 `scale`, 투명도는 `opacity`로 제어하여 GPU 가속 유도. (`width`, `height` 지양)
* **접근성**: 멀미/어지럼증을 느끼는 사용자를 위해 애니메이션을 최소화하는 미디어 쿼리 필수 적용.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 7.5 ✨ 모던 셀렉터 및 정렬 규칙

* **`:is()` / `:where()**`: 중복 제거 및 명시도 제어.
* **`:has()`**: 특정 자식을 가진 부모를 선택하는 '부모 셀렉터'.
* **정렬 순서**:
1. 레이아웃(`position`, `display`)
2. 박스모델(`width`, `margin`, `padding`)
3. 시각효과(`background`, `color`)
4. 타이포그래피
5. **모션(`transition`, `animation`, `transform`)**

---

💡 **최종 요약**

> **"Grid로 구조를 잡고 OKLCH로 색을 정의하라. Transition은 반응에, Animation은 시나리오에 할당하되 5종 황금 비율과 지연 시간(Delay)을 조합하여 생동감 넘치는 엇박자 리듬을 완성하라. 단, GPU 최적화와 사용자의 모션 거부 설정(Reduced Motion)을 존중하는 것이 현대 CSS의 완성이다."**
