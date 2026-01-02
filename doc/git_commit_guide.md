# Git Commit Message Guide

이 문서는 효율적이고 전문적인 영어 커밋 메시지 작성을 위한 가이드입니다.

## 1. 기본 구조 (Conventional Commits)

가장 권장되는 구조는 다음과 같습니다:
`type: Verb + Object`

예: `feat: add login functionality`

---

## 2. 커밋 타입 (Type)

커밋의 성격을 한눈에 파악하기 위해 사용합니다.

| 타입 | 설명 |
| :--- | :--- |
| **feat** | 새로운 기능 추가 |
| **fix** | 버그 수정 |
| **chore** | 빌드 업무, 패키지 매니저 설정, 단순 파일/에셋 삭제 등 (로직 변경 없음) |
| **docs** | 문서 수정 (README.md, AGENTS.md 등) |
| **style** | 코드 포맷팅, 세미콜론 누락 등 (코드 의미 변화 없음) |
| **refactor** | 코드 리팩토링 (기능 변화 없이 가독성/구조 개선) |
| **test** | 테스트 코드 추가 및 수정 |

---

## 3. 자주 사용하는 핵심 동사 (Verbs)

문장을 시작할 때 동사 원형(명령문)을 사용합니다.

### 1️⃣ Add (추가)
- 새로운 기능, 파일, 이미지, 의존성 등을 추가할 때
- 예: `feat: add search highlighting`
- 예: `chore: add new logo images`

### 2️⃣ Fix (수정)
- 버그나 오류를 수정할 때
- 예: `fix: fix navigation bug on mobile`
- 예: `fix: correct typo in footer`

### 3️⃣ Update (갱신/변경)
- 기존 기능을 보완하거나 설정을 변경할 때
- 예: `chore: update deno.json dependencies`
- 예: `style: update primary colors`

### 4️⃣ Remove (삭제)
- 불필요한 파일이나 코드를 제거할 때
- 예: `chore: remove unused assets`
- 예: `refactor: remove redundant code`

### 5️⃣ Refactor (개선)
- 기능은 그대로 유지하면서 내부 코드를 효율적으로 바꿀 때
- 예: `refactor: simplify search logic`
- 예: `refactor: optimize image loading`

---

## 4. 작성 팁

1.  **동사 원형 사용:** `added`, `fixes` 대신 `add`, `fix`를 사용하세요.
2.  **첫 글자 소문자:** 타입 뒤의 첫 글자는 소문자로 시작하는 것이 관례입니다.
3.  **마침표 금지:** 메시지 끝에 마침표(`.`)를 찍지 않습니다.
4.  **간결함:** 가급적 50자 이내로 핵심만 적습니다.

---

## 5. 예시 문장들

- `feat: add dark mode toggle`
- `fix: resolve issue with image centering`
- `docs: update deployment instructions`
- `chore: clean up temporary files`
- `refactor: rename variables for clarity`
