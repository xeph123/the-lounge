# Database Schema & Migration Strategy

## 1. Overview
본 문서는 THE LOUNGE 서비스를 위한 SQLite 데이터베이스 스키마 설계 및 마이그레이션 전략을 정의합니다. 데이터 모델은 3차 정규형(3NF)을 준수하며, Prisma ORM을 기반으로 관리됩니다.

---

## 2. Entity Relationship Diagram (Conceptual)
- **User** (1) <--- (N) **Post**
- **User** (1) <--- (N) **Comment**
- **Category** (1) <--- (N) **Post**
- **Post** (1) <--- (N) **Comment**
- **Post** (1) <--- (N) **Like**
- **Comment** (1) <--- (N) **Comment** (Self-relation for nested comments)

---

## 3. Database Schema (SQLite)

### 3.1. User (사용자)

Prisma Schema 스타일로 정의된 `User` 모델입니다.

```prisma
model User {
  id         String   @id @default(uuid())
  email      String   @unique
  password   String
  name       String
  department String?
  role       String   @default("USER")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  // Relations
  posts      Post[]
  comments   Comment[]
  likes      Like[]

  @@map("users")
}
```

#### 보안 및 인증 전략 (Security & Auth Strategy)
- **비밀번호 암호화 (bcrypt):**
  - 회원가입 시 평문 비밀번호는 단방향 해시 알고리즘인 `bcrypt`를 사용하여 암호화(해싱)한 후 데이터베이스에 안전하게 저장됩니다.
  - Brute-force 공격 및 Rainbow Table 방어를 위해 적절한 비용 인자(Salt Rounds, 예: 10~12)를 적용합니다.
- **JWT 발급 전략 (JSON Web Token):**
  - 회원가입 및 로그인 성공 시, 상태 비저장(Stateless) 인증을 위한 JWT(Access Token)를 발급합니다.
  - Payload 에는 사용자를 식별할 수 있는 최소한의 정보(`id`, `email`, `role`)만 포함하며, 보안상 민감한 정보는 절대 포함하지 않습니다.
  - 적절한 토큰 만료 시간(Expiration)을 설정하고, 클라이언트는 이후 보호된 API 요청 시 헤더에 `Authorization: Bearer <Token>` 형식으로 첨부하여 인증을 수행합니다.

### 3.2. Category (카테고리)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK, AUTOINCREMENT | 고유 식별자 |
| `name` | TEXT | UNIQUE, NOT NULL | 카테고리명 (Notice, Lounge, Tech, Idea) |
| `slug` | TEXT | UNIQUE, NOT NULL | URL 슬러그 |

### 3.3. Post (게시글)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT (UUID) | PK | 고유 식별자 |
| `title` | TEXT | NOT NULL | 제목 |
| `content` | TEXT | NOT NULL | 본문 (Rich Text / HTML) |
| `thumbnail` | TEXT | | 대표 이미지 경로 |
| `category_id` | INTEGER | FK (Category.id), NOT NULL | 카테고리 ID |
| `author_id` | TEXT | FK (User.id), NOT NULL | 작성자 ID |
| `view_count` | INTEGER | DEFAULT 0 | 조회수 |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | 생성일 |
| `updated_at` | DATETIME | | 수정일 |

### 3.4. Comment (댓글)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT (UUID) | PK | 고유 식별자 |
| `post_id` | TEXT | FK (Post.id), NOT NULL | 게시글 ID |
| `author_id` | TEXT | FK (User.id), NOT NULL | 작성자 ID |
| `content` | TEXT | NOT NULL | 댓글 내용 |
| `parent_id` | TEXT | FK (Comment.id) | 대댓글용 부모 댓글 ID |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | 생성일 |

### 3.5. Like (좋아요/투표)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK, AUTOINCREMENT | 고유 식별자 |
| `post_id` | TEXT | FK (Post.id), NOT NULL | 게시글 ID |
| `user_id` | TEXT | FK (User.id), NOT NULL | 사용자 ID |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | 생성일 |

---

## 4. Migration Strategy (Prisma ORM)

### 4.1. 초기화 및 설정
- **PRAGMA foreign_keys = ON;** 활성화로 참조 무결성 보장.
- **WAL Mode:** 동시성 향상을 위해 `journal_mode = WAL` 설정 권장.

### 4.2. 마이그레이션 워크플로우
1. **Schema Definition:** `src/server/prisma/schema.prisma` 파일에 모델 정의.
2. **Local Migration:** 
   ```bash
   npx prisma migrate dev --name init
   ```
3. **Client Generation:** 
   ```bash
   npx prisma generate
   ```

### 4.3. 데이터 시딩 (Data Seeding)
- 초기 카테고리 데이터(`Notice`, `Lounge`, `Tech`, `Idea`)는 `prisma/seed.ts`를 통해 자동 생성.

### 4.4. 운영 DB 전환 (Future)
- 서비스 확장 시 `schema.prisma`의 `provider`를 `postgresql`로 변경하고 커넥션 스트링을 업데이트하여 원활한 마이그레이션 수행.

---

## 5. Indexing Plan
- `Post.category_id`: 카테고리별 필터링 성능 최적화.
- `Post.author_id`: 특정 사용자의 게시글 조회 성능 최적화.
- `Comment.post_id`: 게시글별 댓글 로딩 성능 최적화.
- `Like.(post_id, user_id)`: 중복 좋아요 방지 및 조회 성능 최적화 (Unique Index).
