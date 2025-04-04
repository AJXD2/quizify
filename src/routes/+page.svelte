<script>
	import Icon from '@iconify/svelte';
</script>

<div class="hero bg-base-200 min-h-[70vh]">
	<div class="hero-content text-center">
		<div class="max-w-3xl">
			<h1 class="text-primary text-5xl font-bold">Welcome to Quizify</h1>
			<p class="py-6 text-xl">
				Challenge yourself, compete with friends, and expand your knowledge with our interactive
				quiz platform. Create, share, and master quizzes on any topic.
			</p>
			<div class="flex justify-center gap-4">
				<a href="/quizzes" class="btn btn-primary">Start Learning</a>
				<a href="/create" class="btn btn-secondary">Create Quiz</a>
			</div>
		</div>
	</div>
</div>

<section class="bg-base-100 py-16">
	<div class="mx-auto max-w-6xl px-4">
		<h2 class="mb-12 text-center text-3xl font-bold">Why Choose Quizify?</h2>
		<div class="grid gap-8 md:grid-cols-3">
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body items-center text-center">
					<Icon icon="fa-solid:lightbulb" class="text-primary mb-4 h-12 w-12" />
					<h3 class="card-title">Learn Interactively</h3>
					<p>
						Engage with content through interactive quizzes designed to enhance retention and
						understanding.
					</p>
				</div>
			</div>

			<div class="card bg-base-200 shadow-xl">
				<div class="card-body items-center text-center">
					<Icon icon="fa-solid:users" class="text-secondary mb-4 h-12 w-12" />
					<h3 class="card-title">Compete & Connect</h3>
					<p>
						Challenge friends, track progress on leaderboards, and build a community of learners.
					</p>
				</div>
			</div>

			<div class="card bg-base-200 shadow-xl">
				<div class="card-body items-center text-center">
					<Icon icon="fa-solid:share" class="text-accent mb-4 h-12 w-12" />
					<h3 class="card-title">Create & Share</h3>
					<p>Design custom quizzes on any topic and share your knowledge with the world.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="bg-base-200 py-16">
	<div class="mx-auto max-w-6xl px-4">
		<div class="flex flex-col items-center gap-12 md:flex-row">
			<div class="flex-1">
				<h2 class="mb-6 text-3xl font-bold">About Quizify</h2>
				<p class="mb-6 text-lg">
					Quizify is more than just a quiz platform - it's a community of learners, educators, and
					curious minds coming together to make learning fun and engaging.
				</p>
				<p class="mb-6 text-lg">
					Whether you're a student preparing for exams, a teacher creating educational content, or
					someone who loves to learn new things, Quizify has something for everyone.
				</p>
				<a href="/about" class="btn btn-primary">Learn More</a>
			</div>
			<div class="flex flex-1 justify-center">
				<div class="stats shadow">
					<div class="stat">
						<div class="stat-title">Active Users</div>
						<div class="stat-value text-primary">10K+</div>
					</div>
					<div class="stat">
						<div class="stat-title">Quizzes Created</div>
						<div class="stat-value text-secondary">50K+</div>
					</div>
					<div class="stat">
						<div class="stat-title">Topics</div>
						<div class="stat-value text-accent">100+</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
