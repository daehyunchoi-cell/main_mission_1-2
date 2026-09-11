# 맛집기록

다녀온 맛집을 가게명·지역·평점·후기와 함께 기록하는 React SPA입니다.

- **배포 URL**: https://main-mission-1-2.vercel.app/
- **저장소**: https://github.com/daehyunchoi-cell/main_mission_1-2

---

## 1. 기술 스택

| 구분 | 사용 기술 | 선택 이유 |
|---|---|---|
| UI 라이브러리 | React 19 | 컴포넌트 단위 구성과 상태 기반 렌더링 |
| 빌드 도구 | Vite | JSX 변환과 개발 서버를 담당. 저장 즉시 반영(HMR) |
| 라우팅 | React Router v7 | 주소별 화면 전환을 새로고침 없이 처리 |
| 백엔드 | Supabase (PostgreSQL) | 테이블 구조가 명시적이고 대시보드에서 데이터 확인 가능 |
| 스타일링 | CSS Modules | 컴포넌트별 스타일 파일 분리, 클래스명 충돌 없음 |
| 언어 | JavaScript (ES2022) | |
| 배포 | Vercel | SPA 리라이트와 환경변수 주입을 기본 지원 |

TypeScript는 사용하지 않았습니다. 이번 미션의 목표가 React의 상태·이벤트·비동기 흐름 이해에 있어, 타입 시스템 학습을 동시에 진행하면 초점이 흐려진다고 판단했습니다.

---

## 2. 로컬 실행 방법

### 사전 요구사항

- Node.js 20 이상
- npm 10 이상

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/daehyunchoi-cell/main_mission_1-2.git
cd main_mission_1-2

# 의존성 설치
npm install

# 환경변수 파일 생성 (아래 3장 참고)
touch .env.local

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

### 기타 명령어

```bash
npm run build    # 프로덕션 빌드 → dist/ 생성
npm run preview  # 빌드 결과를 로컬에서 확인
npm run lint     # ESLint 검사
```

---

## 3. 환경변수 설정

프로젝트 최상단에 `.env.local` 파일을 만들고 아래 두 값을 채웁니다.

```
VITE_SUPABASE_URL=https://<프로젝트ID>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon public key>
```

두 값은 Supabase 대시보드의 **Project Settings → API**에서 확인합니다.

주의할 점이 두 가지 있습니다.

1. **`VITE_` 접두사가 필수입니다.** Vite는 이 접두사가 붙은 변수만 클라이언트 번들에 포함시킵니다. 서버 전용 비밀키가 실수로 브라우저에 노출되는 것을 막기 위한 장치입니다.
2. **URL에 경로를 붙이지 않습니다.** `.../supabase.co`까지만 적습니다. `/rest/v1`을 포함하면 SDK가 경로를 한 번 더 붙여 `rest/v1/rest/v1/...`이 되어 404가 발생합니다.

`.env.local`은 `.gitignore`에 포함되어 저장소에 올라가지 않습니다. 배포 환경에서는 Vercel 대시보드의 **Settings → Environment Variables**에 동일한 두 값을 등록합니다.

---

## 4. 데이터베이스 스키마

```sql
create table reviews (
  id bigint generated always as identity primary key,
  name text not null,
  region text not null,
  rating int not null,
  content text not null,
  created_at timestamptz default now()
);

alter table reviews enable row level security;

create policy "누구나 조회" on reviews for select using (true);
create policy "누구나 등록" on reviews for insert with check (true);
create policy "누구나 수정" on reviews for update using (true);
create policy "누구나 삭제" on reviews for delete using (true);
```

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | bigint | 자동 증가 기본키. 상세 라우트(`/reviews/:id`)의 파라미터로 사용 |
| `name` | text | 가게명 (필수, 40자 이내) |
| `region` | text | 지역. 목록 필터 기준 |
| `rating` | int | 평점 1~5 |
| `content` | text | 후기 (필수, 10~500자) |
| `created_at` | timestamptz | 등록 시각. 목록 정렬 기준 |

인증 기능이 없는 학습용 프로젝트이므로 RLS 정책은 모두 허용으로 설정했습니다. 실제 서비스라면 `auth.uid()` 기반으로 작성자 본인만 수정·삭제할 수 있도록 제한해야 합니다.

---

## 5. 폴더 구조

```
src/
├── components/     재사용 UI 컴포넌트 (13개)
├── pages/          라우트 단위 화면 (6개)
├── hooks/          데이터 조회 커스텀 훅 (2개)
├── lib/            Supabase 클라이언트, 데이터 접근 함수, 검증 로직, 상수
├── App.jsx         라우팅 정의
├── main.jsx        진입점
└── index.css       전역 스타일 + CSS 변수
```

