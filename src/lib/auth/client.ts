import { createAuthClient } from 'better-auth/svelte';
import type { Auth } from '.';
import { inferAdditionalFields, twoFactorClient, usernameClient } from 'better-auth/client/plugins';
import { PUBLIC_APP_URL } from '$env/static/public';

export const authClient = createAuthClient({
	plugins: [inferAdditionalFields<Auth>(), twoFactorClient(), usernameClient()],
	baseURL: PUBLIC_APP_URL
});
