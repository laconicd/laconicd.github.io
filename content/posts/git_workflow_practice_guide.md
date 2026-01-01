+++
title = "실전 Git 워크플로우 연습 가이드: Rebase와 Merge 혼합 전략"
date = 2025-12-24
description = "rebase로 커밋 히스토리를 깔끔하게 정리하고, merge로 안전하게 통합하는 현대적인 Git 워크플로우 실습 가이드입니다."

[taxonomies]
tags = ["git", "workflow", "rebase", "merge"]
categories = ["development"]
+++

# 실전 Git 워크플로우 연습 가이드: Rebase와 Merge 혼합 전략

이 문서는 현대적인 개발팀과 오픈소스 프로젝트에서 널리 사용되는 Git 워크플로우를
마스터하기 위한 실습 가이드입니다. `rebase`로 나의 작업 공간을 깔끔하게
유지하고, 최종적으로는 `merge`를 통해 프로젝트에 안전하게 통합하는 방법을
단계별로 익힙니다.

### 🎯 이 가이드의 목표

- **1단계: `rebase -i`** → 지저분한 커밋 히스토리를 깔끔하게 정리합니다.
- **2단계: `rebase main`** → 내 작업 브랜치를 프로젝트의 최신 상태로
  업데이트합니다.
- **3단계: `Pull Request` 및 `merge`** → 내 작업을 프로젝트에 최종적으로
  통합합니다.

> **핵심 철학: "내 브랜치는 `rebase`로 깔끔하게, `main` 브랜치에는 `merge`로
> 예의 바르게"**

---

### 준비: 연습용 저장소(Repository) 만들기

이 가이드를 따라 하려면 연습용 프로젝트가 필요합니다.

1. **GitHub에서 새 저장소 생성**
   - GitHub에 로그인한 후, `New repository` 버튼을 클릭합니다.
   - Repository name을 `git-workflow-practice` 로 정합니다.
   - `Public`으로 설정하고, `Add a README file`은 **체크하지 않은 채**로
     `Create repository`를 클릭합니다.

2. **로컬 컴퓨터에 Clone 및 초기 설정**
   - 터미널을 열고 아래 명령어를 순서대로 실행하세요. `<Your-GitHub-Username>`
     부분은 본인의 GitHub 아이디로 변경해야 합니다.

   ```bash
   # 1. 방금 만든 저장소를 내 컴퓨터로 복제합니다.
   git clone https://github.com/<Your-GitHub-Username>/git-workflow-practice.git

   # 2. 프로젝트 폴더로 이동합니다.
   cd git-workflow-practice

   # 3. 프로젝트의 첫 파일인 README.md를 만들고 첫 커밋을 생성합니다.
   echo "# Git 워크플로우 연습" > README.md
   git add README.md
   git commit -m "Initial commit"

   # 4. 첫 커밋을 GitHub에 push 합니다.
   git push origin main

   # 5. 이제 본격적인 기능 개발을 위해 새 브랜치를 만듭니다.
   git checkout -b feature/user-profile
   ```

이제 모든 준비가 끝났습니다! 우리는 `feature/user-profile` 브랜치에서 "사용자
프로필 페이지"를 만드는 시나리오를 진행할 것입니다.

---

### 🚀 1단계: 기능 개발 및 커밋 정리 (`rebase -i`)

#### 1-1. 자유롭게 코딩 & 지저분한 커밋 남기기

개발 과정에서는 완벽한 커밋을 만들기보다, 편하게 중간 저장(save-point)을 하는
것이 일반적입니다. 일부러 지저분한 커밋들을 만들어 봅시다.

1. **`profile.html` 파일 생성 및 기본 구조 작성**
   ```bash
   # profile.html 파일을 만들고 내용을 추가합니다.
   echo "<h1>유저 프로필 페지</h1>" > profile.html

   # 스테이징하고 커밋합니다.
   git add profile.html
   git commit -m "feat: Add profile.html"
   ```

2. **사용자 이름 필드 추가**
   ```bash
   # profile.html에 사용자 이름 필드를 추가합니다.
   echo "<p>이름: </p>" >> profile.html

   # 바로 커밋합니다.
   git commit -am "feat: Add username field"
   ```

3. **앗, 오타 발견! 수정 후 커밋**
   - `profile.html`을 열어보니 "페지"가 아니라 "페이지"입니다. 수정해줍시다.
   - `<h1>유저 프로필 페이지</h1>` 로 수정하고 저장합니다.
   ```bash
   # 오타 수정 후 커밋합니다.
   git commit -am "fix: Correct page title typo"
   ```

4. **나이 필드 추가 (메시지는 대충!)**
   ```bash
   # 나이 필드를 추가합니다.
   echo "<p>나이: </p>" >> profile.html

   # 급해서 커밋 메시지를 대충 남깁니다.
   git commit -am "wip" # wip = Work In Progress
   ```

