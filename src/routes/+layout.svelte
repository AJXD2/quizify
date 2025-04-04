<script lang="ts">
	import '../app.css';
	import Icon from '@iconify/svelte';
	import { authClient } from '$lib/auth/client';
	let { children } = $props();

	const session = authClient.useSession();
</script>

<div class="bg-base-100 min-h-screen">
	<header class="navbar bg-base-200 shadow-lg">
		<div class="navbar-start">
			<a href="/" class="btn btn-ghost text-xl">QuizMaster</a>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li><a href="/quizzes">Browse Quizzes</a></li>
				<li><a href="/create">Create Quiz</a></li>
				<li><a href="/leaderboard">Leaderboard</a></li>
			</ul>
		</div>
		<div class="navbar-end">
			<div class="dropdown dropdown-end">
				<button aria-label="Menu" tabindex="0" class="btn btn-ghost md:hidden">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h8m-8 6h16"
						/>
					</svg>
				</button>
				<ul
					tabindex="-1"
					class="menu menu-sm dropdown-content bg-base-200 rounded-box z-[1] mt-3 w-52 p-2 shadow"
				>
					<li><a href="/quizzes">Browse Quizzes</a></li>
					<li><a href="/create">Create Quiz</a></li>
					<li><a href="/leaderboard">Leaderboard</a></li>
					<li><a href="/profile">Profile</a></li>
				</ul>
			</div>

			{#if $session.data}
				<div class="dropdown dropdown-end hidden md:block">
					<label tabindex="-1" class="btn btn-ghost btn-circle avatar">
						<div class="flex h-10 w-10 items-center justify-center rounded-full p-2">
							<img
								alt="User avatar"
								class="rounded-box h-full w-full object-cover"
								src={$session.data?.user.image ??
									`https://api.dicebear.com/9.x/initials/svg?seed=${$session.data?.user.name}`}
							/>
						</div>
					</label>
					<ul
						tabindex="-1"
						class="menu dropdown-content menu-sm rounded-box bg-base-200 z-[1] mt-3 w-52 p-2 shadow"
					>
						<li>
							<a href="/profile" class="flex items-center gap-3">
								<Icon icon="mdi:account" class="h-5 w-5" />
								Profile
							</a>
						</li>
						<li>
							<a href="/account" class="flex items-center gap-3">
								<Icon icon="mdi:cog" class="h-5 w-5" />
								Account Settings
							</a>
						</li>
						<li>
							<button
								onclick={() => authClient.signOut()}
								class="text-error flex items-center gap-3"
							>
								<Icon icon="mdi:logout" class="h-5 w-5" />
								Logout
							</button>
						</li>
					</ul>
				</div>
			{:else}
				<div class="flex gap-2">
					<a href="/auth/login" class="btn btn-outline hidden items-center justify-center md:flex">
						<span class="text-sm font-medium">Login</span>
					</a>
					<a href="/auth/signup" class="btn btn-primary hidden items-center justify-center md:flex">
						<span class="text-sm font-medium">Get started</span>
					</a>
				</div>
			{/if}
		</div>
	</header>

	<main class="container mx-auto px-4 py-8">
		<span class="text-sm font-medium"></span>

		{@render children()}
	</main>
</div>
<footer class="footer footer-center bg-base-200 text-base-content p-10">
	<div class="grid grid-flow-col gap-4">
		<a href="/about" class="link link-hover">About</a>
		<a href="/contact" class="link link-hover">Contact</a>
		<a href="/terms-of-service" class="link link-hover">Terms of Service</a>
		<a href="/privacy-policy" class="link link-hover">Privacy Policy</a>
	</div>
	<div>
		<div class="grid grid-flow-col gap-4">
			<a aria-label="X" href="https://twitter.com/quizmaster" class="btn btn-ghost btn-square">
				<Icon icon="fa-brands:twitter" class="w-12" />
			</a>
			<a aria-label="GitHub" href="https://github.com/quizmaster" class="btn btn-ghost btn-square">
				<Icon icon="fa-brands:github" class="w-12" />
			</a>

			<a aria-label="Discord" href="https://discord.gg/quizmaster" class="btn btn-ghost btn-square">
				<Icon icon="fa-brands:discord" class="w-12" />
			</a>
		</div>
	</div>
	<div>
		<p>Copyright © {new Date().getFullYear()} - QuizMaster. All rights reserved.</p>
	</div>
</footer>
