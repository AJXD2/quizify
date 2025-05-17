<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import LeaderboardAttemptCard from '$lib/components/LeaderboardAttemptCard.svelte';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();
	const { leaderboardEntries, quiz } = data;

	// Top 3 entries for special highlighting
	const topEntries = leaderboardEntries.slice(0, 3);

	// Calculate quick stats
	const avgScore =
		leaderboardEntries.length > 0
			? Math.round(
					leaderboardEntries.reduce(
						(sum, entry) =>
							sum + (entry.answers.filter((a) => a.isCorrect).length / entry.answers.length) * 100,
						0
					) / leaderboardEntries.length
				)
			: 0;

	const totalParticipants = new Set(leaderboardEntries.map((entry) => entry.user.id)).size;
</script>

<Seo
	title={`Leaderboard: ${quiz?.title || 'Quiz'} - Quizify`}
	description={`See the top scores and rankings for the quiz: ${quiz?.title || 'Quiz'}.`}
	url={page.url.href}
	type="website"
	keywords={`quizify, ${quiz?.title}, leaderboard, quiz scores, rankings`}
/>

<div class="flex flex-col gap-6">
	<!-- Header section -->
	<div class="rounded-box bg-base-200 p-6">
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h1 class="flex items-center gap-3 text-3xl font-bold">
					<Icon icon="mdi:trophy" class="text-warning h-8 w-8" />
					Leaderboard
				</h1>
				<p class="mt-2 text-sm opacity-70">See how you compare with others</p>
			</div>
		</div>

		<!-- Quick stats -->
		<div class="stats stats-vertical md:stats-horizontal w-full shadow">
			<div class="stat">
				<div class="stat-figure text-secondary">
					<Icon icon="mdi:account-group" class="h-8 w-8" />
				</div>
				<div class="stat-title">Participants</div>
				<div class="stat-value text-2xl">{totalParticipants}</div>
				<div class="stat-desc">Unique quiz takers</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<Icon icon="mdi:clipboard-text-multiple" class="h-8 w-8" />
				</div>
				<div class="stat-title">Attempts</div>
				<div class="stat-value text-2xl">{leaderboardEntries.length}</div>
				<div class="stat-desc">Total attempts</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<Icon icon="mdi:chart-bar" class="h-8 w-8" />
				</div>
				<div class="stat-title">Avg. Score</div>
				<div class="stat-value text-2xl">{avgScore}%</div>
				<div class="stat-desc">All participants</div>
			</div>
		</div>
	</div>

	<!-- Top 3 Winners (if available) -->
	{#if topEntries.length > 0}
		<div class="card bg-base-200">
			<div class="card-body">
				<h2 class="card-title flex items-center">
					<Icon icon="mdi:medal" class="text-warning mr-2 h-6 w-6" />
					Top Performers
				</h2>
				<div class="divider my-1"></div>

				<div class="mb-4 flex flex-col items-center justify-center md:flex-row md:gap-6">
					{#if topEntries.length > 2}
						<!-- 2nd Place -->
						<div
							class="order-first mb-6 flex flex-1 transform flex-col items-center opacity-90 transition-all hover:opacity-100 md:order-1 md:mb-0 md:translate-y-4"
						>
							<div class="badge badge-secondary badge-lg mb-2">2nd Place</div>
							<div class="avatar mb-2">
								<div
									class="bg-secondary bg-opacity-20 ring-secondary ring-offset-base-100 flex h-20 w-20 items-center justify-center rounded-full ring-4 ring-offset-2"
								>
									{#if topEntries[1].user.image}
										<img
											src={topEntries[1].user.image}
											alt={topEntries[1].user.displayUsername || topEntries[1].user.username}
											class="rounded-full"
										/>
									{:else}
										<Icon icon="mdi:account" class="text-secondary h-12 w-12" />
									{/if}
								</div>
							</div>
							<div class="text-center">
								<div class="font-bold">
									{topEntries[1].user.displayUsername || topEntries[1].user.username}
								</div>
								<div class="text-sm opacity-70">
									{Math.round(
										(topEntries[1].answers.filter((a) => a.isCorrect).length /
											topEntries[1].answers.length) *
											100
									)}%
								</div>
							</div>
						</div>
					{/if}

					{#if topEntries.length > 0}
						<!-- 1st Place -->
						<div class="order-2 mb-6 flex flex-1 scale-110 flex-col items-center md:mb-0">
							<div class="badge badge-primary badge-lg mb-2">1st Place</div>
							<div class="avatar mb-2">
								<div
									class="bg-primary bg-opacity-20 ring-primary ring-offset-base-100 relative flex h-24 w-24 items-center justify-center rounded-full ring-4 ring-offset-2"
								>
									{#if topEntries[0].user.image}
										<img
											src={topEntries[0].user.image}
											alt={topEntries[0].user.displayUsername || topEntries[0].user.username}
											class="rounded-full"
										/>
									{:else}
										<Icon icon="mdi:account" class="text-primary h-14 w-14" />
									{/if}
									<div class="absolute -top-3 -right-3">
										<Icon icon="emojione:trophy" class="h-8 w-8" />
									</div>
								</div>
							</div>
							<div class="text-center">
								<div class="text-lg font-bold">
									{topEntries[0].user.displayUsername || topEntries[0].user.username}
								</div>
								<div class="opacity-70">
									{Math.round(
										(topEntries[0].answers.filter((a) => a.isCorrect).length /
											topEntries[0].answers.length) *
											100
									)}%
								</div>
							</div>
						</div>
					{/if}

					{#if topEntries.length > 1}
						<!-- 3rd Place -->
						<div
							class="order-3 mb-6 flex flex-1 transform flex-col items-center opacity-90 transition-all hover:opacity-100 md:mb-0 md:translate-y-4"
						>
							<div class="badge badge-accent badge-lg mb-2">3rd Place</div>
							<div class="avatar mb-2">
								<div
									class="bg-accent bg-opacity-20 ring-accent ring-offset-base-100 flex h-20 w-20 items-center justify-center rounded-full ring-4 ring-offset-2"
								>
									{#if topEntries[2]?.user.image}
										<img
											src={topEntries[2].user.image}
											alt={topEntries[2].user.displayUsername || topEntries[2].user.username}
											class="rounded-full"
										/>
									{:else}
										<Icon icon="mdi:account" class="text-accent h-12 w-12" />
									{/if}
								</div>
							</div>
							<div class="text-center">
								<div class="font-bold">
									{topEntries[2]?.user.displayUsername || topEntries[2]?.user.username}
								</div>
								<div class="text-sm opacity-70">
									{topEntries[2]
										? Math.round(
												(topEntries[2].answers.filter((a) => a.isCorrect).length /
													topEntries[2].answers.length) *
													100
											)
										: 0}%
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- All entries -->
	<div class="card bg-base-200">
		<div class="card-body">
			<h2 class="card-title flex items-center">
				<Icon icon="mdi:format-list-numbered" class="mr-2 h-6 w-6" />
				All Results
			</h2>
			<div class="divider my-1"></div>

			{#if leaderboardEntries.length === 0}
				<div class="flex flex-col items-center justify-center py-8">
					<Icon icon="mdi:information-outline" class="mb-2 h-12 w-12 opacity-60" />
					<p class="opacity-60">No attempts for this quiz yet</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each leaderboardEntries as entry, index (entry.id)}
						<LeaderboardAttemptCard attempt={entry} rank={index + 1} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