### 계층별 역할

| 계층 | 하는 일 | 하지 않는 일 |
|---|---|---|
| `pages/` | 라우트 파라미터 읽기, 훅 호출, 상태에 따른 화면 분기, 페이지 이동 | 데이터 요청 세부 구현, 스타일 정의 |
| `components/` | props를 받아 UI를 그림 | 데이터 요청, 라우팅 결정 |
| `hooks/` | 비동기 요청과 로딩·에러 상태 관리 | DOM 조작, 화면 렌더링 |
| `lib/` | Supabase 질의, 검증 규칙, 상수 | React 관련 처리 |

이렇게 나눈 이유는 **바뀌는 이유가 다른 것을 분리**하기 위해서입니다. 화면 디자인이 바뀌면 `components/`만, 데이터 출처가 바뀌면 `lib/`만, 검증 규칙이 바뀌면 `validateReview.js`만 열면 됩니다.

---

## 6. 라우팅

| 경로 | 컴포넌트 | 설명 |
|---|---|---|
| `/` | `HomePage` | 소개 + 최근 리뷰 3건 |
| `/reviews` | `ReviewListPage` | 전체 목록 + 지역/평점 필터 |
| `/reviews/new` | `ReviewNewPage` | 리뷰 등록 |
| `/reviews/:id` | `ReviewDetailPage` | 상세 + 수정/삭제 |
| `/reviews/:id/edit` | `ReviewEditPage` | 리뷰 수정 |
| `*` | `NotFoundPage` | 존재하지 않는 주소 |

### 라우트 순서가 중요한 이유

`App.jsx`에서 `/reviews/new`를 `/reviews/:id`보다 **위에** 배치했습니다.

```jsx
<Route path="/reviews/new" element={<ReviewNewPage />} />
<Route path="/reviews/:id" element={<ReviewDetailPage />} />
```

`:id`는 임의의 문자열을 받으므로, 순서가 반대라면 `/reviews/new` 접속 시 `id = "new"`인 상세 페이지로 매칭됩니다.

### 공통 레이아웃

`Layout` 컴포넌트가 헤더·푸터를 담고, 가운데 `<Outlet />` 자리에 자식 라우트의 화면이 들어갑니다. 페이지를 이동해도 헤더·푸터는 다시 그려지지 않습니다.

```jsx
<Route element={<Layout />}>
  <Route path="/" element={<HomePage />} />
  ...
</Route>
```

---

## 7. 재사용 컴포넌트 (13개)

| 컴포넌트 | 주요 props | 역할 |
|---|---|---|
| `Button` | `variant`, `size`, `loading`, `disabled` | 4가지 스타일, 전송 중 자동 비활성화 |
| `Field` | `id`, `label`, `error`, `hint`, `required` | 라벨 + 오류 표시 공통 껍데기 |
| `Input` | `id`, `label`, `value`, `error` | 한 줄 입력 |
| `Textarea` | `value`, `maxLength`, `error` | 여러 줄 입력 + 글자 수 카운터 |
| `Select` | `options`, `value`, `error` | 지역 선택 |
| `RatingInput` | `value`, `onChange`, `error` | 별점 1~5 |
| `ReviewForm` | `initialValues`, `submitLabel`, `onSubmit` | 등록·수정 공용 폼 |
| `ReviewCard` | `review` | 목록 카드 |
| `FilterBar` | `options`, `value`, `onChange` | 필터 칩 묶음 |
| `Loading` | `message` | 로딩 스피너 |
| `ErrorState` | `title`, `message`, `onRetry` | 에러 + 재시도 |
| `EmptyState` | `title`, `description`, `actionTo` | 빈 상태 |
| `ConfirmDialog` | `open`, `title`, `loading`, `onConfirm` | 삭제 확인 모달 |

### 페이지 컴포넌트와 UI 컴포넌트의 분리

`components/`의 파일들은 **자기가 어디에 쓰이는지 모릅니다.** `ReviewCard`는 홈에서도 목록에서도 동일하게 동작하고, 데이터를 직접 가져오지 않습니다. 반대로 `pages/`의 파일들은 라우트 파라미터를 읽고 훅을 호출하지만, 세부 UI는 컴포넌트에 위임합니다.

### ReviewForm을 등록·수정이 공유하는 이유

화면은 다르지만 입력 필드, 검증 규칙, 제출 중 처리가 동일합니다. 다른 점은 초기값(`initialValues`)과 제출 시 호출할 함수(`onSubmit`)뿐이라, 이 둘을 props로 받아 하나의 컴포넌트로 통합했습니다.

