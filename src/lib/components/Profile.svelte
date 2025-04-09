<script lang="ts">
	import type { Profile } from '$lib';
	import type { Snippet } from 'svelte';

	let { user, class: className = '' }: { user: Profile; class?: string } = $props();
</script>

<a href={`/user/${user.username}`} class="link">
	<div class="flex items-center gap-2 {className}">
		<img src={user.image} alt={user.username} class="h-6 w-6 rounded-full" />
		<span class="text-sm font-medium">@{user.username}</span>
	</div>
</a>
