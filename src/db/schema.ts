import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

/* 실습용 표 하나. 이 파일이 "코드가 원하는 DB 구조"다.
   여기에 column을 하나 더한 뒤 db:generate, db:migrate를 실행하면
   실제 DB가 이 모양을 따라온다. */
export const participants = pgTable('participants', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/* 강의자 정보. participants와 달리 연락처와 소개를 함께 담는다.
   email은 사람을 구분하는 값이라 UNIQUE로 둔다.
   bio, organization, expertise, photoUrl은 없을 수도 있어서 NOT NULL을 걸지 않는다. */
export const instructors = pgTable('instructors', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  bio: text('bio'),
  organization: text('organization'),
  expertise: text('expertise'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
