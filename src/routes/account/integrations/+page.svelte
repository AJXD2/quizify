<script lang="ts">
	// Mock integrations data
	import { authClient } from '$lib/auth/client';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	let isLoading = $state(false);
	// Use type from listAccounts return value instead of Account
	let userConnections = $state<
		{
			id: string;
			provider: string;
			createdAt: Date;
			updatedAt: Date;
			accountId: string;
			scopes: string[];
		}[]
	>([]);

	onMount(async () => {
		isLoading = true;
		const connections = await authClient.listAccounts();
		userConnections = connections?.data || [];
		isLoading = false;
	});

	const integrations = [
		{
			id: 'google',
			name: 'Google',
			icon: 'logos:google-icon',
			connected: false,
			lastSync: '2023-10-15'
		},
		{
			id: 'discord',
			name: 'Discord',
			icon: 'logos:discord-icon',
			connected: false,
			lastSync: '2023-11-22'
		}
	];

	function hasIntegration(provider: string) {
		return userConnections.find((connection) => connection.provider === provider);
	}
</script>

<div>
	<h1 class="mb-6 text-2xl font-bold">Integrations & Connected Apps</h1>

	<div class="space-y-6">
		<p class="text-sm opacity-70">
			Connect external services to enhance your experience. You can revoke access at any time.
		</p>

		<!-- Integrations List -->
		<div class="card bg-base-200">
			<div class="card-body">
				<h2 class="card-title">Connected Services</h2>

				<div class="overflow-x-auto">
					{#if isLoading}
						<div class="flex h-full w-full items-center justify-center">
							<div class="loading loading-spinner loading-xl"></div>
						</div>
					{:else}
						<table class="table">
							<thead>
								<tr>
									<th>Service</th>
									<th>Status</th>
									<th>Last Sync</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{#each integrations as integration (integration.id)}
									<tr>
										<td>
											<div class="flex items-center gap-2">
												<Icon icon={integration.icon} />
												<span>{integration.name}</span>
											</div>
										</td>
										<td>
											{#if hasIntegration(integration.id)}
												<span class="badge badge-success">Connected</span>
											{:else}
												<span class="badge badge-ghost">Disconnected</span>
											{/if}
										</td>
										<td>
											{userConnections
												.find((connection) => connection.provider === integration.id)
												?.createdAt.toLocaleDateString() || 'Never'}
										</td>
										<td>
											<button
												class="btn btn-sm"
												class:btn-primary={!userConnections.find(
													(connection) => connection.provider === integration.id
												)}
												class:btn-error={userConnections.find(
													(connection) => connection.provider === integration.id
												)}
												onclick={() => {
													if (hasIntegration(integration.id)) {
														authClient.unlinkAccount({ providerId: integration.id });
													} else {
														authClient.linkSocial({ provider: integration.id as any });
													}
												}}
											>
												{userConnections.find(
													(connection) => connection.provider === integration.id
												)
													? 'Disconnect'
													: 'Connect'}
											</button>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
