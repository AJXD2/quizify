<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	const { data, form }: PageProps = $props();

	let tags = $state('');
</script>

<div class="container mx-auto max-w-4xl px-6 py-10">
	<div class="card bg-base-100 border-base-200 border shadow-2xl">
		<div class="card-body space-y-6">
			<h2 class="card-title mb-4 text-3xl font-extrabold">📝 Create New Quiz</h2>

			<form method="POST" use:enhance class="space-y-6">
				<!-- Title -->
				<div>
					<label for="title" class="label">
						<span class="label-text text-lg font-medium">Quiz Title</span>
					</label>
					<input
						id="title"
						name="title"
						type="text"
						class="input input-bordered w-full"
						placeholder="e.g., Algebra Basics"
						required
					/>
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="label">
						<span class="label-text text-lg font-medium">Description</span>
					</label>
					<textarea
						id="description"
						name="description"
						class="textarea textarea-bordered h-24 w-full"
						placeholder="What's this quiz about?"
					></textarea>
				</div>

				<!-- Instructions -->
				<div>
					<label for="instructions" class="label">
						<span class="label-text text-lg font-medium">Instructions</span>
					</label>
					<textarea
						id="instructions"
						name="instructions"
						class="textarea textarea-bordered h-36 w-full"
						placeholder="Any special instructions for students?"
					></textarea>
				</div>

				<!-- Time & Difficulty -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label for="timeLimit" class="label">
							<span class="label-text text-lg font-medium">Time Limit (minutes)</span>
						</label>
						<input
							id="timeLimit"
							name="timeLimit"
							type="number"
							min="1"
							class="input input-bordered w-full"
							placeholder="30"
						/>
					</div>
					<div>
						<label for="difficulty" class="label">
							<span class="label-text text-lg font-medium">Difficulty</span>
						</label>
						<select id="difficulty" name="difficulty" class="select select-bordered w-full">
							<option value="easy">Easy</option>
							<option value="medium" selected>Medium</option>
							<option value="hard">Hard</option>
						</select>
					</div>
				</div>

				<!-- Tags -->
				<div>
					<label for="tags" class="label flex justify-between">
						<span class="label-text text-lg font-medium">Tags</span>
						<span class="label-text-alt text-sm">Comma-separated</span>
					</label>
					<input
						id="tags"
						name="tags"
						type="text"
						bind:value={tags}
						class="input input-bordered w-full"
						placeholder="math, science, history"
					/>
					{#if tags}
						<div class="mt-3 flex flex-wrap gap-2">
							{#each tags.split(',') as tag (tag.trim())}
								{#if tag.trim()}
									<div class="badge badge-outline badge-accent">{tag.trim()}</div>
								{/if}
							{/each}
						</div>
					{/if}
				</div>

				<!-- Actions -->
				<div class="flex justify-end gap-3 pt-4">
					<button type="reset" class="btn btn-outline">Reset</button>
					<input type="submit" class="btn btn-primary" />
				</div>
			</form>
		</div>
	</div>
</div>