5. **현재까지의 지저분한 히스토리 확인** `git log --oneline` 명령으로 지금까지
   쌓인 커밋들을 봅시다. 기준이 된 `Initial commit` 위에 4개의 커밋이 지저분하게
   쌓여있습니다.
   ```
   $ git log --oneline
   a1b2c3d (HEAD -> feature/user-profile) wip
   d4e5f6g fix: Correct page title typo
   g7h8i9j feat: Add username field
   j1k2l3m feat: Add profile.html
   n4p5q6r (origin/main, main) Initial commit
   ```

#### 1-2. `rebase -i`로 히스토리 청소하기

이제 Pull Request를 보내기 전에, 이 지저분한 히스토리를 "프로필 페이지 기능
추가"라는 하나의 깔끔한 커밋으로 합쳐봅시다.

1. **Interactive Rebase 실행**
   - 우리는 `Initial commit` 이후의 4개 커밋을 수정할 것이므로, `HEAD~4` 옵션을
     사용합니다.
   ```bash
   git rebase -i HEAD~4
   ```

2. **Rebase 편집기에서 작업 계획 세우기**
   - 위 명령을 실행하면 아래와 같은 편집기 화면이 나타납니다. **(커밋 해시값은
     여러분과 다릅니다)**
   ```
   pick j1k2l3m feat: Add profile.html
   pick g7h8i9j feat: Add username field
   pick d4e5f6g fix: Correct page title typo
   pick a1b2c3d wip

   # ... (도움말 주석 생략)
   ```
   - **계획:** 첫 번째 커밋(`feat: Add profile.html`)을 기준으로 나머지 3개를
     모두 합칩시다. 불필요한 메시지("fix", "wip")는 버리기 위해 `fixup`을, 의미
     있는 메시지("Add username field")는 합치기 위해 `squash`를 사용하겠습니다.
   - 편집기에서 `i`를 눌러 수정 모드로 전환하고, 아래와 같이 수정합니다.

   ```
   pick j1k2l3m feat: Add profile.html
   squash g7h8i9j feat: Add username field
   fixup d4e5f6g fix: Correct page title typo
   fixup a1b2c3d wip
   ```
   - 수정 후 저장하고 종료합니다. (Vim: `Esc` -> `:wq` -> `Enter`)

3. **최종 커밋 메시지 작성**
   - `squash` 명령을 사용했기 때문에, Git이 최종 커밋 메시지를 어떻게 할 것인지
     묻는 편집기를 다시 열어줍니다.
   - 주석 처리된 기존 메시지들을 참고하여, 아래와 같이 모든 내용을 대표하는
     하나의 깔끔한 메시지를 작성해 줍니다.
   ```
   feat: Create user profile page

   - Add HTML structure for user profile.
   - Include username and age fields.
   ```
   - 새 메시지를 작성하고 저장, 종료합니다.

4. **깨끗해진 히스토리 확인!**
   - 다시 `git log --oneline` 을 실행해 보세요.
   ```
   $ git log --oneline
   b2c3d4e (HEAD -> feature/user-profile) feat: Create user profile page
   n4p5q6r (origin/main, main) Initial commit
   ```
   - 지저분했던 4개의 커밋이 하나의 의미 있는 커밋으로 완벽하게 정리되었습니다!

---

### 🚀 2단계: `main` 브랜치와 동기화 (`rebase main`)

내가 프로필 페이지를 만드는 동안, 다른 팀원이 `main` 브랜치에 `LICENSE` 파일을
추가했다고 가정해 봅시다. 내 브랜치를 `main`의 최신 상태 위에 올려놓아야 합니다.

#### 2-1. 동료의 작업 시뮬레이션

1. **`main` 브랜치로 이동해서 동료의 작업을 만듭니다.**
   ```bash
   # main 브랜치로 전환
   git checkout main

   # LICENSE 파일 생성
   echo "MIT License" > LICENSE
   git add LICENSE
   git commit -m "docs: Add project LICENSE"

   # 이 작업을 원격 저장소(GitHub)에 push 합니다.
   git push origin main
   ```
   - 이제 `main` 브랜치는 우리가 `feature/user-profile` 브랜치를 시작했을 때보다
     한발 앞서 나갔습니다.

#### 2-2. `rebase`로 내 브랜치를 최신 `main` 위에 올리기

1. **다시 내 작업 브랜치로 돌아옵니다.**
   ```bash
   git checkout feature/user-profile
   ```
