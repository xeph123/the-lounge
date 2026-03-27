# THE LOUNGE 개발 백로그 및 일정 (Development Backlog & Schedule)

본 문서는 `src/docs/spec.md`를 바탕으로 수립된 단계별 개발 계획입니다. 모든 태스크는 상호 의존성을 고려하여 순차적으로 진행됩니다.

## 1. 프로젝트 마일스톤 (Milestones)

| 단계 | 목표 | 예상 기간 | 상태 |
| :--- | :--- | :--- | :--- |
| **Phase 1** | 인프라 설정 및 DB 스키마 확정 | Day 1 | Pending |
| **Phase 2** | 인증 시스템(JWT) 및 사용자 관리 구현 | Day 2 | Pending |
| **Phase 3** | 하이엔드 콘텐츠 경험(CRUD, 상세, 전체보기) 구현 | Day 3-5 | Pending |
| **Phase 4** | 매거진 스타일 UI/UX 및 디자인 고도화 | Day 6-7 | Pending |
| **Phase 5** | 통합 검색, 페이징 및 최종 QA | Day 8 | Pending |

---

## 2. 상세 백로그 (Detailed Backlog)

### Phase 1: Foundations (기반 구축)
- [ ] **Task 1.1: 프로젝트 스캐폴딩**
    - Vite 기반 React 프론트엔드 및 Express 백엔드 초기 설정
    - Tailwind CSS, shadcn/ui 설치 및 테마 설정
- [ ] **Task 1.2: 데이터베이스 및 Prisma 설정**
    - SQLite 데이터베이스 초기화
    - `User`, `Post`, `Comment`, `Category` 모델 정의 및 마이그레이션

### Phase 2: Authentication (인증)
- [x] **Task 2.1: 백엔드 인증 로직 구현** (완료)
    - 비밀번호 암호화(bcrypt) 처리 및 로그인/회원가입 API 구현
- [x] **Task 2.2: 프론트엔드 인증 플로우** (완료)
    - 로그인 및 회원가입 페이지 UI 구현 (하이엔드 Lora+Pretendard 조합 적용)

### Phase 3: 하이엔드 콘텐츠 경험 (High-End Content Experience)
- [ ] **Task 3.1: 에디토리얼 API (Backend)**
    - 게시글 생성(Create), 수정(Update), 삭제(Delete) API 구현
    - 개별 게시글 상세 조회(Detail) 및 카테고리별 전체 목록(View All) 조회 API 구현
- [ ] **Task 3.2: 에디토리얼 스튜디오 구현 (Frontend - Create/Update)**
    - 게시글 작성 및 수정을 위한 몰입형 캔버스 UI (Rich Text Editor 적용) 구현
    - 발행 및 삭제 액션 버튼 연결
- [ ] **Task 3.3: 몰입형 리딩 뷰 구현 (Frontend - Detail)**
    - 게시글 클릭 시 이동하는 상세 페이지(Detail Page) 라우팅 구현
    - 본문 타이포그래피 최적화 및 Hero 이미지 렌더링
- [ ] **Task 3.4: 아카이브 라운지 구현 (Frontend - View All)**
    - 메인 대시보드의 'LATEST STORIES' 영역 구현
    - 'VIEW ALL' 버튼 클릭 시 진입하는 카테고리별 갤러리/리스트 뷰 구현

### Phase 4: UI/UX Refinement (매거진 스타일 고도화)
- [ ] **Task 4.1: Editorial Layout 적용**
    - 비대칭 그리드와 타이포그래피 최적화
- [ ] **Task 4.2: 인터랙션 강화**
    - 이미지 썸네일 최적화 및 로딩 스켈레톤 UI 적용

### Phase 5: Search & Optimization (검색 및 최적화)
- [ ] **Task 5.1: 검색 및 필터링**
    - 통합 검색 API 및 UI 검색 바 구현
- [ ] **Task 5.2: 최종 QA 및 버그 수정**
    - 엔드투엔드(E2E) 테스트 수행 및 성능 점검

---

## 3. 태스크 관리 규칙
- 모든 작업 결과물은 `.gemini` 외부 `src/` 폴더 내에 위치한다.
- 각 단계 완료 후 `spec.md`와의 일치 여부를 재확인한다.
- 코드 변경 시 관련된 테스트 코드를 동반한다.