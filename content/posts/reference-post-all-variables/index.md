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
