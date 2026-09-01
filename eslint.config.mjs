import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

/* eslint-config-next 16은 flat config를 그대로 내보낸다.
   FlatCompat으로 한 번 더 감싸면 ESLint 9의 설정 검증 단계에서
   "Converting circular structure to JSON"으로 깨진다.
   core-web-vitals 안에 next/typescript가 이미 들어 있다. */
const config = [
  ...nextCoreWebVitals,
  { ignores: ['.next/**', 'node_modules/**'] },
]

export default config
