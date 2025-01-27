import { hash, verify } from '@node-rs/argon2';

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
};

export const verifyPasswordHash = async ({
  hash,
  password,
}: { hash: string; password: string }): Promise<boolean> => {
  return await verify(hash, password);
};
