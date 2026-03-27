# The Lounge

현대적인 기술 스택과 Supabase를 활용하여 구축된 커뮤니티 및 블로그 플랫폼 프로젝트입니다.

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
- **PostgreSQL (Supabase)**: 강력한 오픈소스 관계형 데이터베이스
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

## 🚀 배포 가이드 (Deployment)

### 1. 데이터베이스 (Supabase)
- [Supabase](https://supabase.com/)에서 프로젝트를 생성합니다.
- Database Settings에서 `Transaction` 및 `Session` 모드 URL을 확인합니다.
- 서버 마이그레이션을 위해 `npx prisma migrate dev`를 실행합니다.

### 2. 백엔드 (Render / Railway)
- **Render** 또는 **Railway**와 같은 무료 티어 서비스를 이용합니다.
- 환경 변수 설정:
  - `DATABASE_URL`: Supabase Transaction URL (포트 6543)
  - `DIRECT_URL`: Supabase Session URL (포트 5432)
  - `JWT_SECRET`: 임의의 안전한 문자열
  - `PORT`: 4000 (또는 서비스 기본값)

### 3. 프론트엔드 (Vercel)
- [Vercel](https://vercel.com/)에 `client` 폴더를 연결하여 배포합니다.
- **Root Directory**: `client` 설정을 확인하세요.
- **Environment Variables**:
  - `VITE_API_URL`: 배포된 백엔드 서버의 주소 (예: `https://your-api.onrender.com`)
- Vercel은 자동으로 HTTPS와 최적화된 빌드를 제공합니다.

---

모든 작업이 완료되었습니다! 이제 전 세계 어디서나 "The Lounge"에 접속할 수 있습니다.


