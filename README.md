# The Lounge

현대적인 기술 스택을 활용하여 구축된 커뮤니티 및 블로그 플랫폼 프로젝트입니다.

## 🚀 기술 스택

### 프론트엔드 (Client)
- **React 19**: 최신 버전의 React 라이브러리
- **Vite**: 빠르고 가벼운 빌드 도구
- **Tailwind CSS v4**: 성능이 향상된 최신 스타일링 프레임워크
- **Lucide Icons**: 깔끔하고 확장 가능한 아이콘 세트
- **Framer Motion**: 부드러운 UI 애니메이션
- **Radix UI**: 접근 가능한 서버리스 UI 컴포넌트

### 백엔드 (Server)
- **Node.js & Express**: 안정적인 서버 환경 및 프레임워크
- **Prisma**: 생산성 높은 데이터베이스 ORM
- **SQLite**: 가볍고 빠른 데이터베이스 파일
- **JWT (JSON Web Token)**: 안전한 사용자 인증 체계

---

## 📂 프로젝트 구조

```text
the-lounge/
├── client/          # 프론트엔드 React 애플리케이션
├── server/          # 백엔드 Express API 서버
├── shared/          # 공통 타입 및 유틸리티 (공유 코드)
├── docs/            # 프로젝트 문서
└── logs/            # 서버 실행 로그
```

---

## 🛠️ 시작하기

### 1. 사전 준비
- Node.js (v18 이상 권장)
- npm 또는 yarn

### 2. 의존성 설치

```bash
# 클라이언트 의존성 설치
cd client
npm install

# 서버 의존성 설치
cd ../server
npm install
```

### 3. 데이터베이스 설정 (Server)

```bash
cd server
# Prisma 마이그레이션 실행 (데이터베이스 스키마 생성)
npx prisma migrate dev
```

### 4. 개발 서버 실행

```bash
# 클라이언트 실행 (기본 포트: 5173)
cd client
npm run dev

# 서버 실행 (기본 포트: 5000)
cd server
npm run dev
```

---

## 📝 주요 기능
- **사용자 인증**: 회원가입, 로그인 및 JWT 기반 세션 관리
- **게시글 관리**: 카테고리별 포스팅, 태그 기능, 썸네일 업로드
- **상호작용**: 댓글 및 답글 기능, 좋아요 기능
- **조회수**: 게시글 조회수 실시간 추적