수정 페이지에서는 데이터가 도착한 뒤에만 폼을 렌더링합니다.

```jsx
{status === 'success' && review && (
  <ReviewForm initialValues={{ ... }} ... />
)}
```

`useState`의 초기값은 첫 렌더링에서 한 번만 적용되므로, 데이터가 오기 전에 폼을 그리면 빈 값으로 고정됩니다.

---

## 8. 상태 관리

### 상태를 어디에 두었는가

| 상태 | 위치 | 이유 |
|---|---|---|
| 리뷰 목록 데이터 | `useReviews` 훅 | 홈·목록 두 페이지가 같은 로직을 사용 |
| 상세 데이터 | `useReviewDetail` 훅 | 상세·수정 두 페이지가 공유 |
| 필터 선택값 | `ReviewListPage` | 목록 페이지 밖에서는 의미 없음 |
| 폼 입력값·오류 | `ReviewForm` | 폼 내부에서만 쓰이고 제출 시 부모로 전달 |
| 삭제 모달 열림 여부 | `ReviewDetailPage` | 모달을 여는 주체가 페이지 |

원칙은 **그 상태를 필요로 하는 컴포넌트들의 가장 가까운 공통 조상에 둔다**는 것입니다. 필요 이상으로 위에 두면 관련 없는 컴포넌트까지 다시 렌더링되고, 너무 아래 두면 형제 컴포넌트가 값을 공유할 수 없습니다.

### props와 state의 차이

- **state**: 컴포넌트가 직접 소유하고 변경할 수 있는 값
- **props**: 부모에게서 받은 값. 자식은 읽기만 하고 바꿀 수 없음

데이터는 위에서 아래로 흐르고(props), 변경 요청은 아래에서 위로 올라갑니다(콜백 함수).

`RatingInput`이 그 예입니다. 현재 점수는 `value` prop으로 내려받고, 사용자가 별을 누르면 `onChange(score)`를 호출해 부모에게 알립니다. 실제 값 변경은 부모인 `ReviewForm`이 수행합니다.

### 불변성을 지키는 이유

```jsx
setValues((prev) => ({ ...prev, [field]: value }));
```

기존 객체를 직접 수정하지 않고 새 객체를 만듭니다. React는 이전 상태와 새 상태를 **참조로 비교**하기 때문에, 같은 객체의 속성만 바꾸면 변경을 감지하지 못해 화면이 갱신되지 않습니다.

함수형 갱신(`prev => ...`)을 쓴 이유는 따로 있습니다. state 갱신은 즉시 반영되지 않아, `setValues({ ...values, name })`처럼 쓰면 연속 호출 시 오래된 값을 기준으로 계산될 수 있습니다.

---

## 9. 커스텀 훅

데이터 조회 로직을 `useReviews`, `useReviewDetail` 두 개의 훅으로 분리했습니다.

### 분리한 이유

홈과 목록 페이지가 동일한 목록 데이터를 필요로 하는데, 두 곳에 같은 `useState` + `useEffect` 코드를 복사하면 한쪽만 수정하는 실수가 생깁니다. 훅으로 묶으면 호출 한 줄로 끝납니다.

```jsx
const { reviews, status, errorMessage, reload } = useReviews();
```

### useEffect의 실행 시점

```jsx
useEffect(() => {
  load();
}, [load]);
```

`useEffect`는 렌더링이 화면에 반영된 **직후** 실행됩니다. 두 번째 인자인 의존성 배열의 값이 바뀔 때만 다시 실행됩니다.

| 배열 | 실행 시점 |
|---|---|
| `[]` | 최초 1회 |
| `[id]` | `id`가 바뀔 때마다 |
| 생략 | 매 렌더링마다 (무한 루프 위험) |

`useReviewDetail`은 `[id]`에 의존하므로, `/reviews/1`에서 `/reviews/2`로 이동하면 자동으로 새 데이터를 불러옵니다.

### useCallback이 필요한 이유

컴포넌트가 렌더링될 때마다 함수는 새로 만들어집니다. `load`가 매번 새 함수라면 `useEffect`는 의존성이 바뀌었다고 판단해 다시 실행하고, 그 안의 `setState`가 또 렌더링을 일으켜 **무한 루프**가 됩니다.

`useCallback`으로 감싸면 의존성이 바뀌지 않는 한 같은 함수 참조를 유지해 루프가 끊깁니다.

---

## 10. 비동기 처리와 상태 표현

### 4가지 상태

모든 데이터 화면이 동일한 상태 값을 사용합니다.

