<script lang="ts">
	import { onMount } from 'svelte';
	import { authClient } from '$lib/auth/client';
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';
	import { toasts } from '$lib/stores/toast';
	// User account settings
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let username = $state('');
	let email = $state('');
	let name = $state('');
	let successMessage = $state('');
	let errorMessage = $state('');
	let isLoading = $state(false);
	// Track original and current values
	let originalUsername = $state('');
	let originalName = $state('');
	let originalEmail = $state('');
	let hasUnsavedChanges = $derived(
		username !== originalUsername ||
			name !== originalName ||
			email !== originalEmail ||
			(currentPassword && newPassword && confirmPassword)
	);

	let usernameErrorClosed = $state(false);
	let hasCredentialAccount = $state(false);
	// Get current user data

	onMount(async () => {
		isLoading = true;
		const session = await authClient.getSession();
		if (session.data?.user) {
			console.log(session.data.user);
			username = session.data.user.username || '';
			email = session.data.user.email || '';
			name = session.data.user.name || '';

			// Store original values
			originalUsername = username;
			originalEmail = email;
			originalName = name;
		}
		const accounts = await authClient.listAccounts();
		hasCredentialAccount =
			accounts.data?.some((account) => account.provider === 'credential') || false;
		isLoading = false;
	});

	function resetChanges() {
		username = originalUsername;
		email = originalEmail;
		name = originalName;
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
	}

	async function saveChanges() {
		errorMessage = '';
		successMessage = '';

		let hasPasswordChange = currentPassword && newPassword && confirmPassword;
		let hasProfileChange =
			username !== originalUsername || name !== originalName || email !== originalEmail;

		// Validate password change if needed
		if (hasPasswordChange) {
			if (newPassword !== confirmPassword) {
				errorMessage = 'New passwords do not match';
				return;
			}

			if (newPassword.length < 8) {
				errorMessage = 'Password must be at least 8 characters';
				return;
			}
		}

		// Validate username if changed
		if (username !== originalUsername) {
			if (!username || username.length < 3) {
				errorMessage = 'Username must be at least 3 characters';
				return;
			}
		}

		try {
			// Update username if changed
			if (username !== originalUsername) {
				const userData = await authClient.updateUser({
					username
				});

				if (userData.error?.message) {
					errorMessage = userData.error.message;
					return;
				}

				originalUsername = username;
			}

			// Update name and email if changed
			if (hasProfileChange && (name !== originalName || email !== originalEmail)) {
				const userData = await authClient.updateUser({
					name,
					username
				});
				const emailChange = await authClient.changeEmail({
					newEmail: email,
					callbackURL: '/account'
				});

				if (userData.error?.message) {
					errorMessage = userData.error.message;
					return;
				}

				if (emailChange.error?.message) {
					errorMessage = emailChange.error.message;
					return;
				}

				originalName = name;
				originalEmail = email;
			}

			// Update password if provided
			if (hasPasswordChange) {
				const passwordData = await authClient.changePassword({
					currentPassword,
					newPassword
				});

				if (passwordData.error?.message) {
					errorMessage = passwordData.error.message;
					return;
				}

				currentPassword = '';
				newPassword = '';
				confirmPassword = '';
			}

			successMessage = 'Changes saved successfully';
		} catch (err) {
			errorMessage = 'An error occurred while saving changes';
			console.error(err);
		}
	}
</script>

