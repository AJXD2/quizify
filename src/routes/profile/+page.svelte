<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<!-- Show spinner and tell user they will be redirected soon. If a user does see this there is something very wrong-->
<div class="flex h-screen items-center justify-center">
	<div class="flex flex-col items-center">
		<div class="loading loading-spinner loading-lg"></div>
		<p class="mt-4 text-lg">Redirecting to profile...</p>
	</div>
</div>