2. **`rebase`를 실행하여 `main`의 최신 내용을 반영합니다.**
   - 만약 여기서 `git merge main`을 하면, 불필요한 머지 커밋이 생겨 히스토리가
     복잡해집니다. `rebase`를 사용하면 내 커밋이 `main`의 최신 커밋 _다음에_
     이어서 작업한 것처럼 깔끔한 직선 히스토리를 만들 수 있습니다.
   ```bash
   git rebase main
   ```
   - 실행하면 "Successfully rebased and updated..." 메시지가 나타납니다.

3. **완벽하게 정리된 최종 히스토리 확인**
   - `git log --oneline --graph` 명령으로 히스토리를 보면, `main`의 최신
     커밋(`docs: Add project LICENSE`) 위에 내 기능 커밋이 예쁘게 올라가 있는
     것을 볼 수 있습니다.
   ```
   $ git log --oneline --graph
   * c3d4e5f (HEAD -> feature/user-profile) feat: Create user profile page
   * d4e5f6g (origin/main, main) docs: Add project LICENSE
   * n4p5q6r Initial commit
   ```

---

### 🚀 3단계: Pull Request 및 최종 통합 (`merge`)

이제 모든 준비가 끝났습니다. 내 작업을 프로젝트에 통합할 시간입니다.

#### 3-1. GitHub에 Push 후 Pull Request 생성

1. **`--force-with-lease` 옵션으로 안전하게 Push**
   - `rebase`로 브랜치의 히스토리를 새로 썼기 때문에, 일반 `push`는 거부됩니다.
   ```bash
   git push --force-with-lease origin feature/user-profile
   ```
2. **Pull Request(PR) 생성**
   - 이제 GitHub의 `git-workflow-practice` 저장소 페이지로 가보면,
     "feature/user-profile has recent pushes" 라는 노란색 알림창이 보입니다.
   - `Compare & pull request` 버튼을 클릭하여 Pull Request를 생성합니다. 제목과
     내용을 적절히 작성하고 `Create pull request`를 클릭합니다.

#### 3-2. 관리자 역할 체험: PR 리뷰 및 Merge

- 이제 우리는 프로젝트 관리자가 되어 이 PR을 병합(merge)할 것입니다.

1. **PR 페이지에서 "Merge pull request" 버튼 찾기**
   - GitHub의 PR 페이지를 보면 초록색 `Merge pull request` 버튼이 있습니다.
   - 이 버튼 옆의 작은 화살표를 눌러보면 3가지 Merge 옵션이 나옵니다.
     - `Create a merge commit`: 우리가 실습할 방식입니다. "이 기능 브랜치가
       여기서 합쳐졌다"는 머지 커밋을 `main`에 남겨, 히스토리의 맥락을
       보존합니다.
     - `Squash and merge`: PR의 모든 커밋을 단 하나의 커밋으로 합쳐서 `main`에
       추가합니다. (우리는 이미 `rebase -i`로 정리했으므로 효과는 비슷합니다.)
     - `Rebase and merge`: PR의 커밋들을 그대로 `main` 브랜치 위에 이어
       붙입니다. 머지 커밋이 남지 않아 가장 깔끔한 직선 히스토리를 만들지만, PR
       단위의 맥락은 사라집니다.

2. **`Create a merge commit` 방식으로 Merge 하기**
   - 기본 옵션인 `Merge pull request`를 클릭하고, `Confirm merge`를 클릭합니다.

#### 3-3. 마무리: 로컬 저장소 정리

1. **로컬 `main` 브랜치를 최신 상태로 업데이트**
   ```bash
   git checkout main
   git pull origin main
   ```
2. **최종 히스토리 확인**
   - `git log --oneline --graph` 로 최종 결과물을 확인합니다.
     `Merge pull request...` 커밋이 `main` 브랜치에 추가된 것을 볼 수 있습니다.
   ```
   *   e5f6g7h (HEAD -> main, origin/main) Merge pull request #1 from ...
   |
   | * c3d4e5f feat: Create user profile page
   |/
   * d4e5f6g docs: Add project LICENSE
   * n4p5q6r Initial commit
   ```

3. **작업이 끝난 브랜치 삭제**
   - 이제 `feature/user-profile` 브랜치는 모든 역할이 끝났으므로 삭제하여 작업
     공간을 깨끗하게 유지합니다.
   ```bash
   # 로컬 브랜치 삭제
   git branch -d feature/user-profile

   # 원격(GitHub) 브랜치 삭제
   git push origin --delete feature/user-profile
   ```

---

### 🎉 축하합니다!

여러분은 `rebase`와 `merge`를 활용한 실전 Git 워크플로우의 한 사이클을 모두
경험했습니다.

이 과정이 손에 익을 때까지 GitHub에서 `git-workflow-practice` 저장소를 삭제하고,
이 가이드 문서를 보며 처음부터 다시 여러 번 반복해 보세요. 반복만이 실력 향상의
지름길입니다.
