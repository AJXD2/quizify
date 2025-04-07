<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth/client';
	import { toasts } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let password = $state('');
	let confirmPassword = $state('');
	const token = page.url.searchParams.get('token');

	const handleReset = async () => {
		if (password !== confirmPassword) {
			toasts.error({
				message: 'Passwords do not match',
				title: 'Error',
				icon: 'mdi:alert-circle'
			});
		}
		if (password.length < 8) {
			toasts.error({
				message: 'Password must be at least 8 characters long',
				title: 'Error',
				icon: 'mdi:alert-circle'
			});
		}
		if (!token) {
			toasts.error({
				message: 'Invalid token',
				title: 'Error',
				icon: 'mdi:alert-circle'
			});
		}
		const passwordData = await authClient.resetPassword({
			newPassword: password,
			token: token ?? undefined
		});
		if (passwordData.error?.message) {
			toasts.error({
				message: passwordData.error.message,
				title: 'Error',
				icon: 'mdi:alert-circle'
			});
		} else {
			toasts.success({
				message: 'Password reset successfully',
				title: 'Success',
				icon: 'mdi:check-circle'
			});
			goto('/account');
		}
	};
</script>

<div class="bg-base-200 flex min-h-screen items-center justify-center">
	<div class="card bg-base-100 w-full max-w-md shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-center text-2xl font-bold">Reset Password</h2>
			<p class="text-base-content/70 mb-4 text-center">Enter your new password below</p>

			<form onsubmit={handleReset}>
				<div class="form-control w-full">
					<label for="password" class="label">
						<span class="label-text">New Password</span>
					</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						class="input input-bordered w-full"
						required
					/>
				</div>

				<div class="form-control mt-4 w-full">
					<label for="confirmPassword" class="label">
						<span class="label-text">Confirm Password</span>
					</label>
					<input
						type="password"
						id="confirmPassword"
						bind:value={confirmPassword}
						class="input input-bordered w-full"
						required
					/>
				</div>

				<div class="form-control mt-6">
					<button type="submit" class="btn btn-primary">Reset Password</button>
				</div>
			</form>
		</div>
	</div>
</div>
