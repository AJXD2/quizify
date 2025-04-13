<script lang="ts">
	import Icon from '@iconify/svelte';
	import AOS from 'aos';
	import 'aos/dist/aos.css';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	const features = [
		{
			icon: 'fa-solid:lightbulb',
			title: 'Learn Interactively',
			text: 'Engage with dynamic content to boost retention.'
		},
		{
			icon: 'fa-solid:users',
			title: 'Compete & Connect',
			text: 'Battle friends, climb the leaderboard, and flex your smarts.'
		},
		{
			icon: 'fa-solid:share',
			title: 'Create & Share',
			text: 'Craft quizzes on anything and show the world what you know.'
		}
	];

	const testimonials = [
		{ name: 'Luna M.', quote: 'Quizify turned study night into game night!', delay: 100 },
		{ name: 'Alex J.', quote: 'I’ve never learned this much while laughing.', delay: 200 },
		{ name: 'Sam R.', quote: 'Made a quiz on cryptids. It blew up. Now I’m famous.', delay: 300 }
	];

	let { data }: PageProps = $props();
	const { stats } = data;
	console.log(stats);
	onMount(() => {
		AOS.init({
			duration: 800,
			once: true
		});
	});
</script>

<!-- Hero Section -->
<div class="space-y-2">
	<div
		class="hero from-primary/10 rounded-box to-base-200 min-h-screen bg-gradient-to-br px-4 sm:px-6 lg:px-8"
		data-aos="fade-up"
	>
		<div class="hero-content flex flex-col items-center text-center">
			<div class="bg-base-100 w-full max-w-3xl rounded-3xl p-8 shadow-2xl sm:p-10">
				<h1
					class="text-primary mb-4 text-4xl font-extrabold sm:text-5xl md:text-6xl"
					data-aos="fade-up"
					data-aos-delay="100"
				>
					Welcome to Quizify
				</h1>
				<p class="mb-6 text-base sm:text-lg md:text-xl" data-aos="fade-up" data-aos-delay="200">
					Challenge your brain, flex your trivia skills, and share your genius with the world.
				</p>
				<div
					class="flex flex-col justify-center gap-4 sm:flex-row"
					data-aos="zoom-in"
					data-aos-delay="300"
				>
					<a href="/quizzes" class="btn btn-primary btn-lg">Start Learning</a>
					<a href="/create" class="btn btn-secondary btn-lg">Create Quiz</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Feature Highlights -->
	<section
		class="from-base-100 rounded-box to-base-200 bg-gradient-to-b px-4 py-20 sm:px-6 lg:px-8"
	>
		<h2 class="mb-12 text-center text-3xl font-bold sm:text-4xl" data-aos="fade-up">
			Why Choose Quizify?
		</h2>
		<div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
			{#each features as f, i}
				<div
					class="card rounded-3xl p-6 shadow-xl transition-transform hover:scale-105"
					data-aos="fade-up"
					data-aos-delay={100 * (i + 1)}
				>
					<div class="card-body items-center text-center">
						<Icon icon={f.icon} class="text-primary mb-4 h-12 w-12" />
						<h3 class="card-title">{f.title}</h3>
						<p>{f.text}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- About Section -->
	<section class="bg-base-200 rounded-box px-4 py-20 sm:px-6 lg:px-8">
		<div class="mx-auto flex max-w-6xl flex-col items-center gap-16 md:flex-row">
			<div class="flex-1 space-y-6 text-center md:text-left" data-aos="fade-right">
				<h2 class="text-3xl font-bold sm:text-4xl">About Quizify</h2>
				<p class="text-base sm:text-lg">
					Quizify isn't just another quiz app, it's a revolution in interactive learning. From
					bite-sized topics to full-on trivia wars, we've got it all.
				</p>
				<p class="text-base sm:text-lg">
					Whether you're prepping for finals or just vibing with fun facts, Quizify adapts to how
					you learn best.
				</p>
			</div>
			<div class="flex w-full flex-1 flex-col" data-aos="fade-left">
				<div class="stats bg-base-100 w-full rounded-3xl text-center shadow-xl">
					<div class="stat">
						<div class="stat-title">Active Users</div>
						<div class="stat-value text-primary">{stats.userCount}+</div>
					</div>
					<div class="stat">
						<div class="stat-title">Quizzes Created</div>
						<div class="stat-value text-secondary">{stats.quizCount}+</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Testimonials -->
	<section
		class="from-base-100 rounded-box to-base-300 bg-gradient-to-br px-4 py-20 sm:px-6 lg:px-8"
	>
		<h2 class="mb-12 text-center text-3xl font-bold sm:text-4xl" data-aos="fade-up">
			What People Say
		</h2>
		<div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
			{#each testimonials as t}
				<div
					class="bg-base-100 rounded-3xl p-6 shadow-xl"
					data-aos="fade-up"
					data-aos-delay={t.delay}
				>
					<blockquote class="mb-4 text-lg italic">"{t.quote}"</blockquote>
					<p class="text-primary font-bold">– {t.name}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Call to Action -->
	<section class="bg-base-200 rounded-box px-4 py-20 text-center sm:px-6 lg:px-8">
		<div class="mx-auto max-w-2xl" data-aos="zoom-in">
			<h2 class="mb-4 text-3xl font-extrabold sm:text-4xl">Ready to level up your brain?</h2>
			<p class="mb-6 text-base sm:text-lg">
				Join thousands of learners and unleash your quiz powers. It's free, it's fun, and it's 🔥.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a href="/quizzes" class="btn btn-primary btn-lg">Dive In</a>
				<a href="/create" class="btn btn-secondary btn-lg">Make a Quiz</a>
			</div>
		</div>
	</section>
</div>
