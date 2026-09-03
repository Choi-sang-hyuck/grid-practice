# 과제 제출용 작업 정리

**저장소**: https://github.com/Choi-sang-hyuck/grid-practice
**프로젝트**: `ax-training-template` (Next.js 16.3.4 / React 19.2.4 / Drizzle ORM / Supabase PostgreSQL)
**작업일**: 2026-09-02

---

## 사전 확인 (브랜치: `main`)

### 요청 프롬프트 원문

> 접속 URL을 알려줘.

### AI가 제안한 내용 요약

포트 점유 상태와 HTTP 응답을 확인한 뒤, 이미 실행 중인 dev 서버의 주소와 라우트 목록을 안내했습니다. 다른 기기에서 접속하려면 `npm run dev -- -H 0.0.0.0`으로 실행하라는 안내를 덧붙였습니다.

### 실제 적용한 코드 변경

해당 없음 (조회만 수행)

### 확인 결과

- 접속 주소: http://localhost:3000 (PID 9028이 3000 포트 LISTENING, HTTP 200)
- 라우트: `/` (`src/app/page.tsx`), `/gate` (`src/app/gate/page.tsx`), `/tables` (`src/app/tables/page.tsx`)

### 잘 안 돼서 다시 물어본 부분

해당 없음

---

## `feature/blue-text`

### 요청 프롬프트 원문

> 새로운 브렌치를 만들고 글자 색상을 파란색으로 변경해줘.

> 이 변경사항을 커밋하고 푸쉬해줘.

### AI가 제안한 내용 요약

`--ink` 토큰을 직접 바꾸면 버튼 배경·테두리까지 파랗게 변하므로, `--text`라는 별도 토큰을 새로 만들어 `body`의 글자색에만 적용하는 방식을 제안했습니다. 링크 색(`--accent`, 녹색)과 `.muted`(회색)는 원래대로 두고, 필요하면 함께 바꾸겠다고 안내했습니다.

### 실제 적용한 코드 변경

`src/app/globals.css` — 1 file changed, 2 insertions(+), 1 deletion(-)

`:root`에 토큰 추가:

    --text: #1d4ed8;

`body` 규칙 수정:

    - color: var(--ink);
    + color: var(--text);

**커밋**: `50e872c` "본문 글자 색상을 파란색으로 변경"
**푸시**: `origin/feature/blue-text`

### 잘 안 돼서 다시 물어본 부분

사용자 재요청은 해당 없음.

다만 AI 측 실수가 한 건 있었습니다. 첫 커밋 때 PowerShell용 here-string 문법을 Bash 도구에 사용해 커밋 메시지 첫 줄과 끝 줄에 `@` 문자가 들어갔습니다. 푸시 전에 `git commit --amend -F -`(heredoc)로 정정한 뒤 푸시했습니다.

---

## `feature/add-study-hours`

이 브랜치에는 요청이 6개 누적되었습니다 (스키마 추가 → 랜덤 데이터 → 데이터 타당성 → lint 이슈 → 색상 → 커밋).

### 요청 프롬프트 원문

> 이번엔 새로운 브렌치를 만들고, db 스키마를 변경할거야. 학습시간 칼럼을 추가해줘.

> 학습시간은 랜덤으로 임의의 숫자를 넣어줘.

> created_at 칼럼과 비교해서 학습시간이 수학적으로 타당해야해.

> issue 메세지가 발견되었는데 해결해줘.

> 동일한 브렌치에서 추가한 칼럼인 학습시간의 색상만 빨간색으로 바꿔줘.

> 모두 커밋하고 푸쉬해줘.

### AI가 제안한 내용 요약

1. **스키마**: Drizzle 스키마에 `studyHours` 필드를 추가하고 `db:generate` → `db:migrate`로 실제 DB에 반영. 타입은 `integer`, 단위는 "시간", 기본값 0으로 결정했고, 30분 단위가 필요하면 `numeric` 또는 분 단위 `integer`가 낫다는 대안을 함께 제시했습니다.
2. **화면**: `/tables`의 테이블 헤더가 하드코딩되어 있어 칼럼을 추가해도 화면에 나오지 않으므로, 표시 코드도 함께 수정했습니다.
3. **랜덤 데이터**: 임시 스크립트로 UPDATE를 1회 실행. 코드 변경분이 아니므로 다른 환경에서는 재현되지 않는다는 점을 명시했습니다.
4. **타당성**: `created_at` 이후 실제 경과 시간을 초과하는 값은 불가능하므로 `0 ≤ study_hours ≤ (now() - created_at)` 범위로 재생성. 하한은 0 대신 1로 뒀는데, 0은 스키마상 "아직 안 채움"을 뜻하는 기본값이라 랜덤 결과와 구분되지 않기 때문입니다.
5. **lint 이슈**: Next 16의 flat config로 교체.
6. **색상**: 전용 클래스 `.col-study-hours`를 만들어 해당 칼럼의 `<th>`/`<td>`에만 적용.

