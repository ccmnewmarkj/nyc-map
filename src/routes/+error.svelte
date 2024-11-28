<script>
	import { page } from '$app/stores';

	// ABI logo
	import ccmLogo from '$lib/images/TheCenterForCommunityMedia.png';

	// Import icon components
	import LeftArrow from '$lib/components/icons/LeftArrow.svelte';

	// Check if on main page
	const isMainPage = $page.url.pathname === '/';
</script>

<div class="page-container">
	<div class="text-container">
		<a href="https://www.journalism.cuny.edu/centers/center-community-media/"
			><img src={ccmLogo} alt="Center for Community logo" width="325" height="auto" /></a
		>

		<p class="error-number">404</p>
		<p class="error-msg">{$page.error.message}</p>
		<p style="font-size: 0.9rem;">
			Please report the error to <a href="mailto:ccm@journalism.cuny.edu">ccm@journalism.cuny.edu</a
			>.
		</p>
		<hr />
		<p class="goto-link">
			{#if isMainPage}
				<!-- if main map page -->
				<LeftArrow />
				Go to the
				<a href="https://www.journalism.cuny.edu/centers/center-community-media/"
					>Center for Community Media</a
				>
			{:else}
				<!-- if path added to domain -->
				<a href="/" style="display: flex; gap: 3px; align-items: center;"
					><LeftArrow />Many Voices, One City Map</a
				>
			{/if}
		</p>
	</div>
</div>

<style>
	.page-container {
		height: 90vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.text-container {
		padding-top: 1rem;
		text-align: center;
	}

	.error-number {
		margin-top: 1rem;
		font-size: 3rem;
		font-weight: 600;
		color: #ff8200;
	}

	.error-msg {
		font-size: 1.15rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	hr {
		margin: 1rem 0;
	}

	.goto-link {
		display: flex;
		justify-content: center;
		align-items: end;
		gap: 5px;
	}
</style>
