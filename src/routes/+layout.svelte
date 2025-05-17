<script lang="ts">
	import '../app.css';
	import Icon from '@iconify/svelte';
	import { authClient } from '$lib/auth/client';
	import { banner } from '$lib/stores/banner';
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import Toaster from '$lib/components/Toaster.svelte';
	import { page } from '$app/state';
	import Brand from '$lib/components/Brand.svelte';
	let { children } = $props();
	const session = authClient.useSession();

	type NavLink = {
		label: string;
		href: string;
		icon: string;
		validator: () => boolean;
		mobileOnly?: boolean;
	};

	const navLinks: NavLink[] = [
		{
			label: 'Browse',
			href: '/quizzes',
			icon: 'mdi:magnify',
			validator: () => {
				return (
					page.url.pathname.split('/')[1] === 'quizzes' &&
					page.url.pathname.split('/')[2] !== 'create'
				);
			}
		},
		{
			label: 'Create',
			href: '/quizzes/create',
			icon: 'mdi:plus',
			validator: () => {
				return (
					page.url.pathname.split('/')[1] === 'quizzes' &&
					page.url.pathname.split('/')[2] === 'create'
				);
			}
		},
		{
			label: 'Leaderboard',
			href: '/leaderboard',
			icon: 'mdi:trophy',
			validator: () => {
				return page.url.pathname.split('/')[1] === 'leaderboard';
			}
		},
		{
			label: 'Profile',
			href: '/profile',
			icon: 'mdi:account',
			validator: () => {
				const pathParts = page.url.pathname.split('/');
				return (
					pathParts[1] === 'profile' ||
					(pathParts[1] === 'user' && pathParts[2] === $session.data?.user.username) ||
					pathParts[1] === 'account'
				);
			}
		}
	];

	$effect(() => {
		if (!$session.data?.user || $session.data?.user) {
			invalidateAll();
		}
	});

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
	});
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
	/>
</svelte:head>

<div class="bg-base-100 mb-12 flex min-h-[100dvh] flex-col sm:mb-2">
	<header
		class="navbar bg-base-200/95 supports-[backdrop-filter]:bg-base-200/80 px-4 shadow-lg backdrop-blur sm:sticky sm:top-0 sm:z-50"
	>
		<div class="navbar-start">
			<a href="/" class="btn btn-ghost text-lg font-bold normal-case sm:text-xl">
				<Brand />
			</a>
		</div>
		<div class="navbar-center hidden gap-1 md:flex">
			{#each navLinks as link (link.href)}
				<a
					href={link.href}
					class="btn btn-ghost btn-sm gap-2 {page.url.pathname === link.href ? 'btn-active' : ''}"
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
								onclick={() => authClient.signOut().then(() => goto(page.url.pathname))}
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

	<main class="container mx-auto mb-2 flex-1 overflow-hidden px-4 py-6 sm:mb-1 sm:py-8">
		{@render children()}
	</main>

	<div class="dock fixed right-0 bottom-0 left-0 z-50 sm:hidden">
		<a href="/" class:dock-active={page.url.pathname === '/'}>
			<Icon icon="mdi:home" class="h-5 w-5" />
			<span class="dock-label">Home</span>
		</a>
		{#each navLinks as link (link.href)}
			<a href={link.href} class:dock-active={link.validator()}>
				<Icon icon={link.icon} class="h-5 w-5" />
				<span class="dock-label">{link.label}</span>
			</a>
		{/each}
	</div>
</div>

<Toaster max={3} />