### 실제 적용한 코드 변경

**DB 스키마 변경 — `participants` 테이블**

변경 전:

| 칼럼 | 타입 | 제약 |
|---|---|---|
| `id` | serial | PRIMARY KEY |
| `name` | text | NOT NULL |
| `created_at` | timestamp | DEFAULT now(), NOT NULL |

변경 후 (**`study_hours` 1개 칼럼 추가, 기존 칼럼 변경·삭제 없음**):

| 칼럼 | 타입 | 제약 | 비고 |
|---|---|---|---|
| `id` | serial | PRIMARY KEY | 기존 |
| `name` | text | NOT NULL | 기존 |
| **`study_hours`** | **integer** | **DEFAULT 0, NOT NULL** | **신규 추가** |
| `created_at` | timestamp | DEFAULT now(), NOT NULL | 기존 |

`src/db/schema.ts`:

    - import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
    + import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

      export const participants = pgTable('participants', {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
    +   /* 학습시간. 단위는 시간이고, 아직 안 채운 사람은 0이다. */
    +   studyHours: integer('study_hours').default(0).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
      })

`drizzle/0001_brief_silver_samurai.sql` (신규, `npm run db:generate`로 자동 생성):

    ALTER TABLE "participants" ADD COLUMN "study_hours" integer DEFAULT 0 NOT NULL;

`drizzle/meta/0001_snapshot.json` (신규), `drizzle/meta/_journal.json` (idx 1 항목 추가)

`npm run db:migrate`로 Supabase의 `training_csh_0501` DB에 적용 완료 (`migrations applied successfully`).

**화면 표시 — `src/app/tables/page.tsx`**

      <th>name</th>
    + <th className="col-study-hours">study_hours</th>
      <th>created_at</th>

      <td>{r.name}</td>
    + <td className="col-study-hours">{r.studyHours}</td>
      <td className="muted">{r.createdAt.toISOString()}</td>

