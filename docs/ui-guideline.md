# THE LOUNGE: The Visual Silence & Geometric Order
## 디자인 사양서 (Design Specification)

본 문서는 THE LOUNGE의 브랜드 정체성을 시각적으로 구현하기 위한 최상위 가이드라인입니다. 'Geometric Silence(기하학적 침묵)'와 'Editorial Modernism'을 결합하여, 단순한 기능적 UI를 넘어선 예술적 완성도를 지향합니다.

---

## 1. 회원가입(Sign Up) 버튼의 시각적 위계 (Visual Hierarchy)

매거진 스타일의 비대칭 레이아웃과 과감한 타이포그래피를 통해 사용자 시선을 압도하는 최상위 위계를 정의합니다.

### 1.1. 비대칭적 배치 (Asymmetric Layout)
- **위치:** 그리드의 정중앙이 아닌, 우측 하단 혹은 좌측 상단의 여백을 파고드는 비대칭 위치에 배치하여 시각적 긴장감을 형성합니다.
- **오프셋:** 표준 버튼 위치에서 `x: +24px`, `y: -12px` 정도의 미세한 오프셋을 적용하여 레이아웃의 리듬감을 부여합니다.

### 1.2. 타이포그래피 강조 (Bold Typography)
- **Font Family:** `Lora` (Serif) - Italic Medium 적용
- **Size:** `24px` (기본 텍스트 대비 1.5배 이상)
- **Weight:** `Bold (700)`
- **Character Case:** `UPPERCASE`를 기본으로 하되, 첫 글자만 Oversized 처리하여 매거진 헤드라인의 예술적 느낌을 살립니다.
- **Interaction:** Hover 시 배경색이 차오르는 것이 아니라, 텍스트의 `Letter-spacing`이 넓어지며 공간을 점유하는 방식의 애니메이션을 권장합니다.

---

## 2. 한국어 폰트 최적화 (Typography Orchestration)

라틴 폰트인 Lora와 Poppins의 고유한 감성을 한국어 환경에서 완벽하게 재현하기 위한 최적의 조합과 수치를 정의합니다.

### 2.1. 세리프 조합 (Serif Harmony)
- **조합:** `Lora (Latin)` + `Noto Serif KR (Korean)`
- **용도:** 고전적 우아함이 필요한 헤드라인, 인용구, 주요 강조 문구
- **수치 가이드:**
    - **자간 (Letter Spacing):** `-0.02em` (한국어의 밀도감을 위해 미세하게 좁힘)
    - **행간 (Line Height):** `1.4` (헤드라인용), `1.6` (본문용)
    - **특이사항:** Lora의 소문자 x-height가 낮으므로, 한국어 폰트의 크기를 라틴 문자 대비 `95%`로 축소하여 시각적 수평선을 맞춥니다.

### 2.2. 산세리프 조합 (Sans-serif Modernity)
- **조합:** `Poppins (Latin)` + `Pretendard (Korean)`
- **용도:** 인터페이스 요소, 버튼, 데이터 그리드, 정보성 본문
- **수치 가이드:**
    - **자간 (Letter Spacing):** `-0.01em`
    - **행간 (Line Height):** `1.5`
    - **특이사항:** Poppins의 기하학적 원형 곡선과 Pretendard의 모던한 직선 구조가 조화를 이루도록, 영문 수치 데이터와 한국어 텍스트가 혼용될 때 `Baseline` 조정을 통해 수직 정렬을 최적화합니다.

---

## 3. 기하학적 침묵 (Geometric Silence) 및 그리드 시스템

회원가입 폼은 불필요한 장식을 배제하고 기하학적 질서만을 남겨, 사용자에게 깊은 몰입감과 평온함을 제공합니다.

### 3.1. Geometrical Grid (8pt System)
- **Base Unit:** `8px`
- **Column Layout:** 12컬럼 시스템을 기반으로 하되, 회원가입 폼은 중앙의 `6컬럼` 혹은 `8컬럼`을 점유합니다.
- **Gutter:** `32px` (매거진 스타일의 과감한 간격)

### 3.2. 여백 가이드 (The Golden Margin)
- **Inner Padding:** 입력 필드(Input) 내부 여백은 `top/bottom: 20px`, `left/right: 24px`를 유지하여 시각적 숨통을 틔웁니다.
- **Section Margin:** 섹션 간 간격은 최소 `80px` 이상을 확보하여 각 요소가 독립된 오브제처럼 느껴지게 합니다.
- **Geometric Order:** 모든 요소의 끝점은 그리드 라인에 완벽하게 일치시키며, 보더의 두께는 `1px`로 고정하여 선의 선명도를 극대화합니다.

### 3.3. 시각적 침묵 (Visual Silence)
- **Border-radius:** `0px` (완벽한 직각을 통해 기하학적 엄격함을 표현)
- **Color Contrast:** 배경(Paper White)과 보더(Soft Gray)의 대비를 낮춰 눈의 피로를 최소화하고, 포커스 시에만 Accent 컬러를 노출하여 침묵을 깨는 극적인 효과를 연출합니다.
