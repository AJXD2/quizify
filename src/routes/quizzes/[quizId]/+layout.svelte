<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import Profile from '$lib/components/Profile.svelte';
	import { onNavigate } from '$app/navigation';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { quiz } = data;

	let isSidebarOpen = $state(false);

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}

	// Close sidebar when route changes
	onNavigate(() => {
		isSidebarOpen = false;
	});
</script>

<div class="drawer lg:drawer-open bg-base-100 min-h-screen">
	<!-- Mobile drawer toggle -->
	<input id="quiz-drawer" type="checkbox" class="drawer-toggle" bind:checked={isSidebarOpen} />

	<div class="drawer-content flex flex-col">
		<!-- Top navbar for mobile view -->
		<div class="navbar bg-base-100 sticky top-0 z-10 border-b lg:hidden">
			<div class="flex-none">
				<label for="quiz-drawer" class="btn btn-square btn-ghost drawer-button">
					<Icon icon="mdi:menu" class="h-6 w-6" />
				</label>
			</div>
			<div class="flex-1">
				<span class="truncate text-xl font-bold">{quiz.title}</span>
			</div>
		</div>

		<!-- Main content area -->
		<main class="flex-1 overflow-y-auto p-4 md:p-6">
			{@render children()}
		</main>
	</div>

	<!-- Sidebar -->
	<aside class="drawer-side z-20">
		<label for="quiz-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="bg-base-200 text-base-content flex h-full w-64 flex-col">
			<!-- Quiz navigation -->
			<div class="flex-1 overflow-y-auto p-4">
				<!-- Quiz title header -->
				<div class="mb-4 border-b py-3 break-words">
					<h2 class="text-xl font-bold">{quiz.title}</h2>
					<p class="mt-1 truncate text-sm opacity-70">
						{quiz.description || 'No description provided'}
					</p>
					<span class="mt-2 flex items-center gap-2 text-sm">
						Creator: <Profile user={quiz.creator} class="mt-1" />
					</span>
				</div>

				<!-- Main navigation -->
				<div class="menu bg-base-200 rounded-box w-full gap-1">
					<h3 class="mt-2 mb-1 pl-4 text-sm font-semibold uppercase opacity-70">Navigation</h3>
					<li>
						<a
							href="/quizzes/{quiz.id}"
							class="flex items-center gap-3 {$page.url.pathname === `/quizzes/${quiz.id}`
								? 'bg-base-content/15'
								: ''}"
						>
							<Icon icon="mdi:view-dashboard-outline" class="h-5 w-5" />
							<span>Overview</span>
						</a>
					</li>
					<li>
						<a
							href="/quizzes/{quiz.id}/attempts"
							class="flex items-center gap-3 {$page.url.pathname.includes('/attempts')
								? 'bg-base-content/15'
								: ''}"
						>
							<Icon icon="mdi:history" class="h-5 w-5" />
							<span>Attempts</span>
						</a>
					</li>
					<li>
						<a
							href="/quizzes/{quiz.id}/results"
							class="flex items-center gap-3 {$page.url.pathname.includes('/results')
								? 'bg-base-content/15'
								: ''}"
						>
							<Icon icon="mdi:poll" class="h-5 w-5" />
							<span>Results</span>
						</a>
					</li>
					<li>
						<a
							href="/quizzes/{quiz.id}/take"
							class="flex items-center gap-3 {$page.url.pathname.includes('/take')
								? 'bg-base-content/15'
								: ''}"
						>
							<Icon icon="mdi:pencil-outline" class="h-5 w-5" />
							<span>Take Quiz</span>
						</a>
					</li>
				</div>
			</div>

			<!-- Bottom actions -->
			<div class="mt-auto border-t p-4">
				<a href="/quizzes" class="btn btn-outline btn-block gap-2">
					<Icon icon="mdi:arrow-left" class="h-5 w-5" />
					<span>Back to Quizzes</span>
				</a>
			</div>
		</div>
	</aside>
</div>
