<script lang="ts">
	import type { Attempt, Quiz } from '$lib';
	import { calculateTimeSpent } from '$lib/utils';

	let { userAttempts, quiz }: { userAttempts: Attempt[]; quiz: Quiz } = $props();
</script>

<table class="table-zebra table">
	<thead>
		<tr>
			<th>Attempt</th>
			<th>Date</th>
			<th>Time Taken</th>
			<th>Status</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each userAttempts as attempt, i}
			<tr>
				<td>#{i + 1}</td>
				<td
					>{new Date(attempt.startedAt).toLocaleDateString('en-US', {
						month: 'numeric',
						day: 'numeric',
						year: 'numeric',
						hour: 'numeric',
						minute: '2-digit',
						hour12: true
					})}</td
				>
				<td>{calculateTimeSpent(attempt.startedAt, attempt.completedAt)}</td>
				<td>
					<div class="badge {attempt.completedAt ? 'badge-success' : 'badge-warning'}">
						{attempt.completedAt ? 'Completed' : 'In Progress'}
					</div>
				</td>
				<td>
					<a href="/quizzes/{quiz.id}/attempts/{attempt.id}" class="btn btn-xs btn-ghost"> View </a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
