import type { Credentials } from 'google-auth-library';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { COOKIE_CONFIG } from '~/configs/cookie';
import { oAuth2Client } from '~/configs/google-auth';
import { COOKIE_NAME } from '~/lib/constants';
import { RedisClient } from '~/server/redis/client';
import { RedisHashRepository } from '~/server/redis/hash-repository';
import { KEYS } from '~/server/redis/keys';

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    const cookieStore = await cookies();
    const storedState = cookieStore.get(COOKIE_NAME.GOOGLE_OAUTH_STATE)?.value;

    if (!code || !state || !storedState) {
      return NextResponse.json(
        { message: 'Missing required OAuth parameters' },
        { status: 400 }
      );
    }

    if (state !== storedState) {
      return NextResponse.json(
        { message: 'Invalid state parameter' },
        { status: 400 }
      );
    }

    const { res, tokens } = await oAuth2Client.getToken({
      code,
    });

    if (res?.status !== 200 || !tokens.access_token) {
      return NextResponse.json(
        { message: 'Failed to get token' },
        { status: 401 }
      );
    }

    const userInfo = await oAuth2Client.getTokenInfo(tokens.access_token);
    if (!userInfo.sub) {
      return NextResponse.json(
        { message: 'Failed to get user info' },
        { status: 401 }
      );
    }

    const credentialsCache = new RedisHashRepository<Required<Credentials>>(
      KEYS.GOOGLE_CREDENTIALS(userInfo.sub),
      RedisClient
    );
    void credentialsCache.setAll(tokens);

    cookieStore.set(COOKIE_NAME.GOOGlE_SUB, userInfo.sub, {
      ...COOKIE_CONFIG,
      maxAge: userInfo.expiry_date,
    });

    cookieStore.delete(COOKIE_NAME.GOOGLE_OAUTH_STATE);

    return NextResponse.redirect(new URL('/', req.url));
  } catch {
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 500 }
    );
  }
};
