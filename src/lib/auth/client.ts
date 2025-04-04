import { createAuthClient } from 'better-auth/svelte';
import type { Auth } from '.';
import { inferAdditionalFields, twoFactorClient, usernameClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	plugins: [inferAdditionalFields<Auth>(), twoFactorClient(), usernameClient()]
});
