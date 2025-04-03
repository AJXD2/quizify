import { createAuthClient } from 'better-auth/client';
import type { Auth } from './';
import { inferAdditionalFields, twoFactorClient, usernameClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	baseURL: 'http://localhost:3000',
	plugins: [inferAdditionalFields<Auth>(), twoFactorClient(), usernameClient()]
});
