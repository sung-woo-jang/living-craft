# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

- 항상 한국말을 할 것
- 존댓말을 사용할 것
- AskUserQuestion 도구로 선택형 질문을 적극 활용할것

## 개발 환경

이 프로젝트는 **Granite.js 기반의 React Native 앱**입니다. Granite는 Toss의 Apps-in-Toss 프레임워크를 사용하여 React Native 앱을 빌드하는 도구입니다.

### 주요 명령어

```bash
# 개발 서버 실행
yarn dev
npx granite dev

# 빌드
yarn build

# 타입 검사
yarn typecheck
npx tsc --noEmit

# 린트
yarn lint           # 검사만
yarn lint:fix       # 자동 수정

# 포맷팅
yarn format         # Prettier로 포맷팅
yarn fix:all        # 린트 + 포맷팅 모두 실행

# 테스트
yarn test
```

## 프로젝트 아키텍처

### 디렉토리 구조

프로젝트는 Feature-Sliced Design에 영향을 받은 계층 구조를 사용합니다:

```
living-craft-front/
├── pages/              # 라우트 페이지 (파일 기반 라우팅)
├── widgets/            # 페이지를 구성하는 독립적인 기능 단위
├── shared/             # 공용 리소스
│   ├── ui/            # 재사용 가능한 UI 컴포넌트
│   ├── hooks/         # 공용 커스텀 훅
│   ├── types/         # 타입 정의
│   └── constants/     # 상수 정의
└── src/
    ├── _app.tsx       # 앱 루트 컴포넌트
    └── router.gen.ts  # 자동 생성된 라우터 (수정 금지)
```

### Path Alias

TypeScript와 Babel 모두에서 다음 경로 별칭을 사용합니다:

- `@shared/*` → `shared/*`
- `@widgets/*` → `widgets/*`
- `@pages/*` → `pages/*`

### 라우팅 시스템

- **파일 기반 라우팅**: `pages/` 디렉토리 내의 파일 구조가 자동으로 라우트가 됩니다
- Granite의 `createRoute` 함수를 사용하여 각 페이지를 정의합니다
- 동적 라우트는 `[id].tsx` 형식의 파일명을 사용합니다
- `src/router.gen.ts`는 자동 생성되므로 직접 수정하지 마세요

### 계층 구조 원칙

1. **pages**: 라우트 페이지. 주로 widgets를 조합하여 화면을 구성합니다
2. **widgets**: 특정 도메인에 종속된 기능 단위 컴포넌트
    - 예: `widgets/home/hero`, `widgets/layouts/public-layout`
    - 각 widget은 자체 `ui/` 디렉토리를 가질 수 있습니다
3. **shared**: 도메인에 독립적인 공용 리소스
    - `shared/ui`: 재사용 가능한 컴포넌트 (Carousel, Drawer, FilterTabs 등)
    - `shared/hooks`: 공용 훅 (useBoolean 등)
    - `shared/constants`: 상수 데이터

### 의존성 규칙

- **pages** → widgets, shared를 import 가능
- **widgets** → shared만 import 가능 (다른 widgets는 import 불가)
- **shared** → 다른 계층을 import하지 않음 (자기 완결적)

## 주요 기술 스택

- **프레임워크**: React Native 0.72.6 + Granite.js
- **라우팅**: Granite Router (파일 기반)
- **UI 라이브러리**: @toss/tds-react-native, @granite-js/native
- **빌드 도구**: Granite CLI
- **타입스크립트**: strict mode 활성화
- **린터**: ESLint 9 (Flat Config)

## 개발 가이드

### 새 페이지 추가하기

1. `pages/` 디렉토리에 `.tsx` 파일 생성
2. `createRoute` 함수로 라우트 정의
3. 파일 구조가 자동으로 URL 경로가 됨
    - `pages/about.tsx` → `/about`
    - `pages/portfolio/[id].tsx` → `/portfolio/:id`

### 새 위젯 추가하기

1. `widgets/` 디렉토리에 도메인별 폴더 생성
2. `ui/` 서브디렉토리에 컴포넌트 작성
3. `index.ts`에서 export
4. shared의 컴포넌트만 import하여 사용

### 공용 컴포넌트 추가하기

1. `shared/ui/` 디렉토리에 컴포넌트 폴더 생성
2. 컴포넌트 작성 및 index.ts에서 export
3. `shared/ui/index.ts`에 재export 추가

### 타입 안정성

- `noUncheckedIndexedAccess: true` 설정으로 배열 접근 시 `undefined` 체크 필요
- `strict: true`로 모든 엄격한 타입 체크 활성화
- `noUnusedLocals`, `noUnusedParameters` 설정으로 미사용 변수/파라미터 금지

## Granite 설정

`granite.config.ts`에서 앱 설정을 관리합니다:

- 앱 이름: `living-craft`
- URL 스킴: `intoss`
- Apps-in-Toss 플랫폼과 통합

## 참고 문서

프로젝트의 `docs/` 디렉토리에 다음 문서들이 있습니다:

- Carousel 컴포넌트 사용법
- Image 컴포넌트 사용법
- NavigationBar 사용법
- Card 컴포넌트 가이드
- Tabbar 사용법
- Toast 사용법
