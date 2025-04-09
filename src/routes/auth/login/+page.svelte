<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { authClient } from '$lib/auth/client';
	import { goto } from '$app/navigation';
	import SocialProviders from '$lib/components/SocialProviders.svelte';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();
	let email = $state('');
	let password = $state('');
	let remember = $state(false);
	let error = $state('');
	let redirectTo = $state(page.url.searchParams.get('redirectTo') || '/');
	console.log(redirectTo);
	const handleSubmit = async () => {
		const data = await authClient.signIn.email({
			email,
			password,
			rememberMe: remember
		});
		if (data.error?.message) {
			error = data.error.message;
		} else {
			goto(redirectTo);
		}
	};
</script>

<div class="flex min-h-[50vh] flex-col items-center justify-center">
	<div class="bg-base-200 w-full max-w-md rounded-lg p-8 shadow-lg">
		<div class="tabs tabs-boxed mb-6 w-full justify-center">
			<a href="/auth/login" class="tab tab-active">Login</a>
			<a href="/auth/signup" class="tab">Sign Up</a>
		</div>

		<h1 class="mb-6 text-center text-2xl font-bold">Login to your account</h1>

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
				<label class="label" for="email">
					<span class="label-text">Email</span>
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
					<span class="label-text">Password</span>
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
			</div>

			<div class="form-control flex w-full items-center gap-2">
				<input
					type="checkbox"
					id="remember"
					name="remember"
					class="checkbox checkbox-md"
					bind:checked={remember}
				/>
				<label class="label" for="remember">
					<span class="label-text">Remember me</span>
				</label>
			</div>

			<button type="submit" class="btn btn-primary mt-2 w-full">Login</button>
		</form>

		<div class="divider my-6">OR</div>

		<SocialProviders {redirectTo} />

		<p class="text-base-content/70 mt-6 text-center text-sm">
			By signing up, you agree to our
			<a href="/terms-of-service" class="link">Terms of Service</a>
			and
			<a href="/privacy-policy" class="link">Privacy Policy</a>
		</p>
	</div>
</div>
