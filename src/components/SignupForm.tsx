'use client'

import { useState } from 'react'

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError(null)

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      setError(data.error ?? '가입에 실패했습니다.')
      setStatus('idle')
      return
    }

    setStatus('done')
  }

  if (status === 'done') {
    return (
      <div className="card ok">
        <p style={{ marginBottom: 0 }}>가입되었습니다: {email}</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        aria-label="이메일"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호 (8자 이상)"
        aria-label="비밀번호"
        minLength={8}
        required
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? '가입 중...' : '회원가입'}
      </button>
      {error ? <p style={{ color: 'var(--danger)', margin: 0 }}>{error}</p> : null}
    </form>
  )
}
