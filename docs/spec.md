# THE LOUNGE 기능 명세서 (Functional Specification)

## 1. 개요 (Overview)
THE LOUNGE는 사내 구성원 간의 정보 공유와 소통을 활성화하기 위한 '매거진 스타일'의 사내 포털 서비스입니다. 세련된 UI와 직관적인 UX를 통해 임직원들이 즐겁게 정보를 소비하고 의견을 나눌 수 있는 환경을 제공합니다.

---

## 2. 기술 스택 (Tech Stack)
- **Frontend:** React (Vite), Tailwind CSS, shadcn/ui, Lucide Icons
- **Backend:** Node.js (Express)
- **Database:** SQLite (with Prisma ORM)
- **Authentication:** JSON Web Token (JWT)

---

## 3. 핵심 기능 상세 (Core Features)

### 3.1. 임직원 인증 및 권한 관리 (Authentication)
- **접근 정책:** 사내 보안 및 프라이버시를 위해 **모든 서비스(게시글 조회 포함)는 로그인 후 이용 가능**하며, 인증되지 않은 사용자는 로그인 페이지로 리다이렉트됨.
- **회원가입:** 사내 이메일 기반의 회원가입 기능 제공. (필수 정보: 이름, 부서, 이메일, 비밀번호)
- **로그인:** 사내 이메일 기반의 JWT 인증 체계 구축.
- **보안:** 비밀번호 해싱(bcrypt) 및 토큰 기반 세션 관리.
- **권한:**
    - `Admin`: 모든 게시물/댓글 수정 및 삭제, 공지사항 작성 권한.
    - `User`: 본인 작성 게시물/댓글 수정 및 삭제, 카테고리별 조회 및 작성.

### 3.2. 에디토리얼 퍼블리싱 및 소비 (Editorial Publishing & Consumption)
단순한 '게시판'을 넘어, 한 편의 매거진을 읽고 발행하는 듯한 하이엔드 경험을 제공합니다.

1. **에디토리얼 스튜디오 (작성/수정/삭제)**
   - **생성 및 수정:** 노이즈 없는 깨끗한 캔버스 화면에서 글을 작성하고 발행(Publish)할 수 있는 에디터 환경 제공. 
   - **자동 저장 및 아카이빙:** 작성 중인 글의 임시저장 기능 및 작성자 본인의 글을 안전하게 폐기(삭제)할 수 있는 아카이빙 로직 구현.
   - **타이포그래피 제어:** Lora(Serif)와 Pretendard(Sans-serif)를 섞어 쓸 수 있는 Rich Text Editor 제공.

2. **몰입형 리딩 뷰 (상세 조회)**
   - **비례와 여백의 미학:** 게시글 클릭 시 좌우의 불필요한 UI 요소를 최소화하고, 글과 이미지에만 온전히 집중할 수 있는 상세 페이지(Detail Page) 제공.
   - **동적 썸네일:** 본문 내 첫 번째 이미지를 Hero 이미지로 자동 추출하여 화면 상단에 풀 사이즈로 배치.
   - **인터랙션:** 스크롤에 반응하는 읽기 진행도(Progress Bar) 바 및 '좋아요/댓글' 플로팅 액션 바 제공.

3. **아카이브 라운지 (전체 조회 및 View All)**
   - **LATEST STORIES:** 메인 대시보드에서 최신 스토리를 Bento Grid 형태로 시각화.
   - **VIEW ALL 기능:** 각 카테고리 섹션 및 'LATEST STORIES' 영역에 `VIEW ALL` 버튼을 명확히 배치하여, 전체 글 목록(인피니트 스크롤 갤러리)으로 전환될 수 있는 네비게이션 동선 확립.

### 3.3. 카테고리 큐레이션 (Category Curation)
| 카테고리 | 설명 | 주요 특징 |
| :--- | :--- | :--- |
| **Notice (공지)** | 회사 공식 소식 및 안내 | 관리자 전용 작성, 최상단 고정 기능 |
| **Lounge (라운지)** | 자유로운 소통과 일상 공유 | 이미지 첨부 강조, 캐주얼한 UI |
| **Tech (테크)** | 기술 트렌드 및 지식 공유 | 코드 하이라이팅 지원, 기술 태그 활용 |
| **Idea (아이디어)** | 사내 개선 제안 및 브레인스토밍 | 투표(좋아요) 기능 중심 배치 |

### 3.4. 검색 및 데이터 핸들링 (Search & Pagination)
- **페이징:** 매거진 레이아웃에 최적화된 무한 스크롤(Infinite Scroll) 적용.
- **검색:** 제목, 본문, 작성자 정보를 포함한 통합 검색 기능.
- **필터링:** 카테고리별/최신순/인기순(좋아요 기준) 정렬 필터.

---

## 4. UI/UX 디자인 가이드라인 (Design Guidelines)
- **Editorial Layout:** `research.md`의 분석에 따라 비대칭 그리드와 과감한 여백을 활용.
- **Bento Grid:** 메인 대시보드에서 주요 소식을 카드 형태로 시각화.
- **Typography:** 헤드라인은 Serif 계열(Lora/Noto Serif KR), 본문은 Sans-serif(Pretendard) 혼용으로 전문성 확보.

---

## 5. 데이터 모델 (Data Model Overview)
- **User:** id, email, password, name, department, role, created_at
- **Post:** id, title, content, thumbnail, category_id, author_id, view_count, created_at
- **Comment:** id, post_id, author_id, content, created_at
- **Category:** id, name (Notice, Lounge, Tech, Idea), slug