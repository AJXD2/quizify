<script lang="ts">
	import { onMount } from 'svelte';
	import { authClient } from '$lib/auth/client';
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';
	import { toasts } from '$lib/stores/toast';
	import { invalidate } from '$app/navigation';

	// Extracted reusable functions for validation
	function validatePasswordChange(
		currentPassword: string,
		newPassword: string,
		confirmPassword: string
	): string | null {
		if (newPassword !== confirmPassword) {
			return 'New passwords do not match';
		}
		if (newPassword.length < 8) {
			return 'Password must be at least 8 characters';
		}
		return null;
	}

	function validateUsername(username: string): string | null {
		if (!username || username.length < 3) {
			return 'Username must be at least 3 characters';
		}
		return null;
	}

	// Simplified state management
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let username = $state('');
	let email = $state('');
	let name = $state('');
	let successMessage = $state('');
	let errorMessage = $state('');
	let isLoading = $state(false);
	let displayUsername = $state('');

	let originalUsername = $state('');
	let originalDisplayUsername = $state('');
	let originalName = $state('');
	let originalEmail = $state('');

	let hasCredentialAccount = $state(false);
	let newEmail = $state('');
	let changeEmailModal: HTMLDialogElement | null = null;

	let hasUnsavedChanges = $derived.by(
		() =>
			username !== originalUsername ||
			name !== originalName ||
			email !== originalEmail ||
			displayUsername !== originalDisplayUsername ||
			(currentPassword && newPassword && confirmPassword)
	);

	let usernameStatus = $state<'idle' | 'checking' | 'available' | 'unavailable' | 'invalid'>(
		'idle'
	);
	let usernameMessage = $state('');
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	const checkUsername = async (value: string) => {
		if (debounceTimer) clearTimeout(debounceTimer);

		if (value === originalUsername) {
			usernameStatus = 'idle';
			usernameMessage = '';
			return;
		}

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

	onMount(async () => {
		isLoading = true;
		const session = await authClient.getSession();
		if (session.data?.user) {
			username = session.data.user.username || '';
			email = session.data.user.email || '';
			name = session.data.user.name || '';
			displayUsername = session.data.user.displayUsername || '';

			originalUsername = username;
			originalEmail = email;
			originalName = name;
			originalDisplayUsername = displayUsername;
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
		displayUsername = originalDisplayUsername;
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
	}

	async function saveChanges() {
		errorMessage = '';
		successMessage = '';

		// Ensure changes were made before validating

		const passwordError = validatePasswordChange(currentPassword, newPassword, confirmPassword);
		if (passwordError && (currentPassword || newPassword || confirmPassword)) {
			errorMessage = passwordError;
			return;
		}

		const usernameError = validateUsername(username);
		if (usernameError && username !== originalUsername) {
			errorMessage = usernameError;
			return;
		}

		try {
			// Username
			if (username !== originalUsername) {
				const userData = await authClient.updateUser({ username });
				if (userData.error?.message) {
					errorMessage = userData.error.message;
					return;
				}
				originalUsername = username;
			}
			// Display Username
			if (displayUsername !== originalDisplayUsername) {
				const userData = await authClient.updateUser({ displayUsername });
				if (userData.error?.message) {
					errorMessage = userData.error.message;
					return;
				}
				originalDisplayUsername = displayUsername;
			}
			// Password
			if (currentPassword && newPassword && confirmPassword) {
				const passwordData = await authClient.changePassword({ currentPassword, newPassword });
				if (passwordData.error?.message) {
					errorMessage = passwordData.error.message;
					return;
				}
				currentPassword = '';
				newPassword = '';
				confirmPassword = '';
			}

			toasts.success({ title: 'Changes saved', message: 'Your changes have been saved.' });
		} catch (err) {
			errorMessage = 'An error occurred while saving changes';
			console.error(err);
		}
	}

	async function onChangeEmail() {
		changeEmailModal?.close();
		if (!newEmail) {
			toasts.error({ title: 'Error changing email', message: 'Please use a valid email' });
			return;
		}
		const { data, error } = await authClient.changeEmail({ newEmail });
		if (error?.message) {
			toasts.error({ title: 'Error changing email', message: error.message });
			return;
		}
		toasts.success({ title: 'Email sent', message: 'Check your email for instructions.' });
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
				class="bg-base-200 rounded-box border-base-300 fixed bottom-16 left-1/2 z-50 mx-auto mb-6 flex w-xs max-w-xl -translate-x-1/2 items-center justify-between border px-4 py-3 shadow-lg sm:bottom-0 sm:w-full"
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

					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div class="form-control flex flex-col">
							<label for="name" class="label">
								<span class="label-text">Name</span>
							</label>
							<input id="name" type="text" class="input input-bordered" bind:value={name} />
						</div>

						<div class="form-control flex flex-col">
							<label for="email" class="label">
								<span>Email</span>
							</label>

							<input
								id="email"
								type="email"
								class="input input-bordered"
								bind:value={email}
								disabled
							/>
						</div>
					</div>

					<div class="form-control">
						<button
							class="btn btn-outline"
							onclick={() => {
								changeEmailModal?.showModal();
							}}><Icon icon="mdi:pencil" class="h-6 w-6" />Change Email</button
						>
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
					{#if !originalUsername}
						<div class="alert alert-warning mb-4 flex w-full justify-between">
							<div class="flex items-center gap-2">
								<Icon icon="mdi:alert-circle" class="h-5 w-5" />
								<span>Please set your username to use this website properly.</span>
							</div>
							<button
								class="btn btn-sm btn-circle btn-ghost"
								onclick={() => (originalUsername = username)}
							>
								<Icon icon="mdi:close" class="h-5 w-5" />
							</button>
						</div>
					{/if}

					<div class="grid gap-4 md:grid-cols-2">
						<div class="form-control w-full max-w-md">
							<label for="username" class="label">
								<span class="label-text">Username</span>
							</label>
							<div class="relative">
								<input
									id="username"
									type="text"
									class="input input-bordered w-full"
									class:input-success={usernameStatus === 'available'}
									class:input-error={usernameStatus === 'unavailable' ||
										usernameStatus === 'invalid'}
									autocomplete="off"
									placeholder="Enter username"
									bind:value={username}
									oninput={() => checkUsername(username)}
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
							<label for="username" class="label">
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
						<div class="form-control w-full max-w-md">
							<label for="displayUsername" class="label">
								<span class="label-text">Display Username</span>
							</label>
							<input
								id="displayUsername"
								type="text"
								class="input input-bordered w-full"
								placeholder="Enter display username"
								bind:value={displayUsername}
							/>
						</div>
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
<dialog
	id="emailChangeModal"
	class="modal modal-bottom sm:modal-middle"
	bind:this={changeEmailModal}
>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Change Email</h3>
		<div class="space-y-4 py-4">
			<input
				type="email"
				placeholder="New Email"
				bind:value={newEmail}
				class="input input-bordered w-full"
			/>
			<div class="modal-action">
				<button
					class="btn btn-outline"
					onclick={() => {
						changeEmailModal?.close();
					}}>Cancel</button
				>
				<button class="btn btn-primary" onclick={onChangeEmail}>Confirm Change</button>
			</div>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
