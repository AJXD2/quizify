<script lang="ts">
	import { page } from '$app/state';

	const {
		title,
		description,
		url,
		image = '/logo.png',
		type = 'website',
		keywords = 'quiz, quiz app, sveltekit, education, fun'
	}: {
		title: string;
		description: string;
		url: string;
		image?: string;
		type?: string;
		keywords?: string;
	} = $props();

	const siteName = 'Quizify';
	const twitterSite = '@ajxd2'; // Replace with your Twitter handle
</script>

<svelte:head>
	<!-- Standard SEO -->
	<title>{title} | {siteName}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />
	<link rel="canonical" href={url} />

	<!-- Open Graph / Facebook / Discord -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:logo" content="/favicon.png" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={twitterSite} />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
</svelte:head>
