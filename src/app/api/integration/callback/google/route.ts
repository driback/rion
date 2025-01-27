import type { Credentials } from 'google-auth-library';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { oAuth2Client } from '~/configs/google-auth';
import { COOKIE_NAME } from '~/lib/constants';
import { db } from '~/server/db/client';
import { integrationToUser } from '~/server/db/schemas';
import { RedisClient } from '~/server/redis/client';
import { RedisHashRepository } from '~/server/redis/hash-repository';
import { KEYS } from '~/server/redis/keys';

let googleDriveIntegrationId: string | null = null;

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('rion.session_token')?.value;
    const storedState = cookieStore.get(COOKIE_NAME.GOOGLE_OAUTH_STATE)?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { message: 'Session token not found' },
        { status: 400 }
      );
    }

    if (!code || !state || !storedState || state !== storedState) {
      return NextResponse.json(
        { message: 'Invalid OAuth parameters' },
        { status: 400 }
      );
    }

    const { tokens } = await oAuth2Client.getToken({ code });
    if (!tokens?.access_token) {
      return NextResponse.json(
        { message: 'Failed to get access token' },
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

    const sessionTokenPart = sessionToken.split('.')[0];
    const sessionWithUser = await db.query.session.findFirst({
      where: (se, { eq }) => eq(se.token, sessionTokenPart),
      with: { user: true },
    });

    if (!sessionWithUser?.user) {
      return NextResponse.json(
        { message: 'Invalid session or user' },
        { status: 400 }
      );
    }

    if (!googleDriveIntegrationId) {
      const integration = await db.query.integration.findFirst({
        where: (se, { eq }) => eq(se.name, 'google-drive'),
      });
      if (!integration) {
        return NextResponse.json(
          { message: 'Google Drive integration missing' },
          { status: 500 }
        );
      }
      googleDriveIntegrationId = integration.id;
    }

    const credentialsCache = new RedisHashRepository<Required<Credentials>>(
      KEYS.GOOGLE_CREDENTIALS(sessionWithUser.userId),
      RedisClient
    );

    await Promise.all([
      db.insert(integrationToUser).values({
        userId: sessionWithUser.user.id,
        integrationId: googleDriveIntegrationId,
      }),
      credentialsCache.setAll(tokens),
    ]);

    cookieStore.set(COOKIE_NAME.GOOGLE_INTEGRATION, 'connected');
    cookieStore.delete(COOKIE_NAME.GOOGLE_OAUTH_STATE);

    return NextResponse.redirect(new URL('/', req.url));
  } catch (error) {
    console.error('OAuth error:', error);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 500 }
    );
  }
};