{#if isLoading}
	<div class="flex h-full w-full items-center justify-center">
		<div class="loading loading-spinner loading-xl"></div>
	</div>
{:else}
	<div>
		<h1 class="mb-6 text-2xl font-bold">Account Settings</h1>

		{#if successMessage}
			<div class="alert alert-success mb-4 flex w-full justify-between">
				<div class="flex items-center gap-2">
					<Icon icon="mdi:check-circle" class="h-5 w-5" />
					<span>{successMessage}</span>
				</div>
				<button class="btn btn-sm btn-circle btn-ghost" onclick={() => (successMessage = '')}>
					<Icon icon="mdi:close" class="h-5 w-5" />
				</button>
			</div>
		{/if}

		{#if errorMessage}
			<div class="alert alert-error mb-4 flex w-full justify-between">
				<div class="flex items-center gap-2">
					<Icon icon="mdi:alert-circle" class="h-5 w-5" />
					<span>{errorMessage}</span>
				</div>
				<button class="btn btn-sm btn-circle btn-ghost" onclick={() => (errorMessage = '')}>
					<Icon icon="mdi:close" class="h-5 w-5" />
				</button>
			</div>
		{/if}

		{#if hasUnsavedChanges}
			<div
				in:fly={{ y: 100, delay: 1.5 }}
				out:fly={{ y: 100, delay: 1.5 }}
				class="bg-base-200 rounded-box border-base-300 fixed bottom-0 left-1/2 z-50 mx-auto mb-6 flex w-full max-w-xl -translate-x-1/2 items-center justify-between border px-4 py-3 shadow-lg"
			>
				<div class="text-base-content flex items-center gap-2">
					<Icon icon="mdi:alert-circle" class="text-warning h-5 w-5" />
					<span class="font-medium">Unsaved changes</span>
				</div>
				<div class="flex gap-2">
					<button class="btn btn-sm btn-ghost" onclick={resetChanges}>Discard</button>
					<button class="btn btn-sm btn-primary" onclick={saveChanges}>Save</button>
				</div>
			</div>
		{/if}

		<div class="mb-20 space-y-6">
			<!-- Profile Information -->
			<div class="card bg-base-200">
				<div class="card-body">
					<h2 class="card-title">Profile Information</h2>
					<p class="mb-4 text-sm opacity-70">Your basic account information.</p>

					<div class="grid gap-4 md:grid-cols-2">
						<div class="form-control w-full">
							<label for="name" class="label">
								<span class="label-text">Name</span>
							</label>
							<input id="name" type="text" class="input input-bordered w-full" bind:value={name} />
						</div>

						<div class="form-control w-full">
							<label for="email" class="label">
								<span>Email</span>
							</label>
							<input
								id="email"
								type="email"
								class="input input-bordered w-full"
								bind:value={email}
								disabled
							/>
							<label for="email" class="label">
								<span class="text-sm opacity-70"
									>Email is not editable. Please contact support to change your email.</span
								>
							</label>
						</div>
					</div>
				</div>
			</div>

			<!-- Username Settings -->
			<div class="card bg-base-200">
				<div class="card-body">
					<h2 class="card-title">Username</h2>
					<p class="mb-4 text-sm opacity-70">
						Your username is visible to other users and is used for identification.
					</p>
					{#if !originalUsername && !usernameErrorClosed}
						<div class="alert alert-warning mb-4 flex w-full justify-between">
							<div class="flex items-center gap-2">
								<Icon icon="mdi:alert-circle" class="h-5 w-5" />
								<span>Please set your username to use this website properly.</span>
							</div>
							<button
								class="btn btn-sm btn-circle btn-ghost"
								onclick={() => (usernameErrorClosed = true)}
							>
								<Icon icon="mdi:close" class="h-5 w-5" />
							</button>
						</div>
					{/if}

					<div class="form-control w-full max-w-md">
						<label for="username" class="label">
							<span class="label-text">Username</span>
						</label>
						<input
							id="username"
							type="text"
							class="input input-bordered w-full"
							placeholder="Enter username"
							bind:value={username}
							minlength="3"
						/>
						<label for="username" class="label">
							<span class="label-text-alt">Must be at least 3 characters</span>
						</label>
					</div>
				</div>
			</div>

			<!-- Password Settings -->
			{#if hasCredentialAccount}
				<div class="card bg-base-200">
					<div class="card-body">
						<h2 class="card-title">Change Password</h2>
						<p class="mb-4 text-sm opacity-70">
							Ensure your account is using a strong, secure password.
						</p>

						<div class="form-control w-full max-w-md">
							<label for="currentPassword" class="label">
								<span class="label-text">Current Password</span>
							</label>
							<input
								id="currentPassword"
								type="password"
								class="input input-bordered w-full"
								placeholder="Enter current password"
								bind:value={currentPassword}
							/>
						</div>

						<div class="form-control w-full max-w-md">
							<label for="newPassword" class="label">
								<span class="label-text">New Password</span>
							</label>
							<input
								id="newPassword"
								type="password"
								class="input input-bordered w-full"
								placeholder="Enter new password"
								bind:value={newPassword}
								minlength="8"
							/>
							<label for="newPassword" class="label">
								<span class="label-text-alt">Must be at least 8 characters</span>
							</label>
						</div>

						<div class="form-control w-full max-w-md">
							<label for="confirmPassword" class="label">
								<span class="label-text">Confirm New Password</span>
							</label>
							<input
								type="password"
								class="input input-bordered w-full"
								placeholder="Confirm new password"
								bind:value={confirmPassword}
								minlength="8"
								id="confirmPassword"
							/>
						</div>
					</div>
				</div>
			{:else}
				<div class="card bg-base-200">
					<div class="card-body">
						<h2 class="card-title">Set Password</h2>
						<p class="mb-4 text-sm opacity-70">You have no password set for your account.</p>
						<button
							class="btn btn-primary"
							onclick={() =>
								authClient
									.forgetPassword({ email, redirectTo: '/account/reset-password' })
									.then(() => {
										toasts.success({
											message: 'Password reset email sent',
											title: 'Success',
											icon: 'mdi:check-circle'
										});
									})
									.catch((err) => {
										toasts.error({
											message: 'Failed to send password reset email',
											title: 'Error',
											icon: 'mdi:alert-circle'
										});
									})}
						>
							Set Password
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
