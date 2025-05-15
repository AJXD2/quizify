<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutProps } from './$types';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import Profile from '$lib/components/Profile.svelte';
	import { goto, onNavigate } from '$app/navigation';
	import { authClient } from '$lib/auth/client';
	import { toasts } from '$lib/stores/toast';

	let { data, children }: LayoutProps = $props();
	const { quiz } = data;

	let deleteModal = $state<HTMLDialogElement>();
	let deleteConfirmation = $state('');
	let deleteLoading = $state(false);
	let deleteConfirmationValid = $derived(deleteConfirmation === quiz.title);

	const session = authClient.useSession();
	let isSidebarOpen = $state(false);

	// Close sidebar when route changes
	onNavigate(() => {
		isSidebarOpen = false;
	});

	const handleDelete = async (e: Event) => {
		e.preventDefault();
		deleteLoading = true;
		if (!deleteConfirmationValid) {
			toasts.error({
				title: 'Error',
				message: 'Please enter the quiz title to confirm deletion'
			});
			deleteLoading = false;
			return;
		}
		// Form action ?deleteQuiz
		const res = await fetch(`/quizzes/${quiz.id}?/deleteQuiz`, {
			method: 'POST',
			body: new FormData()
		});
		const data = await res.json();
		if (data.type === 'success') {
			toasts.success({
				title: 'Success',
				message: 'Quiz deleted successfully'
			});
			goto('/quizzes');
		} else {
			toasts.error({
				title: 'Error',
				message: `Failed to delete quiz (${res.statusText})`
			});
		}
		deleteModal?.close();
		deleteLoading = false;
	};
</script>

<div class="drawer lg:drawer-open bg-base-100 min-h-[100dvh]">
	<input id="quiz-drawer" type="checkbox" class="drawer-toggle" bind:checked={isSidebarOpen} />

	<div class="drawer-content flex flex-col">
		<!-- Top navbar for mobile view -->
		<div class="navbar bg-base-100 border-base-300 sticky top-0 z-5 border-b px-2 sm:hidden">
			<div class="flex-none">
				<label for="quiz-drawer" class="btn btn-square btn-ghost drawer-button">
					<Icon icon="mdi:menu" class="h-6 w-6" />
				</label>
			</div>
			<div class="flex flex-1 justify-between px-2">
				<span class="truncate text-lg font-bold">{quiz.title}</span>
				<Profile user={quiz.creator} />
			</div>
		</div>

		<!-- Main content area -->
		<main class="flex-1 overflow-y-auto p-2 pb-20 md:p-6 md:pb-6">
			{@render children()}
		</main>
	</div>

	<!-- Sidebar -->
	<aside class="drawer-side z-[9]">
		<label for="quiz-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="bg-base-200 text-base-content flex h-full w-64 flex-col overflow-y-auto">
			<!-- Quiz navigation -->
			<div class="flex-1 p-4">
				<!-- Quiz title header -->
				<div class="mb-4 border-b py-3 break-words">
					<h2 class="text-xl font-bold">{quiz.title}</h2>
					<p class="mt-1 truncate text-sm opacity-70">
						{quiz.description || 'No description provided'}
					</p>
					<span class="mt-2 flex items-center gap-2 text-sm">
						Creator: <Profile user={quiz.creator} />
					</span>
				</div>

				<!-- Main navigation -->
				<div class="menu rounded-box bg-base-200 w-full gap-1">
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
							href="/quizzes/{quiz.id}/leaderboard"
							class="flex items-center gap-3 {$page.url.pathname.includes('/leaderboard')
								? 'bg-base-content/15'
								: ''}"
						>
							<Icon icon="mdi:poll" class="h-5 w-5" />
							<span>Leaderboard</span>
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
					{#if $session.data?.user.id === quiz.creatorId}
						<div class="divider">Creator Actions</div>
						<li>
							<a
								href="/quizzes/{quiz.id}/edit"
								class="text-warning flex items-center gap-3 {$page.url.pathname.includes('/edit')
									? 'bg-warning-content/15'
									: ''}"
							>
								<Icon icon="mdi:puzzle-edit" class="h-5 w-5" />
								<span>Edit Quiz</span>
							</a>
						</li>
						<li>
							<button
								class="text-error flex items-center gap-3"
								onclick={() => deleteModal?.showModal()}
							>
								<Icon icon="mdi:delete" class="h-5 w-5" />
								<span>Delete Quiz</span>
							</button>
						</li>
					{/if}
				</div>
			</div>

			<!-- Bottom actions -->
			<div class="mt-auto mb-16 border-t p-4">
				<a href="/quizzes" class="btn btn-outline btn-block gap-2">
					<Icon icon="mdi:arrow-left" class="h-5 w-5" />
					<span>Back to Quizzes</span>
				</a>
			</div>
		</div>
	</aside>
</div>

<dialog bind:this={deleteModal} onsubmit={handleDelete} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Delete Quiz</h3>
		<p class="py-4">
			Are you sure you want to delete the quiz titled "<strong>{quiz.title}</strong>"? This action
			cannot be undone.
		</p>
		<input
			type="text"
			class="input input-bordered w-full"
			placeholder="Type the quiz title to confirm"
			name="deleteConfirmation"
			class:input-error={!deleteConfirmationValid}
			class:input-success={deleteConfirmationValid}
			bind:value={deleteConfirmation}
			disabled={deleteLoading}
		/>
		<div class="divider"></div>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-error" disabled={!deleteConfirmationValid || deleteLoading}>
					{#if deleteLoading}
						<div class="loading loading-spinner loading-lg"></div>
					{:else}
						Delete
					{/if}
				</button>
			</form>
			<button class="btn btn-outline" onclick={() => deleteModal?.close()} disabled={deleteLoading}>
				Cancel
			</button>
		</div>
	</div>
</dialog>
