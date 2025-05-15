<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const subsections = [
		{ id: 'general', name: 'General', path: '/account' },
		{ id: 'integrations', name: 'Integrations', path: '/account/integrations' }
	];
</script>

<div class="container mx-auto h-full p-4">
	<div class="flex h-full flex-col gap-6 md:flex-row">
		<!-- Sidebar Navigation -->
		<div class="bg-base-200 rounded-box h-full w-full p-4 md:w-64">
			<h2 class="mb-4 text-xl font-bold">Account Settings</h2>
			<ul class="menu bg-base-200 rounded-box w-full">
				{#each subsections as section (section.path)}
					<li>
						<a href={section.path} class={page.url.pathname === section.path ? 'bg-base-300' : ''}>
							{section.name}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Main Content -->
		<div class="bg-base-100 rounded-box flex-1 p-6 shadow-sm">
			<div>
				<!-- Settings Content -->
				{@render children()}
			</div>
		</div>
	</div>
</div>