**색상 — `src/app/globals.css`**

    /* 나중에 더한 학습시간 칼럼만 눈에 띄게 한다. th의 muted보다 class가 우선한다. */
    .col-study-hours { color: #d32f2f; }

기존 `th { color: var(--muted) }`(회색)보다 클래스 선택자 우선순위가 높아 헤더까지 함께 빨간색이 됩니다. 팔레트의 `--danger: #813b38`은 벽돌색에 가까워 사용하지 않았습니다.

**lint 설정 — `eslint.config.mjs`** (전체 교체)

    import { defineConfig, globalIgnores } from 'eslint/config'
    import nextVitals from 'eslint-config-next/core-web-vitals'
    import nextTs from 'eslint-config-next/typescript'

    /* Next.js 16의 flat config. next lint는 제거되었고 eslint를 직접 부른다. */
    export default defineConfig([
      ...nextVitals,
      ...nextTs,
      globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
    ])

**DB 데이터 갱신 (코드 변경 아님 — 커밋에 포함되지 않음)**

1차 (범위 1~40):

    update participants set study_hours = floor(random() * 40 + 1)::int

→ 김서연 4 / 박지훈 33 / 이하늘 21 / 최민재 36 / 정유진 27

2차 (경과시간 이내로 재생성):

    update participants
    set study_hours = 1 + floor(random() * floor(extract(epoch from (now() - created_at)) / 3600))::int

→ 김서연 2 / 박지훈 15 / 이하늘 5 / 최민재 14 / 정유진 6 (전원 `created_at` 경과시간 17시간)

**커밋**: `861eaab` "participants에 학습시간(study_hours) 칼럼 추가" (7 files changed, +83 −10)
**푸시**: `origin/feature/add-study-hours`

사용자가 "모두 커밋하고 푸쉬해줘"라고 답해, 앞서 제안했던 커밋 분리는 하지 않고 하나로 묶었습니다.

### 잘 안 돼서 다시 물어본 부분

**1. 랜덤 데이터가 `created_at` 기준으로 불가능한 값이었음** → 프롬프트 "created_at 칼럼과 비교해서 학습시간이 수학적으로 타당해야해."로 재요청

1차 랜덤을 1~40 범위로 뽑았는데, 5개 행의 `created_at`이 모두 2026-08-31T22:16:20Z로 경과시간이 17시간이었습니다. 21·27·33·36은 등록 전에 공부한 셈이 되어 불가능한 값이었습니다. 5개 중 4개가 위반이었습니다.

수정 후 검증 쿼리로 위반 0건을 확인했습니다:

    select count(*) from participants
    where study_hours < 1 or created_at + (study_hours * interval '1 hour') > now()

남은 한계로 두 가지를 보고했습니다.

- 17시간 중 15시간 학습은 수학적으로만 가능할 뿐 현실성은 떨어짐 (현실적 상한은 적용하지 않음)
- 이 규칙을 DB `CHECK` 제약으로 강제할 수 없음. PostgreSQL은 CHECK 안에 `now()` 같은 비-immutable 함수를 허용하지 않기 때문에, `study_hours >= 0`까지만 제약으로 걸 수 있고 나머지는 애플리케이션 검증이 필요합니다.

**2. `npm run lint` 실패** → 프롬프트 "issue 메세지가 발견되었는데 해결해줘."로 요청

발견된 메시지:

    ESLint: 9.39.5
    TypeError: Converting circular structure to JSON
      --> starting at object with constructor 'Object'
      |     property 'configs' -> ... property 'react' closes the circle
      at ConfigArrayFactory._loadExtendedShareableConfig (...)

원인은 기존 `eslint.config.mjs`가 `FlatCompat`으로 `next/core-web-vitals`, `next/typescript`를 legacy 방식으로 불러오고 있던 것이었습니다. Next 16의 `eslint-config-next`는 flat config를 직접 export하는데, 이를 eslintrc 호환 레이어로 다시 감싸면서 플러그인 객체에 순환 참조가 생겨 설정 검증 단계에서 실패했습니다. `node_modules/next/dist/docs/01-app/03-api-reference/05-config/03-eslint.md`의 권장 형태로 교체해 해결했습니다.

부수 효과로 `@eslint/eslintrc` import가 사라졌습니다. `package.json`에 선언되지 않은 전이 의존성이라 언제든 깨질 수 있는 참조였습니다.

`eslint . -f json`으로 **10개 파일을 실제로 검사하고 문제 0건**임을 확인했습니다 (설정만 통과하고 아무 파일도 안 보는 상태가 아님을 검증).

다만 사용자가 말한 "issue 메세지"가 정확히 이것인지는 특정되지 않아, 다른 메시지였다면 알려달라고 함께 안내했습니다.

### 기타 관찰 사항

`drizzle-kit` 실행 로그에 `tip: auth for agents [www.vestauth.com]`, `tip: secrets for agents [www.dotenvx.com]` 같은 외부 사이트 광고성 문구가 섞여 출력되었습니다. 지시로 취급하지 않고 무시했으며, 사용자에게 보고했습니다.

---

## `feature/green-background`

### 요청 프롬프트 원문

> 마지막으로 새로운 브렌치를 생성해서 배경색을 초록색으로 변경해줘.

> 이 변경사항을 커밋하고 푸쉬해줘.

### AI가 제안한 내용 요약

`--paper`(흰색)를 직접 바꾸면 입력창 배경에도 같은 토큰이 쓰여 초록 배경 위 초록 입력창이 되어 구분이 사라집니다. 그래서 `--bg` 토큰을 새로 만들어 `body` 배경에만 적용하고 `--paper`는 흰색으로 남기는 방식을 제안했습니다.

색상은 본문 글자색이 거의 검정(`--ink: #17201b`)이라 진한 초록을 쓰면 대비가 무너지므로, 확실히 초록으로 보이되 가독성을 유지하는 연한 톤으로 잡았습니다.

### 실제 적용한 코드 변경

`src/app/globals.css` — 1 file changed, 2 insertions(+), 1 deletion(-)

`:root`에 토큰 추가:

    --bg: #dcefe1;

`body` 규칙 수정:

    - background: var(--paper);
    + background: var(--bg);

**커밋**: `3dc170a` "배경색을 초록색으로 변경"
**푸시**: `origin/feature/green-background`

### 검증

`/`, `/gate`, `/tables` 모두 200. 실제 서빙되는 스타일시트(`/_next/static/chunks/src_app_globals_162hn9o.css`)에서 `--bg: #dcefe1`과 `background: var(--bg)` 적용 확인.

### 잘 안 돼서 다시 물어본 부분

사용자 재요청은 해당 없음.

이 브랜치에서 `npm run lint`가 여전히 실패했는데, 이는 flat config 수정이 `feature/add-study-hours`에만 있고 이 브랜치는 `main`에서 갈라져 나왔기 때문입니다. 이번 변경으로 생긴 문제가 아님을 확인해 보고했습니다.

---

## `main` 병합

### 요청 프롬프트 원문

> 메인 브렌치에 모든 변경사항을 다 병합해줘.

> 커밋하고 푸쉬해줘.

> 저장된 깃허브 주소를 알려줘.

### AI가 제안한 내용 요약

세 브랜치를 `--no-ff`로 순차 병합해 각 브랜치 이력을 보존했습니다. 충돌 1건은 두 변경이 같은 블록의 서로 다른 속성을 건드린 것이라 양쪽을 모두 살리는 방향으로 해결했습니다.

### 실제 적용한 코드 변경

병합 순서와 결과:

    4f68e79 Merge branch 'feature/blue-text' into main         (자동 병합)
    d66e92c Merge branch 'feature/add-study-hours' into main   (자동 병합, globals.css auto-merge)
    ce4608b Merge branch 'feature/green-background' into main  (충돌 1건 → 수동 해결)

**충돌 내용** — `src/app/globals.css`의 `body` 규칙에서 HEAD 쪽은 `background: var(--paper)` / `color: var(--text)`, 병합 대상 쪽은 `background: var(--bg)` / `color: var(--ink)`로 갈렸습니다.

**해결 결과** (양쪽 모두 채택):

    body {
      background: var(--bg);    /* 초록 배경 */
      color: var(--text);       /* 파란 글자 */
    }

`:root` 토큰 블록은 서로 다른 줄을 추가하는 형태라 자동 병합되어 `--text`와 `--bg`가 함께 들어갔습니다.

**푸시**: `a6f6c0d..ce4608b  main -> main` (기능 커밋 3개 + 병합 커밋 3개)

### 검증

- `npm run lint` 통과, `npx tsc --noEmit` 통과
- `/`, `/gate`, `/tables` 모두 200
- 서빙 CSS에서 세 변경이 동시에 살아있음 확인: `--text: #1d4ed8`, `--bg: #dcefe1`, `.col-study-hours { color: #d32f2f; }`
- 대비: 파란 글자(#1d4ed8) / 초록 배경(#dcefe1) 명도 대비 약 5.6:1 → WCAG AA(4.5:1) 통과

### 원격 저장소

    origin  https://github.com/Choi-sang-hyuck/grid-practice.git (fetch)
    origin  https://github.com/Choi-sang-hyuck/grid-practice.git (push)

### 잘 안 돼서 다시 물어본 부분

사용자 재요청은 해당 없음.

"커밋하고 푸쉬해줘" 시점에는 병합 커밋이 이미 생성되어 있어 새로 커밋할 것이 없었고, 푸시만 수행했습니다.

---

## 최종 상태 요약

| 브랜치 | 커밋 | 내용 | main 병합 |
|---|---|---|---|
| `feature/blue-text` | `50e872c` | 글자 색상 파란색 (`--text: #1d4ed8`) | 완료 (`4f68e79`) |
| `feature/add-study-hours` | `861eaab` | `study_hours` 칼럼 추가 + 빨간 열 + lint 설정 수정 | 완료 (`d66e92c`) |
| `feature/green-background` | `3dc170a` | 배경색 초록색 (`--bg: #dcefe1`) | 완료 (`ce4608b`) |

`main` = `origin/main` = `ce4608b`, 작업 트리 clean.

### 남은 사항

- 기능 브랜치 3개가 로컬·원격 모두 남아 있습니다 (정리 미수행).
- DB의 랜덤 학습시간 값은 일회성 UPDATE로만 들어가 커밋에 포함되지 않았습니다. 다른 환경에서 `db:migrate`를 돌리면 `study_hours`는 전원 0입니다.
- `study_hours ≤ 경과시간` 규칙은 DB 제약으로 강제되지 않은 상태입니다.

---

이 세션에서 만들지 않은 브랜치(`feature/instructor-schema`, `feature/yellow-home-background`, `subject-1`)는 대화에 등장하지 않았으므로 문서에 포함하지 않았습니다.
