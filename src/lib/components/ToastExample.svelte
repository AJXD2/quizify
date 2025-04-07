<script lang="ts">
	import { toasts, getToastContext } from '$lib/stores/toast';

	// You can also get toasts from context if Toaster is a parent component
	// const toastContext = getToastContext();

	function showInfoToast() {
		toasts.info({
			message: 'This is an info message',
			title: 'Information'
		});
	}

	function showSuccessToast() {
		toasts.success({
			message: 'Your changes have been saved',
			title: 'Success',
			icon: 'mdi:check-circle-outline'
		});
	}

	function showWarningToast() {
		toasts.warning({
			message: 'You are about to delete this item',
			title: 'Warning',
			action: {
				label: 'Undo',
				callback: () => {
					console.log('Undo clicked');
				}
			}
		});
	}

	function showErrorToast() {
		toasts.error({
			message: 'Failed to save changes. Please try again.',
			title: 'Error',
			duration: 5000
		});
	}

	function showCustomToast() {
		toasts.add({
			type: 'info',
			message: 'Custom duration toast',
			title: 'Custom',
			duration: 10000,
			icon: 'mdi:bell'
		});
	}
</script>

<div class="space-y-4 p-4">
	<h2 class="mb-4 text-xl font-bold">Toast Examples</h2>

	<div class="flex flex-wrap gap-2">
		<button class="btn btn-info" on:click={showInfoToast}> Show Info Toast </button>

		<button class="btn btn-success" on:click={showSuccessToast}> Show Success Toast </button>

		<button class="btn btn-warning" on:click={showWarningToast}>
			Show Warning Toast with Action
		</button>

		<button class="btn btn-error" on:click={showErrorToast}> Show Error Toast (5s) </button>

		<button class="btn" on:click={showCustomToast}> Show Custom Toast (10s) </button>
	</div>
</div>
