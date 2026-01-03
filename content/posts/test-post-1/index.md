+++
title = "Zola 요약 기능 마스터하기"
date = 2026-01-03
description = "Zola의 태그를 활용하여 리스트 페이지를 깔끔하게 만드는 방법"
authors = ["laconicd"]
[taxonomies]
categories = ["Tutorial"]
tags = ["Zola", "StaticSite", "Web"]
[extra]
image = "zola.jpg"
+++

# Zola Summary 테스트

이 문단은 블로그 리스트 페이지의 **카드 내부**에 나타납니다.
Zola는 이 아래에 있는 `more` 주석을 발견하면 여기까지를 `page.summary`로 저장합니다.

<!-- more -->

여기서부터는 **상세 페이지**에서만 보이는 내용입니다.
Zola는 자동으로 `<span id="continue-reading"></span>` 태그를 이 자리에 생성하므로,
리스트에서 "계속 읽기" 버튼을 누르면 이 위치로 바로 스크롤됩니다.

## 본문 상세 내용
- 요약 기능은 HTML 태그를 안전하게 닫아줍니다.
- 리스트 페이지에서는 `{{ page.summary | safe }}`로 출력하세요.
- 상세 페이지에서는 `{{ page.content | safe }}`로 전체 내용을 보여주세요.
