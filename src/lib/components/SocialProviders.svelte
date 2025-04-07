<script lang="ts">
	import { authClient } from '$lib/auth/client';

	import Icon from '@iconify/svelte';

	const { redirectTo }: { redirectTo?: string } = $props();
</script>

<div class="flex flex-col gap-3">
	<button
		class="btn btn-outline w-full gap-2"
		onclick={() =>
			authClient.signIn.social({ provider: 'discord', callbackURL: redirectTo || undefined })}
	>
		<Icon icon="logos:discord-icon" class="h-5 w-5" />
		Continue with Discord
	</button>
	<button
		class="btn btn-outline w-full gap-2"
		onclick={() =>
			authClient.signIn.social({ provider: 'google', callbackURL: redirectTo || undefined })}
	>
		<Icon icon="logos:google-icon" class="h-5 w-5" />
		Continue with Google
	</button>
</div>
