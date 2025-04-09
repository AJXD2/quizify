<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/state';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { userProfile } = data;
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
			<div class="flex items-center gap-4">
				<div class="avatar">
					<div class="w-16 rounded-full">
						<img src={userProfile.image} alt={userProfile.username} />
					</div>
				</div>
				<div class="flex-grow">
					<h1 class="text-2xl font-bold">
						{userProfile.displayUsername}
					</h1>
					<p class="text-sm text-gray-500">@{userProfile.username}</p>
				</div>
				<div class="stat px-2">
					<div class="stat-title">Quizzes</div>
					<div class="stat-value text-xl">{userProfile.quizzes.length}</div>
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

	<div class="mt-6">
		{@render children()}
	</div>
</div>
