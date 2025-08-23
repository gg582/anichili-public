# AniChili

AniChili는 애니메이션 정보의 분산 문제를 해결하는 커뮤니티 기반 정보 공유 서비스입니다. 사용자가 직접 애니메이션 관련 데이터를 등록하고 수정하여 최신 정보를 유지하며, 방영 중인 애니메이션의 OP/ED, PV, 공식 OTT 링크를 한곳에서 확인할 수 있습니다.

## 주요 기능

* **사용자 참여형 데이터 관리**: OP, ED, PV 등 공식 영상 정보를 사용자들이 직접 등록 및 수정 가능.
* **강력한 검색 및 필터링**: 제목, 장르, 방영 연도 등 다양한 조건으로 애니메이션 검색.
* **반응형 디자인**: 웹, 모바일, 태블릿 등 모든 기기에서 최적화된 UI 제공.

## 놀라운 점

**이 프로젝트는 90% 이상 AI 자동 생성 코드로 구성되어 있습니다.**
**개발자는 구현 방향을 지시하고 코드를 조립하는 역할만 수행하였습니다.**

## 기술 스택

### 백엔드

* Node.js, Express.js
* Turso / Vercel Blob(SQL)
* JWT 기반 인증 및 권한 관리

### 프론트엔드

* React.js, Next.js(SSR 및 정적 사이트 생성)
* Styled Component
* React Router

## 설치 및 실행

1. 저장소 클론

```bash
git clone https://github.com/gg582/anichili-public.git
cd anichili-public
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정 (`.env.local` 파일 생성)

```env
DATABASE_URL=your_database_url
DATABASE_AUTH_TOKEN=your_database_auth_token
```

4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

## 이슈: JWT 토큰 미발행

## 기여

* **버그 제보 및 기능 제안**: GitHub Issues 이용
* **코드 기여**: Conventional Commits 규칙(feat:, fix:, docs:, refactor:) 준수
* PR 제출 전 로컬 테스트 필수

## 라이선스

GPL2 라이선스 적용. 자세한 내용은 LICENSE 파일 참고.
