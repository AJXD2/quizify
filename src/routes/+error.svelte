<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
</script>

<div class="container mx-auto mt-20 flex items-center justify-center p-4">
	<div class="card bg-base-200 w-full max-w-md shadow-xl">
		<div class="card-body items-center text-center">
			<Icon icon="fa6-solid:triangle-exclamation" class="text-error h-16 w-16" />
			<h1 class="card-title text-2xl font-bold">{$page.status} Error</h1>
			<p class="py-4 text-lg">{$page.error?.message || 'Something went wrong'}</p>
			<div class="card-actions justify-center">
				<a href="/" class="btn btn-primary">
					<Icon icon="fa6-solid:home" class="mr-2 h-4 w-4" />
					Go Home
				</a>
				<button class="btn btn-outline" onclick={() => history.back()}>
					<Icon icon="fa6-solid:rotate-left" class="mr-2 h-4 w-4" />
					Go Back
				</button>
			</div>
		</div>
	</div>
</div>
