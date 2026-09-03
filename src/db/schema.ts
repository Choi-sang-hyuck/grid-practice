import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

/* 회원가입으로 만들어지는 계정. 비밀번호는 평문이 아니라 bcrypt 해시만 저장한다. */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/* 실습용 표 하나. 이 파일이 "코드가 원하는 DB 구조"다.
   여기에 column을 하나 더한 뒤 db:generate, db:migrate를 실행하면
   실제 DB가 이 모양을 따라온다. */
export const participants = pgTable('participants', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  /* 학습시간. 단위는 시간이고, 아직 안 채운 사람은 0이다. */
  studyHours: integer('study_hours').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
