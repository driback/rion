import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import crypto from 'node:crypto';

export const user = pgTable('user', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).notNull(),
  username: text('username').unique(),
});

export const session = pgTable('session', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  expiresAt: timestamp('expires_at', { precision: 3, mode: 'date' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
});

export const account = pgTable('account', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', {
    precision: 3,
    mode: 'date',
  }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {
    precision: 3,
    mode: 'date',
  }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).notNull(),
});

export const verification = pgTable('verification', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { precision: 3, mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).notNull(),
});

export const integration = pgTable('integration', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name').unique(),
});

export const integrationToUser = pgTable('integration_to_user', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  integrationId: text('integration_id')
    .references(() => integration.id)
    .notNull(),
  userId: text('user_id')
    .references(() => user.id)
    .notNull(),
});

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const integrationToUserRelations = relations(
  integrationToUser,
  ({ one }) => ({
    integration_integrationId: one(integration, {
      fields: [integrationToUser.integrationId],
      references: [integration.id],
      relationName: 'integrationToUser_integrationId_integration_id',
    }),
    integration_userId: one(integration, {
      fields: [integrationToUser.userId],
      references: [integration.id],
      relationName: 'integrationToUser_userId_integration_id',
    }),
  })
);

export const integrationRelations = relations(integration, ({ many }) => ({
  integrationToUsers_integrationId: many(integrationToUser, {
    relationName: 'integrationToUser_integrationId_integration_id',
  }),
  integrationToUsers_userId: many(integrationToUser, {
    relationName: 'integrationToUser_userId_integration_id',
  }),
}));
