<script lang="ts">
	import '../app.css';
	import Icon from '@iconify/svelte';
	import { authClient } from '$lib/auth/client';
	import { banner } from '$lib/stores/banner';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Toaster from '$lib/components/Toaster.svelte';
	import { page } from '$app/stores';

	let { children } = $props();
	const session = authClient.useSession();

	type NavLink = {
		label: string;
		href: string;
		icon: string;
		mobileOnly?: boolean;
	};

	const navLinks: NavLink[] = [
		{
			label: 'Browse',
			href: '/quizzes',
			icon: 'mdi:magnify'
		},
		{
			label: 'Create',
			href: '/quizzes/create',
			icon: 'mdi:plus'
		},
		{
			label: 'Leaderboard',
			href: '/leaderboard',
			icon: 'mdi:trophy'
		},
		{
			label: 'Profile',
			href: '/profile',
			icon: 'mdi:account'
		}
	];

	let lastScrollY = 0;
	let isNavbarHidden = $state(false);

	function handleScroll() {
		// Only handle scroll on mobile screens
		if (window.innerWidth >= 1024) return; // lg breakpoint is 1024px

		const currentScrollY = window.scrollY;
		if (currentScrollY > lastScrollY && currentScrollY > 100) {
			// Scrolling down & past threshold
			isNavbarHidden = true;
		} else {
			// Scrolling up or at top
			isNavbarHidden = false;
		}
		lastScrollY = currentScrollY;
	}

	onMount(() => {
		if ($session.data?.user) {
			// If user is logged in, check if they have a username
			if (!$session.data?.user.username) {
				banner.set({
					message: 'Please finish setting up your account',
					type: 'warning',
					icon: 'mdi:information',
					action: {
						label: 'Finish setting up',
						callback: () => {
							goto('/account');
							banner.set(null);
						}
					}
				});
			}
		}

		// Add scroll event listener
		window.addEventListener('scroll', handleScroll, { passive: true });
		// Reset navbar state when screen size changes
		window.addEventListener('resize', () => {
			if (window.innerWidth >= 1024) {
				isNavbarHidden = false;
			}
		});
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', () => {});
		};
	});
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
	/>
</svelte:head>

<div class="bg-base-100 flex min-h-[100dvh] flex-col">
	<header
		class="navbar bg-base-200/95 supports-[backdrop-filter]:bg-base-200/80 px-4 shadow-lg backdrop-blur"
	>
		<div class="navbar-start">
			<a href="/" class="btn btn-ghost text-lg font-bold normal-case sm:text-xl">QuizMaster</a>
		</div>
		<div class="navbar-center hidden gap-1 md:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="btn btn-ghost btn-sm gap-2 {$page.url.pathname === link.href ? 'btn-active' : ''}"
				>
					<Icon icon={link.icon} class="h-5 w-5" />
					{link.label}
				</a>
			{/each}
		</div>
		<div class="navbar-end">
			{#if $session.data}
				<div class="dropdown dropdown-end hidden md:block">
					<label for="avatar" tabindex="-1" class="btn btn-circle btn-ghost avatar">
						<div class="w-10 rounded-full">
							<img
								id="avatar"
								alt="User avatar"
								class="h-full w-full rounded-full object-cover"
								crossOrigin="anonymous"
								src="/api/avatar"
							/>
						</div>
					</label>
					<ul
						tabindex="-1"
						class="menu dropdown-content menu-sm rounded-box bg-base-200 z-[1] mt-3 w-52 gap-1 p-3 shadow-lg"
					>
						<li>
							<a href="/account" class="gap-3">
								<Icon icon="mdi:cog" class="h-5 w-5" />
								Account Settings
							</a>
						</li>
						<li>
							<button
								onclick={() => authClient.signOut().then(() => goto($page.url.pathname))}
								class="text-error gap-3"
							>
								<Icon icon="mdi:logout" class="h-5 w-5" />
								Logout
							</button>
						</li>
					</ul>
				</div>
			{:else}
				<div class="flex gap-2">
					<a href="/auth/login" class="btn btn-ghost btn-sm hidden md:flex">Login</a>
					<a href="/auth/signup" class="btn btn-primary btn-sm hidden md:flex">Get started</a>
				</div>
			{/if}
		</div>
	</header>

	{#if $banner}
		<div
			class="alert mx-auto mt-2 w-[95%] max-w-2xl px-3 py-2 shadow-lg transition-all sm:px-4 sm:py-3"
			class:alert-warning={$banner.type === 'warning'}
			class:alert-error={$banner.type === 'error'}
			class:alert-success={$banner.type === 'success'}
			class:alert-info={$banner.type === 'info'}
		>
			<Icon icon={$banner.icon || 'mdi:information'} class="h-5 w-5 flex-shrink-0" />
			<span class="text-sm sm:text-base">{$banner.message}</span>
			{#if $banner.action}
				<button onclick={$banner.action.callback} class="btn btn-sm">
					{$banner.action.label}
				</button>
			{/if}
		</div>
	{/if}

	<main class="container mx-auto mb-16 flex-1 overflow-hidden px-4 py-6 sm:mb-1 sm:py-8">
		{@render children()}
	</main>

	<footer class="footer footer-center bg-base-200 text-base-content hidden p-4 sm:flex md:p-6">
		<div class="grid grid-flow-row gap-3 text-sm sm:grid-flow-col sm:gap-6">
			<a href="/about" class="link link-hover">About</a>
			<a href="/contact" class="link link-hover">Contact</a>
			<a href="/terms-of-service" class="link link-hover">Terms of Service</a>
			<a href="/privacy-policy" class="link link-hover">Privacy Policy</a>
		</div>
		<div>
			<p class="text-center text-xs opacity-80 sm:text-sm">
				Copyright © {new Date().getFullYear()} - QuizMaster. All rights reserved.
			</p>
		</div>
	</footer>

	<div class="dock fixed right-0 bottom-0 left-0 z-50 sm:hidden">
		<a href="/" class:dock-active={$page.url.pathname === '/'}>
			<Icon icon="mdi:home" class="h-5 w-5" />
			<span class="dock-label">Home</span>
		</a>
		{#each navLinks as link}
			<a href={link.href} class:dock-active={$page.url.pathname.startsWith(link.href)}>
				<Icon icon={link.icon} class="h-5 w-5" />
				<span class="dock-label">{link.label}</span>
			</a>
		{/each}
	</div>
</div>

<Toaster max={3} />
