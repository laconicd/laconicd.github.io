# Project Blueprint: laconicd.github.io

이 문서는 프로젝트의 구조, 빌드 시스템, 개발 컨벤션을 상세히 기록한 마스터 가이드입니다. 새로운 LLM 세션이나 개발자가 투입되었을 때, 이 문서를 가장 먼저 읽어 프로젝트의 컨텍스트를 파악해야 합니다.

## 1. Project Stack & Architecture

- **Static Site Generator**: [Zola](https://getzola.org/)
- **Runtime & Task Runner**: [Deno](https://deno.land/)
- **Scripting**: [Nushell](https://www.nushell.sh/) (used for build tools in `tools/*.nu`)
- **Styling**: Modern CSS with **Cascade Layers (@layer)**. No CSS frameworks; custom-built styles located in `styles/`.
- **Scripting (Frontend)**: TypeScript/JavaScript located in `scripts/`, bundled during build.

## 2. Directory Structure

- `assets/`: 원본 에셋 (이미지, 미디어 등).
  - `assets/media/`: **Git Submodule**. 포스트별 이미지가 저장되는 곳.
- `content/`: Markdown 포스트 파일들.
- `static/`: 빌드 없이 제공되는 정적 파일들.
  - `static/media/`: `assets/media` 서브모듈의 실제 경로 (빌드 시 참조).
  - `static/images/random/`: 포스트에 이미지가 없을 때 사용되는 랜덤 폴백 이미지들.
- `templates/`: Tera 기반 템플릿 파일들.
  - `templates/macros/`: 공통 로직 (예: 이미지 처리 매크로).
  - `templates/partials/`: 재사용 가능한 UI 컴포넌트.
- `styles/`: CSS 파일들. `main.css`에서 `@import`와 `@layer`를 통해 관리됨.
- `tools/`: Nushell 기반의 빌드 및 자동화 스크립트.
- `doc/`: 프로젝트 관련 문서화 파일들.

## 3. Build & Development Workflow

이 프로젝트는 `deno.json`에 정의된 테스크를 통해 운영됩니다.

- **`deno task init`**: 초기 환경 설정 (`tools/setup.nu`).
- **`deno task sync:assets`**: `assets/`와 `static/` 간의 파일 동기화 및 서브모듈 관리 (`tools/sync-assets.nu`).
- **`deno task build:scripts`**: `scripts/` 내 TS 파일을 번들링 (`tools/bundle.nu`).
- **`deno task dev`**: 로컬 개발 서버 실행 (init + 번들링 + zola serve).
- **`deno task prd`**: 배포용 빌드 생성.

## 4. Automation Scripts (tools/*.nu)

이 프로젝트는 Nushell을 사용하여 복잡한 빌드 프로세스를 자동화합니다.

### 4.1 `tools/setup.nu` (Environment Initialization)
- **목적**: 빌드에 필요한 정적 파일 구조를 생성하고 외부 의존성을 준비합니다.
- **주요 동작**:
  1. `static/` 하위 폴더(fonts, images, media, styles, scripts)를 생성합니다.
  2. `assets/` 및 `styles/`의 모든 파일을 `static/`으로 복사합니다.
  3. `node_modules`에서 `fuse.js`와 `Outfit` 폰트 파일을 `static/`의 적절한 위치로 복사합니다.

### 4.2 `tools/bundle.nu` (Script Bundling)
- **목적**: `scripts/` 폴더의 TypeScript 소스들을 브라우저에서 실행 가능한 JavaScript로 번들링합니다.
- **주요 동작**:
  1. `deno bundle`을 사용하여 TypeScript 파일을 번들링합니다.
  2. 결과물을 `static/scripts/`에 저장하며, `--minify`와 소스맵(`--sourcemap`)을 생성합니다.

### 4.3 `tools/sync-assets.nu` (Submodule & Asset Sync)
- **목적**: 이미지 서브모듈(`assets/media`)의 변경 사항을 원격 저장소에 반영하고 메인 저장소의 참조를 갱신합니다.
- **주요 동작**:
  1. `assets/media` 내부에 변경 사항이 있으면 자동으로 커밋하고 원격(`origin main`)으로 푸시합니다.
  2. 메인 저장소에서 서브모듈의 최신 커밋 참조를 업데이트하고 이를 메인 저장소에도 커밋합니다.
  3. 이를 통해 이미지 자산의 버전 관리를 자동화합니다.

## 5. Key Systems & Conventions

### 4.1 Image Handling (Random Fallback System)
- 포스트 프론트매터에 `image`가 지정되지 않은 경우, 랜덤 이미지를 사용합니다.
- **로직**: `templates/macros/image.html` 매크로를 사용.
- **방식**: 포스트 제목의 길이를 이미지 총 개수(현재 29개)로 나눈 나머지를 사용하여 포스트마다 고정된 랜덤 이미지를 할당 (`random_index = title_length % 29 + 1`).
- **리사이징**: 모든 이미지는 `resize_image` 필터를 통해 최적화된 WebP 포맷으로 제공됩니다.

### 4.2 Git Submodule
- `assets/media`는 별도의 저장소(`laconicd/assets`)를 서브모듈로 사용합니다.
- 포스트 관련 이미지는 이 서브모듈 내에 폴더별로 관리하는 것이 원칙입니다.

### 4.3 CSS Convention
- **Cascade Layers**: `base`, `components`, `utilities` 등 레이어를 사용하여 우선순위를 관리합니다.
- **Naming**: 가독성 중심의 클래스 네이밍을 사용하며, 특정 프레임워크에 의존하지 않습니다.

## 5. Instructions for LLM Agents
1. **분석**: 변경 사항을 제안하기 전 반드시 `config.toml`과 `deno.json`을 먼저 확인하십시오.
2. **코드 수정**: 템플릿 수정 시 중복 로직이 발생하지 않도록 `templates/macros/`에 공통 로직이 있는지 확인하십시오.
3. **이미지**: 새로운 이미지를 추가할 때는 `static/media/` 구조를 따르고, 폴백 시스템은 `image.html` 매크로를 수정하십시오.
4. **커밋**: 의미 있는 단위로 커밋하고, 이 문서를 업데이트할 만한 큰 구조적 변경이 있다면 즉시 반영하십시오.
