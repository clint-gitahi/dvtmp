import type { AuthUser } from '@features/auth/slice';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResult = {
  user: AuthUser;
  token: string;
};

const NETWORK_DELAY_MS = 800;

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function mockLogin({
  email,
  password,
}: LoginCredentials): Promise<LoginResult> {
  await new Promise<void>(resolve => setTimeout(() => resolve(), NETWORK_DELAY_MS));

  if (password.toLowerCase() === 'fail') {
    throw new AuthError('Invalid email or password');
  }

  const name = email.split('@')[0].replace(/[._-]+/g, ' ');
  const titleCased = name
    .split(' ')
    .map(part => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');

  return {
    user: {
      id: `user-${Math.abs(hashString(email))}`,
      email,
      name: titleCased || 'MarketPlaceShopper',
    },
    token: `mock-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
  };
}

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return h;
}