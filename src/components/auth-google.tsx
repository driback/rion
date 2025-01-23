import { cookies } from 'next/headers';
import { COOKIE_NAME } from '~/lib/constants';
import ConnectGoogle from './connect-google';
import DisconnectGoogle from './disconnect-google';

const AuthGoogle = async () => {
  const cookieStore = await cookies();
  const googleSub = cookieStore.get(COOKIE_NAME.GOOGlE_SUB)?.value;

  return googleSub ? <DisconnectGoogle /> : <ConnectGoogle />;
};

export default AuthGoogle;
