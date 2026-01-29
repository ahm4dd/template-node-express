import argon2 from "argon2";

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
};

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(data: {
  password: string;
  hash: string;
}): Promise<boolean> {
  return argon2.verify(data.hash, data.password);
}
