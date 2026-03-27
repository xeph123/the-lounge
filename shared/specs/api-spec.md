# THE LOUNGE API Specification (v1)

## 1. Overview
THE LOUNGE의 백엔드 시스템은 RESTful 원칙을 준수하며, 모든 응답은 표준화된 JSON Envelope 구조를 따릅니다.

- **Base URL:** `/api/v1`
- **Content-Type:** `application/json`
- **Authentication:** `Authorization: Bearer <JWT_TOKEN>`

---

## 2. Response Envelope Structure
모든 API 응답은 일관된 구조를 유지합니다.

```json
{
  "success": "boolean",
  "data": "object | array | null",
  "error": {
    "code": "ERROR_CODE",
    "message": "사용자 노출 메시지",
    "debug": "상세 에러 내용 (개발용)"
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "totalCount": 100
  },
  "timestamp": "ISO-8601"
}
```

---

## 3. Endpoints

### 3.1. Authentication (인증)

#### POST `/auth/signup`
- **Description:** 신규 사용자 회원가입
- **Request Body:**
  ```json
  {
    "email": "user@company.com",
    "password": "password123",
    "name": "홍길동",
    "department": "개발팀"
  }
  ```
- **Response Data:**
  ```json
  {
    "user": {
      "id": "uuid-string",
      "email": "user@company.com",
      "name": "홍길동",
      "department": "개발팀",
      "role": "USER"
    }
  }
  ```
- **Error Codes:**
  - `400 BAD_REQUEST`: 필수 파라미터 누락 또는 유효성 검사 실패
  - `409 CONFLICT`: 이미 존재하는 이메일

#### POST `/auth/login`
- **Description:** 사내 이메일 기반 로그인
- **Request Body:**
  ```json
  {
    "email": "user@company.com",
    "password": "password123"
  }
  ```
- **Response Data:** `{ "token": "jwt-token-string", "user": { "id": 1, "name": "홍길동", "role": "User" } }`

#### GET `/auth/me`
- **Description:** 현재 로그인된 사용자 정보 조회 (Token 필수)
- **Response Data:** `{ "id": 1, "email": "user@company.com", "name": "홍길동", "role": "User", "department": "개발팀" }`

---

### 3.2. Posts (게시글)

#### GET `/posts`
- **Description:** 게시글 목록 조회 (페이징, 필터링, 검색 지원)
- **Query Params:**
  - `category`: 카테고리 슬러그 (notice, lounge, tech, idea)
  - `search`: 검색어 (제목/본문)
  - `page`: 페이지 번호 (default: 1)
  - `limit`: 페이지당 개수 (default: 20)
  - `sort`: 정렬 기준 (latest, popular)
- **Response Data:** `[ { "id": 1, "title": "공지사항입니다", "thumbnail": "url", "category": "notice", ... }, ... ]`

#### POST `/posts`
- **Description:** 신규 게시글 작성
- **Request Body:**
  ```json
  {
    "title": "게시글 제목",
    "content": "HTML or Markdown content",
    "categorySlug": "tech",
    "thumbnail": "image-url",
    "tags": ["React", "Vite"]
  }
  ```

#### GET `/posts/{id}`
- **Description:** 게시글 상세 조회

#### PATCH `/posts/{id}`
- **Description:** 게시글 수정 (작성자 또는 관리자 전용)

#### DELETE `/posts/{id}`
- **Description:** 게시글 삭제 (논리 삭제 권장)

---

### 3.3. Comments (댓글)

#### GET `/posts/{postId}/comments`
- **Description:** 특정 게시글의 댓글 목록 조회

#### POST `/posts/{postId}/comments`
- **Description:** 댓글 작성
- **Request Body:** `{ "content": "댓글 내용" }`

#### DELETE `/comments/{id}`
- **Description:** 댓글 삭제

---

### 3.4. Categories (카테고리)

#### GET `/categories`
- **Description:** 카테고리 목록 조회
- **Response Data:** `[ { "id": 1, "name": "Notice", "slug": "notice" }, ... ]`
