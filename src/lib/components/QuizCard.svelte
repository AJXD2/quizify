<script lang="ts">
	import type { QuizWithProfile } from '$lib';
	const { quiz }: { quiz: QuizWithProfile } = $props();
</script>

<div class="card bg-base-200 w-full cursor-pointer transition-shadow duration-300 hover:shadow-lg">
	<div class="card-body">
		<div class="flex items-center gap-3">
			<h2 class="card-title text-xl font-bold">{quiz.title}</h2>
		</div>

		{#if quiz.description}
			<p class="card-text text-gray-600">{quiz.description}</p>
		{/if}

		<div class="mt-4 flex items-center gap-2 text-sm text-gray-500">
			<a
				href={`/users/${quiz.creator.username}`}
				class="link hover:text-primary flex items-center gap-2 transition-colors"
			>
				{#if quiz.creator.image}
					<img src={quiz.creator.image} alt="Creator" class="h-7 rounded-full" />
				{/if}
				@{quiz.creator.username}
			</a>
		</div>
	</div>
</div>
