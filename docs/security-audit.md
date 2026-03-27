# 초기 인프라 보안 점검 보고서 (Initial Infrastructure Security Audit)

**작성일:** 2026-03-27
**점검 대상:** 프로젝트 루트 및 주요 서비스 (Server, Client)
**점검자:** Security Agent

## 1. 종합 요약 (Executive Summary)
현재 프로젝트는 초기 단계로, 기본적인 보안 설정이 적용되어 있으나 일부 하드코딩된 설정과 환경변수 관리 체계의 개선이 필요합니다. 주요 위험 요소는 `docker-compose.yml` 내의 설정 노출이며, 이를 위한 환경변수 관리 전략을 수립하였습니다.

## 2. 주요 점검 항목 및 결과

| 항목 | 상태 | 내용 | 심각도 |
| :--- | :---: | :--- | :---: |
| **Secrets Management** | ⚠️ | `.env` 파일은 적절히 무시되고 있으나, `docker-compose.yml`에 설정이 노출됨. | **Major** |
| **Authentication** | ℹ️ | JWT 기반 인증 로직이 존재하나 클라이언트는 현재 Mocking 상태임. | **Minor** |
| **Network Security** | ✅ | 외부 노출 포트가 명시적으로 관리되고 있음. | **Suggestion** |
| **Environment Strategy** | ❌ | `.env.example` 템플릿 파일이 부재함. | **Major** |

## 3. 상세 분석 및 조치 사항

### [Major] 환경변수 노출 및 하드코딩
- **문제점:** `docker-compose.yml` 파일에 `DATABASE_URL`, `PORT` 등이 평문으로 기록되어 있음. 이는 인프라 설정 변경 시 유연성을 저하시키고 설정 유출의 위험이 있음.
- **조치:** 모든 동적 설정값을 환경변수로 분리하고, `.env.example`을 통해 협업 환경을 구축함.
- **상태:** 조치 완료 (전략 수립 및 파일 생성)

### [Critical] 비밀번호 및 시크릿 키 관리
- **문제점:** `JWT_SECRET`과 같은 민감 정보가 소스 코드에 직접적으로 포함되지 않도록 주의 필요.
- **조치:** `.env` 파일 내에서만 관리하며, 예시 파일(`src/server/.env.example`)에 실제 값을 기입하지 않도록 가이드라인 수립.

### [Major] 미흡한 CORS 설정
- **문제점:** `src/server/src/app.ts`에서 `app.use(cors())`가 옵션 없이 사용되어 모든 도메인(`*`)에서의 요청을 허용하고 있음. 이는 XSS 등의 공격에 취약해질 수 있는 요소임.
- **조치:** 프로덕션 환경에서는 허용된 도메인 리스트를 환경변수로 관리하여 제한할 것을 권고함.

## 4. 환경변수 관리 전략

1. **템플릿 제공:** 서비스별 `.env.example` 파일을 유지하여 필수 설정 항목을 명시함.
2. **Docker 통합:** `docker-compose.yml`은 환경변수를 우선 참조하며, 누락 시 기본값을 사용하도록 구성함.
3. **CI/CD 연동:** 배포 환경에서는 GitHub Secrets 등을 사용하여 변수를 주입함.

## 5. 향후 권고 사항
- **[Suggestion]**: API 엔드포인트 보안을 위해 CORS 설정을 더 엄격하게 제한할 것 (현재 `*` 허용 여부 확인 필요).
- **[Suggestion]**: 생산 환경에서는 SQLite 대신 PostgreSQL/MySQL과 같은 관리형 DB 사용 권장.
