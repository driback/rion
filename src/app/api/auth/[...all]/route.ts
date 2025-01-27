import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '~/configs/auth';

export const config = { api: { bodyParser: false } };

export const { GET, POST } = toNextJsHandler(auth.handler);