| status | 화면 |
|---|---|
| `loading` | `<Loading />` — 스피너 + 안내 문구 |
| `success` | 데이터 렌더링 |
| `error` | `<ErrorState onRetry={reload} />` — 메시지 + 재시도 버튼 |
| `empty` / `notfound` | `<EmptyState />` — 안내 + 다음 행동 유도 |

성공했는데 결과가 0건인 경우를 `empty`로 따로 둔 이유는, 화면이 비어 있으면 사용자가 고장으로 오인하기 때문입니다.

### async/await와 try/catch

```jsx
const load = useCallback(async () => {
  setStatus('loading');
  try {
    const data = await fetchReviews();
    setReviews(data);
    setStatus('success');
  } catch (error) {
    setErrorMessage(error.message);
    setStatus('error');
  }
}, []);
```

`await`는 요청이 끝날 때까지 다음 줄로 넘어가지 않게 합니다. `.then()` 체인보다 위에서 아래로 읽히기 때문에 흐름 파악이 쉽습니다.

성공 경로는 `try`에, 실패 경로는 `catch`에 두어 두 갈래가 코드상으로 분리됩니다.

### Supabase 오류를 throw로 변환한 이유

Supabase SDK는 실패해도 예외를 던지지 않고 `{ data, error }` 형태로 반환합니다. 그대로 두면 `catch`가 동작하지 않으므로, `lib/reviews.js`에서 명시적으로 변환합니다.

```js
const { data, error } = await supabase.from('reviews').select('*');
if (error) throw new Error(error.message);
return data ?? [];
```

이렇게 하면 훅에서는 Supabase의 반환 규약을 몰라도 되고, 일반적인 `try/catch` 패턴으로 통일됩니다.

---

## 11. 이벤트 → 상태 변경 → 렌더링

미션 요구사항인 "상태 변경이 렌더링 변화로 이어지는 지점 3곳 이상"에 해당하는 흐름입니다.

### 흐름 1 — 필터 변경 → 목록 갱신

```
사용자가 '서울 중구' 칩 클릭
  → FilterBar의 onClick이 onChange('서울 중구') 호출
  → ReviewListPage의 setRegion으로 state 변경
  → 리렌더링
  → useMemo가 region 변경을 감지하고 필터링 재실행
  → visibleReviews 배열이 바뀜
  → 카드 목록과 "N개 표시" 문구가 갱신됨
```

서버에 다시 요청하지 않습니다. 이미 받아 둔 배열에서 걸러내기 때문에 즉시 반응합니다.

### 흐름 2 — 별점 클릭 → 캡션 변경

```
사용자가 4번째 별 클릭
  → onChange(4) 호출
  → ReviewForm의 setField('rating', 4)
  → values.rating이 4로 변경
  → 리렌더링
  → 별 4개에 filled 클래스 적용, 캡션이 "좋아요"로 바뀜
  → 평점 오류가 떠 있었다면 함께 사라짐
```

### 흐름 3 — 폼 제출 → 전송 중 상태

```
저장 버튼 클릭
  → handleSubmit 실행, event.preventDefault()
  → validateReview로 검증 → 오류 있으면 setErrors 후 중단
  → 통과하면 setSubmitting(true)
  → 리렌더링: 버튼이 "저장 중..."으로 바뀌고 비활성화, 스피너 표시
  → await onSubmit(payload)
  → 성공 시 navigate로 상세 페이지 이동
  → 실패 시 setServerError → 폼 상단에 빨간 메시지
```

`disabled={disabled || loading}`으로 중복 제출을 막습니다.

### 흐름 4 — 삭제 → 목록 이동

```
삭제 버튼 클릭 → setConfirmOpen(true) → 모달 렌더링
확인 클릭 → setDeleting(true) → 확인 버튼 비활성화
  → await deleteReview(id)
  → navigate('/reviews', { replace: true })
  → 목록 페이지가 마운트되며 useReviews가 다시 조회
  → 삭제된 항목이 사라진 목록 표시
```

---

## 12. 폼 검증

### 검증 규칙

| 필드 | 규칙 |
|---|---|
| 가게명 | 필수, 40자 이내 |
| 지역 | 필수, 지정된 목록에 포함 |
| 평점 | 필수 (1~5) |
| 후기 | 필수, 10자 이상 500자 이내 |

### 검증 시점

- **제출 시**: 전체 검증. 오류가 있으면 첫 번째 오류 필드로 포커스 이동
- **입력 중**: 이미 오류가 떠 있는 필드만 오류 해제

처음 입력하는 도중에 계속 빨간 메시지가 뜨면 사용자가 불쾌하므로, 한 번 오류가 난 필드에 한해 즉시 피드백합니다.

