<script lang="ts">
	import { goto } from '$app/navigation';
	import type { QuizWithCreator } from '$lib';
	import Profile from './Profile.svelte';

	const { quiz }: { quiz: QuizWithCreator } = $props();
</script>

<article
	class="group card bg-base-100 focus:ring-primary relative block w-full shadow-md transition-shadow duration-200 hover:shadow-lg focus:ring-2 focus:outline-none"
>
	<div
		class="card-body cursor-pointer"
		role="link"
		tabindex="0"
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				goto(`/quizzes/${quiz.id}`);
			}
		}}
		onclick={() => goto(`/quizzes/${quiz.id}`)}
	>
		<header class="relative mb-2">
			<h2 id={`quiz-title-${quiz.id}`} class="card-title text-xl">
				{quiz.title}
			</h2>
			<div class="text-base-content/50 relative z-10 text-sm">
				<Profile user={quiz.creator} />
			</div>
		</header>

		<p class="text-base-content text-base">{quiz.description}</p>

		<div class="card-actions mt-4 justify-end">
			<button
				class="btn btn-primary btn-sm relative z-20"
				onclick={() => goto(`/quizzes/${quiz.id}`)}
			>
				Take Quiz
			</button>
		</div>
	</div>
</article>
