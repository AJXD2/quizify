<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types'; // PageData will now only include leaderboard
	import { page } from '$app/state';
	import Profile from '$lib/components/Profile.svelte';

	let { data }: { data: PageData } = $props();

	let leaderboardEntries = $derived(data.leaderboard);
	// currentUserStanding is no longer passed from server or used for an aside
	// We will determine if a row is the current user directly in the #each block
</script>

<div class="container mx-auto max-w-3xl space-y-8 p-4">
	<h1
		class="from-primary to-accent mb-4 bg-gradient-to-r bg-clip-text text-center text-4xl font-bold text-transparent"
	>
		Leaderboard
	</h1>

	<!-- Main Leaderboard Content -->
	<div class="w-full">
		{#if !leaderboardEntries || leaderboardEntries.length === 0}
			<div class="card bg-base-300 shadow-xl">
				<div class="card-body flex-col items-center p-12 text-center">
					<Icon icon="fa-solid:trophy" class="mb-4 h-16 w-16 opacity-50" />
					<p class="text-base-content/80 text-xl">The leaderboard is currently empty.</p>
					<p class="text-base-content/70">
						Be the first to complete some quizzes and make your mark!
					</p>
				</div>
			</div>
		{:else}
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body p-4 sm:p-6">
					<div class="overflow-x-auto">
						<table class="table w-full">
							<thead>
								<tr class="bg-base-300">
									<th class="w-16 rounded-tl-lg text-center">Rank</th>
									<th>User</th>
									<th class="rounded-tr-lg text-right">Total Score</th>
								</tr>
							</thead>
							<tbody class="divide-base-300/50 divide-y">
								{#each leaderboardEntries as entry (entry.user.id)}
									{@const currentUserIdFromPage = page.data.user?.id}
									{@const isCurrentUser =
										currentUserIdFromPage && entry.user.id === currentUserIdFromPage}
									<tr
										class="hover:bg-base-100/50
											{entry.rank <= 3 ? 'font-semibold' : ''} 
											{isCurrentUser ? 'bg-primary/5 text-primary' : ''}"
									>
										<td class="text-center">
											{#if entry.rank === 1}
												<Icon icon="fa-solid:medal" class="mx-auto h-6 w-6 text-yellow-400" />
											{:else if entry.rank === 2}
												<Icon icon="fa-solid:medal" class="mx-auto h-6 w-6 text-gray-400" />
											{:else if entry.rank === 3}
												<Icon icon="fa-solid:medal" class="mx-auto h-6 w-6 text-orange-400" />
											{:else}
												{entry.rank}
											{/if}
										</td>
										<td>
											<Profile user={entry.user} />
										</td>
										<td class="text-right text-lg">
											{entry.totalScore}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
