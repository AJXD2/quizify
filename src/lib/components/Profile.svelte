<script lang="ts">
	import type { Profile } from '$lib';

	let { user, class: className = '' }: { user: Profile; class?: string } = $props();
</script>

<a href={`/user/${user.username}`} class="link link-hover {className}">
	<div class="flex items-center gap-2">
		<img src={`/api/avatar/${user.username}`} alt={user.username} class="h-6 w-6 rounded-full" />

		<span class="text-sm font-medium">@{user.username}</span>
	</div>
</a>
