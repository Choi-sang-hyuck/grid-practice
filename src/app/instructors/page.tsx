import { getDb } from '@/db'
import { instructors } from '@/db/schema'

/* 열 때마다 DB에서 다시 읽습니다. 빌드할 때 미리 만들어 두지 않습니다. */
export const dynamic = 'force-dynamic'

/* 이 함수는 server에서만 돕니다. DATABASE_URL은 여기서만 읽힙니다. */
async function load() {
  const db = getDb()
  return db.select().from(instructors).orderBy(instructors.id)
}

export default async function Instructors() {
  let rows: Awaited<ReturnType<typeof load>> | null = null
  let error: string | null = null

  try {
    rows = await load()
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }

  return (
    <main className="wrap">
      <h1>강의자</h1>
      <p className="lead">
        이름 위에 마우스를 올리면 사진이 나타납니다. 사진 주소는{' '}
        <code>instructors.photo_url</code>에 들어 있고, 이 목록은 server에서
        읽어서 내려보냅니다.
      </p>

      {error ? (
        <div className="card warn">
          <h3>강의자를 읽지 못했습니다</h3>
          <pre style={{ margin: '.6rem 0 0' }}>{error}</pre>
          <p style={{ marginTop: '.9rem', marginBottom: 0 }}>
            <code>npm run db:generate</code>와 <code>npm run db:migrate</code>를
            먼저 실행합니다.
          </p>
        </div>
      ) : null}

      {rows && rows.length === 0 ? (
        <p className="muted">아직 등록된 강의자가 없습니다.</p>
      ) : null}

      {rows && rows.length > 0 ? (
        <ul className="people">
          {rows.map((r) => (
            <li key={r.id}>
              {r.photoUrl ? (
                <span className="peek">
                  <span className="who" tabIndex={0}>
                    {r.name}
                  </span>
                  {/* next/image는 호스트를 next.config에 미리 등록해야 합니다.
                      photo_url에는 어떤 주소든 들어올 수 있어서 img를 씁니다. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <span className="shot">
                    <img src={r.photoUrl} alt={`${r.name} 사진`} loading="lazy" />
                    <span className="cap">{r.name}</span>
                  </span>
                </span>
              ) : (
                <span className="who-plain">{r.name}</span>
              )}

              <span className="muted meta">
                {[r.organization, r.expertise].filter(Boolean).join(' · ')}
              </span>

              <div className="mail">{r.email}</div>
              {r.bio ? <div className="bio">{r.bio}</div> : null}
            </li>
          ))}
        </ul>
      ) : null}

      <h2>사진이 안 보이면</h2>
      <p className="muted">
        <code>photo_url</code>이 비어 있으면 이름에 점선이 없고 마우스를 올려도
        아무 일도 일어나지 않습니다. Drizzle Studio에서 값을 채워 넣으면 바로
        나타납니다.
      </p>
    </main>
  )
}
