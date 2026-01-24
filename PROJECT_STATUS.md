# 🛠 Project Analysis & Status (Jan 24, 2026)

이 문서는 프로젝트의 현재 상태, 기술 스택, 아키텍처 및 최근 변경 사항을 요약하여 다음 세션에서 효율적으로 작업을 이어갈 수 있도록 돕습니다.

---

## 🚀 1. 기술 스택 (Tech Stack)

- **SSG:** [Zola](https://www.getzola.org/) (Rust 기반 정적 사이트 생성기)
- **Runtime & Tooling:** [Deno](https://deno.com/) + [Nushell](https://www.nushell.sh/)
- **Templates:** Tera (Zola 기본 템플릿 엔진)
- **Styling:** Pure CSS (Modern CSS features: Layers, `@scope`, Logical Properties)
- **Deployment:** GitHub Pages (`laconicd.github.io`)

---

## 🎨 2. CSS 아키텍처 (Pure CSS Architecture)

`static/styles/ARCHITECTURE.md`에 정의된 규칙을 엄격히 따릅니다.

### 레이아웃 조립 원칙 (Composable Layout)
- **구조는 `l-`**, **세부 정렬은 `u-`**가 담당합니다.
- `l-stack`(Flex column)이나 `l-cluster`(Flex row)를 사용할 때 정렬 유틸리티(`.u-items-center` 등)를 조합합니다.

### 컴포넌트 분리 (Modular Components)
파일이 너무 길어지는 것을 방지하기 위해 `data-display.css`를 폴더 구조로 분리했습니다.
- `static/styles/components/data-display/`
  - `post-detail.css`: 포스트 상세 페이지 스타일
  - `post-card.css`: 통합 포스트 카드 로직 (Hero, Row, Grid 모드)
  - `category-card.css`: 카테고리 카드 스타일
  - `tag-pill.css`: 태그 스타일

---

## ✅ 3. 최근 변경 사항 (Recent Updates)

1. **스타일 구조 개편**: 거대했던 `data-display.css`를 논리적 단위로 분할하여 관리 편의성을 높임.
2. **통합 포스트 카드 완성**: 
   - `grid-area`를 도입하여 레이아웃의 견고함 확보.
   - 히어로 카드는 가로 분할 프리미엄 스타일로 구현.
   - 인덱스 리스트는 히어로 카드를 축소한 "미니 히어로" 스타일(0.75:1.25 비율)로 통합하여 시각적 일관성 확보.
3. **인터랙션 최적화**: 
   - 호버 시 커서 깜빡임 현상 해결 (클릭 영역 고정).
   - 화살표 아이콘 스타일링 (원형 통일 및 히어로/미니 히어로 레이아웃 대응).
4. **유틸리티 확장**: `.c-icon-circle` 등 재사용 가능한 아이콘 컨테이너 추가.

---

## 🛠 4. 개발 가이드 (Development Guide)

- **초기화:** `deno task init`
- **로컬 서버:** `deno task dev`
- **빌드:** `deno task prd`

---

## 📌 5. 다음 세션 참고 사항

- 새로운 컴포넌트 추가 시 `static/styles/components/` 아래 적절한 폴더를 생성하거나 기존 구조를 따르세요.
- `post-card.css`는 컨테이너 쿼리에 의존하므로 부모 요소에 `container-type: inline-size`가 설정되어 있는지 항상 확인하세요.
