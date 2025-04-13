<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { authClient } from '$lib/auth/client';
	import { goto } from '$app/navigation';
	import SocialProviders from '$lib/components/SocialProviders.svelte';
	let { data }: { data: PageData } = $props();

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let username = $state('');
	let error = $state('');
	let usernameStatus = $state<'idle' | 'checking' | 'available' | 'unavailable' | 'invalid'>(
		'idle'
	);
	let usernameMessage = $state('');
	let debounceTimer: ReturnType<typeof setTimeout> | null = $state(null);
	let ready = $derived.by(() => {
		const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		const isPasswordValid = password.length >= 8;
		const doPasswordsMatch = password === confirmPassword;

		return (
			name.length > 0 &&
			username.length >= 3 &&
			isEmailValid &&
			isPasswordValid &&
			doPasswordsMatch &&
			usernameStatus === 'available'
		);
	});

	const checkUsername = async (value: string) => {
		if (debounceTimer) clearTimeout(debounceTimer);

		if (!value) {
			usernameStatus = 'idle';
			usernameMessage = '';
			return;
		}

		if (value.length < 3) {
			usernameStatus = 'invalid';
			usernameMessage = 'Username must be at least 3 characters';
			return;
		}

		usernameStatus = 'checking';
		usernameMessage = 'Checking availability...';

		debounceTimer = setTimeout(async () => {
			try {
				const response = await fetch(`/api/check-username?username=${encodeURIComponent(value)}`);
				const data = await response.json();

				if (data.available) {
					usernameStatus = 'available';
					usernameMessage = 'Username is available';
				} else {
					usernameStatus = 'unavailable';
					usernameMessage = data.error || 'Username is already taken';
				}
			} catch (err) {
				usernameStatus = 'idle';
				usernameMessage = 'Error checking availability';
			}
		}, 500);
	};

	const handleSubmit = async () => {
		const data = await authClient.signUp.email({
			name,
			email,
			password,
			username
		});
		if (data.error?.message) {
			error = data.error.message;
		} else {
			goto('/');
		}
	};
</script>

<div class="flex min-h-[50vh] flex-col items-center justify-center">
	<div class="bg-base-200 w-full max-w-md rounded-lg p-8 shadow-lg">
		<div class="tabs tabs-boxed mb-6 w-full justify-center">
			<a href="/auth/login" class="tab">Login</a>
			<a href="/auth/signup" class="tab tab-active">Sign Up</a>
		</div>

		<h1 class="mb-6 text-center text-2xl font-bold">Create your account</h1>

		{#if error}
			<div class="alert alert-error mb-4 flex w-full justify-between">
				<div class="flex items-center gap-2">
					<Icon icon="mdi:alert-circle" class="h-5 w-5" />
					<span>{error}</span>
				</div>
				<button class="btn btn-sm btn-circle btn-ghost" onclick={() => (error = '')}>
					<Icon icon="mdi:close" class="h-5 w-5" />
				</button>
			</div>
		{/if}

		<form class="flex flex-col gap-4" onsubmit={handleSubmit}>
			<div class="form-control w-full">
				<label class="label" for="name">
					<span class="">Full Name</span>
				</label>
				<input
					type="text"
					id="name"
					name="name"
					class="input input-bordered w-full"
					placeholder="John Doe"
					bind:value={name}
					required
				/>
			</div>

			<div class="form-control w-full">
				<label class="label" for="username">
					<span class="">Username</span>
				</label>
				<div class="relative">
					<input
						type="text"
						id="username"
						name="username"
						class="input input-bordered w-full {usernameStatus === 'available'
							? 'input-success'
							: usernameStatus === 'unavailable'
								? 'input-error'
								: usernameStatus === 'invalid'
									? 'input-error'
									: ''}"
						placeholder="john_doe"
						bind:value={username}
						oninput={() => checkUsername(username)}
						required
					/>
					{#if usernameStatus === 'checking'}
						<div class="absolute top-1/2 right-3 -translate-y-1/2">
							<span class="loading loading-spinner loading-xs"></span>
						</div>
					{:else if usernameStatus === 'available'}
						<div class="text-success absolute top-1/2 right-3 -translate-y-1/2">
							<Icon icon="mdi:check-circle" class="h-5 w-5" />
						</div>
					{:else if usernameStatus === 'unavailable'}
						<div class="text-error absolute top-1/2 right-3 -translate-y-1/2">
							<Icon icon="mdi:close-circle" class="h-5 w-5" />
						</div>
					{/if}
				</div>
				<label class="label" for="username">
					<span
						class={usernameStatus === 'available'
							? 'text-success'
							: usernameStatus === 'unavailable'
								? 'text-error'
								: usernameStatus === 'invalid'
									? 'text-error'
									: ''}
					>
						{usernameMessage || 'Must be at least 3 characters'}
					</span>
				</label>
			</div>

			<div class="form-control w-full">
				<label class="label" for="email">
					<span class="">Email</span>
				</label>
				<input
					type="email"
					id="email"
					name="email"
					class="input input-bordered w-full"
					placeholder="john@example.com"
					bind:value={email}
					required
				/>
			</div>

			<div class="form-control w-full">
				<label class="label" for="password">
					<span class="">Password</span>
				</label>
				<input
					type="password"
					id="password"
					name="password"
					class="input input-bordered w-full"
					placeholder="••••••••"
					bind:value={password}
					required
					minlength="8"
				/>
				<label class="label" for="password">
					<span>Must be at least 8 characters</span>
				</label>
			</div>
			<div class="form-control w-full">
				<label class="label" for="confirmPassword">
					<span class="">Confirm Password</span>
				</label>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					class="input input-bordered w-full"
					placeholder="••••••••"
					bind:value={confirmPassword}
					required
					minlength="8"
				/>
				<label class="label" for="confirmPassword">
					<span>Must be the same as password</span>
				</label>
			</div>
			<button type="submit" class="btn btn-primary mt-2 w-full" disabled={!ready}>
				Create Account
			</button>
		</form>

		<div class="divider my-6">OR</div>

		<SocialProviders />

		<p class="text-base-content/70 mt-6 text-center text-sm">
			By signing up, you agree to our
			<a href="/terms-of-service" class="link">Terms of Service</a>
			and
			<a href="/privacy-policy" class="link">Privacy Policy</a>
		</p>
	</div>
</div>