### 검증 로직을 분리한 이유

`lib/validateReview.js`에 순수 함수로 두었습니다.

```js
export function validateReview(values) {
  const errors = {};
  // ...
  return errors;  // { name: '...', region: '...' } 또는 {}
}
```

React에 의존하지 않는 순수 함수라 테스트하기 쉽고, 등록·수정 두 화면이 같은 규칙을 보장받습니다.

### 서버 오류 처리

네트워크 실패나 Supabase 오류는 `onSubmit`이 던진 예외를 폼이 받아 상단에 표시합니다.

```jsx
catch (error) {
  setServerError(error.message || '저장에 실패했습니다. 다시 시도해 주세요.');
  setSubmitting(false);
}
```

이때 `setSubmitting(false)`로 버튼을 되살려 사용자가 재시도할 수 있게 합니다. 성공 시에는 페이지가 이동하므로 되돌릴 필요가 없습니다.

---

## 13. 성능 최적화

### useMemo 적용

```jsx
const visibleReviews = useMemo(() => {
  return reviews
    .filter((review) => region === 'all' || review.region === region)
    .filter((review) => minRating === 'all' || review.rating >= Number(minRating));
}, [reviews, region, minRating]);
```

`reviews`, `region`, `minRating` 중 하나라도 바뀌지 않으면 이전 계산 결과를 재사용합니다. 지역 목록을 추출하는 `regionFilters`에도 같은 방식을 적용했습니다.

현재 데이터 규모에서는 체감 차이가 크지 않지만, 리뷰가 수백 건으로 늘어나면 필터 연산이 매 렌더링마다 반복되는 것을 막아 줍니다.

### 적용하지 않은 것

`React.memo`와 `useCallback`을 모든 컴포넌트에 적용하지는 않았습니다. 메모이제이션 자체에도 비용이 있어, 실제 병목이 확인되지 않은 상태에서 남용하면 코드만 복잡해집니다. `useCallback`은 무한 루프를 막아야 하는 훅 내부에만 사용했습니다.

---

## 14. 접근성

| 항목 | 구현 |
|---|---|
| 라벨 연결 | 모든 입력에 `<label htmlFor>` + `id` |
| 오류 안내 | `aria-invalid`, `aria-describedby`로 오류 문구 연결 |
| 로딩 안내 | `role="status"`, `aria-live="polite"` |
| 오류 안내 | `role="alert"`로 즉시 읽힘 |
| 별점 | `<button>` 요소로 구현해 키보드 조작 가능, `aria-pressed`로 선택 상태 전달 |
| 모달 | `role="dialog"`, `aria-modal`, `Esc`로 닫기 |
| 장식 요소 | 스피너·아이콘에 `aria-hidden="true"` |

---

## 15. 배포 설정

### vercel.json

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

SPA는 실제 HTML 파일이 `index.html` 하나뿐입니다. 사용자가 `/reviews/3`을 주소창에 직접 입력하면 서버는 그 경로의 파일을 찾다가 404를 반환합니다.

이 설정은 모든 요청을 `index.html`로 돌려보내고, 이후 React Router가 주소를 해석해 알맞은 컴포넌트를 렌더링하게 합니다. 이 파일이 없으면 새로고침과 직접 접속에서 404가 발생합니다.

### 배포 흐름

`main` 브랜치에 푸시하면 Vercel이 자동으로 빌드하고 배포합니다.

```bash
git add .
git commit -m "변경 내용"
git push
```

---

## 16. 개발 중 겪은 문제와 해결

| 문제 | 원인 | 해결 |
|---|---|---|
| `Failed to resolve import "react-router-dom"` | 패키지 미설치 | `npm install react-router-dom @supabase/supabase-js` |
| Supabase 요청이 404 | URL에 `/rest/v1`이 포함되어 경로 중복 | 환경변수를 도메인까지만 수정 후 서버 재시작 |
| 컴포넌트를 못 찾음 | `ConfirmDialog`를 `pages/`에 생성 | `components/`로 이동 |
| CSS Module 미적용 | 파일명이 `ReviewLIstPage.module.css` | 대소문자 수정. macOS는 구분하지 않지만 Vite와 배포 서버는 구분 |
| 배포 후 새로고침 시 404 | SPA 리라이트 설정 없음 | `vercel.json` 추가 |

---

## 17. 개선 여지

- 인증 도입 후 RLS 정책을 작성자 기준으로 제한
- 목록 페이지네이션 또는 무한 스크롤
- 낙관적 업데이트로 삭제·수정 체감 속도 개선
- 검색 기능 (가게명 부분 일치)
- 사진 업로드 (Supabase Storage)
