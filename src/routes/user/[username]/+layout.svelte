<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { userProfile, user } = data;
	let currentPath = $state('');
	let username = $state('');

	$effect(() => {
		currentPath = page.url.pathname;
		username = userProfile.username || '';
	});
</script>

<div class="container mx-auto px-4 py-6">
	<div class="card bg-base-200">
		<div class="card-body p-6">
			<div class="flex items-center justify-between gap-6">
				<div class="flex items-center gap-4">
					<div class="avatar flex-none">
						<div class="w-16 rounded-full">
							<img src={`/api/avatar/${userProfile.username}`} alt={userProfile.username} />
						</div>
					</div>
					<div class="flex-auto">
						<h1 class="text-2xl font-bold">
							{userProfile.displayUsername}
						</h1>
						<p class="text-base-content/60 text-sm">@{userProfile.username}</p>
					</div>
				</div>
				<div class="flex items-center gap-4">
					{#if userProfile.id === user?.id}
						<a href="/account" class="btn btn-primary hidden sm:flex"> Edit Profile </a>
						<a href="/account" class="btn btn-primary flex items-center gap-2 sm:hidden">
							<Icon icon="mdi:pencil-outline" class="h-5 w-5" />
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="tabs tabs-bordered mt-6">
		<a
			class="tab tab-lg {currentPath === `/user/${username}` ? 'tab-active' : ''}"
			href="/user/{username}"
		>
			Info
		</a>
		<a
			class="tab tab-lg {currentPath === `/user/${username}/quizzes` ? 'tab-active' : ''}"
			href="/user/{username}/quizzes"
		>
			Quizzes
		</a>
		<a
			class="tab tab-lg {currentPath === `/user/${username}/attempts` ? 'tab-active' : ''}"
			href="/user/{username}/attempts"
		>
			Attempts
		</a>
	</div>

	<div class="bg-base-200 container mt-6 rounded-lg p-4">
		{@render children()}
	</div>
</div>
