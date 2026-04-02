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
- **Docker** (로컬 데이터베이스 실행용)

### 2. 의존성 설치 및 환경 변수 설정

```bash
# 클라이언트 의존성 설치
cd client
npm install

# 서버 의존성 설치
cd ../server
npm install

# 환경 변수 파일 복사
cp .env.example .env
```
`.env` 파일을 열고 로컬 개발용 Docker 환경변수가 `localhost`를 가리키고 있는지 확인하세요.

### 3. 데이터베이스 및 스토리지 설정 (Server)

**로컬 DB 세팅 (Docker 이용):**
```bash
# 1. 뼈대 폴더 최상단(the-lounge)에서 로컬 DB 띄우기
docker-compose up -d

# 2. 서버 폴더로 와서 Prisma 마이그레이션 실행 (테이블 생성)
cd server
npx prisma migrate dev
```

**Supabase Storage 세팅 (로컬 및 배포 공통):**
이 프로젝트는 파일 시스템 초기화(Vercel/Render 등)에 대비하여 이미지나 파일을 **Supabase Storage**에 업로드합니다.
1. Supabase 대시보드 - Storage 메뉴에서 **`uploads`** 라는 이름의 Public Bucket을 생성합니다.
2. `server/.env` 파일에 `SUPABASE_URL`과 `SUPABASE_KEY` 정보를 기입합니다.

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

### 1. 백엔드 (Render / Railway)
- **Render**와 같은 클라우드 서비스에 서버를 배포합니다.
- 반드시 대시보드의 **Environment Variables(환경 변수)** 란에 직접 다음 값들을 입력해주세요 (배포 서버에는 `.env` 파일을 올리지 않기 때문입니다):
  - `DATABASE_URL`: Supabase 연결 문자열 (포트 6543)
  - `DIRECT_URL`: Supabase 세션 연결 문자열 (포트 5432)
  - `SUPABASE_URL`: Supabase Project URL
  - `SUPABASE_KEY`: Supabase API Key (Secret/Anon 모두 가능)
  - `JWT_SECRET`: 임의의 안전한 암호화 시크릿 키
  - `PORT`: 4000 (또는 서비스 기본값)

### 2. 프론트엔드 (Vercel)
- [Vercel](https://vercel.com/)에 `client` 폴더를 연결하여 배포합니다.
- **Environment Variables**:
  - `VITE_API_URL`: 배포된 백엔드 서버의 주소 (예: `https://your-api.onrender.com`)

---

모든 작업이 완료되었습니다! 이제 전 세계 어디서나 "The Lounge"에 접속할 수 있습니다.


