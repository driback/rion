import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { username } from 'better-auth/plugins';
import { env } from '~/env';
import { TIME } from '~/lib/constants';
import { hashPassword, verifyPasswordHash } from '~/lib/password';
import { db } from '~/server/db/client';

export const auth = betterAuth({
  appName: 'rion',
  advanced: { cookiePrefix: 'rion', generateId: false },
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    password: { hash: hashPassword, verify: verifyPasswordHash },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    freshAge: 0,
    expiresIn: TIME.MONTH,
    updateAge: TIME.DAY,
    cookieCache: {
      enabled: true,
      maxAge: TIME.MINUTE * 5,
    },
  },
  trustedOrigins: !env.VERCEL_URL
    ? ['http://127.0.0.1:3000']
    : [env.VERCEL_URL],
  plugins: [username()],
});
