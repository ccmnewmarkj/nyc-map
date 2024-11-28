<script>
	// Import stylesheet
	import '../app.css';

	// Import stores
	import { map, directoryData } from '$lib/stores.js';

	// Import icon components
	import NYSIcon from '$lib/components/icons/NYS.svelte';

	// Create promise that resolves when map and data have loaded
	let loadData = Promise.all([$map, $directoryData]);

	// Description for meta tags
	const siteDescription = 'Interactive map of media outlets in the New York City metro area';
	const siteName = 'Many Voices, One City Map | CCM';
	const siteSS = 'https://amimap.journalism.cuny.edu/images/ccm-nys-map-ss.jpg';
</script>

<svelte:head>
	<title>Many Voices, One City Map | Center for Community Media</title>
	<!-- <meta name="description" content={siteDescription} />
	<meta property="og:title" content={siteName} />
	<meta property="og:description" content={siteDescription} />
	<meta property="og:url" content="https://nycmap.journalism.cuny.edu/" />
	<meta property="og:image" content={siteSS} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={siteName} />
	<meta name="twitter:description" content={siteDescription} />
	<meta name="twitter:site" content="@ccmnewmarkj" />
	<meta name="twitter:image" content={siteSS} />
	<meta name="twitter:creator" content="@ccmnewmarkj" /> -->
</svelte:head>

{#await loadData}
	<div class="page-container">
		<div style="width: 50px; height: 50px;"><NYSIcon /></div>

		<p>Loading...</p>
		<div class="loader"></div>
	</div>
{:then}
	<slot />
{/await}

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 90vh;
		font-family: 'Roboto Condensed', sans-serif;
		font-size: 1rem;
	}

	p {
		margin: 8px;
	}

	.loader {
		height: 25px;
		width: 25px;
		border-radius: 100%;
		border: 2px solid;
		border-color: #eee #eee rgb(255, 171, 77) #eee;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
