import { createAuthClient } from 'better-auth/svelte';
import type { Auth } from '.';
import { inferAdditionalFields, twoFactorClient, usernameClient } from 'better-auth/client/plugins';
import { publicEnv } from '$lib/publicEnv';

export const authClient = createAuthClient({
	plugins: [inferAdditionalFields<Auth>(), twoFactorClient(), usernameClient()],
	baseURL: publicEnv.VITE_APP_URL
});
