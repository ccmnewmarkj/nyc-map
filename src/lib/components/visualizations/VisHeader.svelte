<script>
	// Import stores
	import { selectedFormat, selectedAudience, selectedLanguage } from '$lib/stores.js';

	// Header text when filter(s) applied - includes audience and language selections
	let format = $selectedFormat;
	$: headerFilterText = (() => {
		const { ethnicity, religion, theme } = $selectedAudience || {};
		const languages =
			$selectedLanguage?.length > 1
				? $selectedLanguage.join(', ').replace(/,([^,]*)$/, ' and$1')
				: $selectedLanguage;
		//const format = $selectedFormat;

		const themeText =
			theme?.toString() === 'LGBTQ' ? 'the LGBTQ community' : theme?.toString()?.toLowerCase();

		if (ethnicity && !languages && !religion && !theme && !format)
			return `covering the ${ethnicity} community`;
		if (religion && !languages && !ethnicity && !theme && !format)
			return `covering the ${religion} community`;
		if (theme && !languages && !ethnicity && !religion && !format) return `covering ${themeText}`;
		if (languages && !ethnicity && !religion && !theme && !format)
			return `reporting in ${languages}`;
		if (format && !ethnicity && !religion && !theme && !languages) return `in ${format} format`;

		if (languages && ethnicity && !religion && !theme && !format)
			return `covering the ${ethnicity} community in ${languages}`;
		if (languages && religion && !ethnicity && !theme && !format)
			return `covering the ${religion} community in ${languages}`;
		if (languages && theme && !ethnicity && !religion && !format)
			return `covering ${themeText} in ${languages}`;
		if (languages && format && !ethnicity && !religion && !theme)
			return `reporting in ${languages}`;

		if (ethnicity && religion && !languages && !theme && !format)
			return `covering the ${ethnicity} and ${religion} communities`;
		if (ethnicity && theme && !languages && !religion && !format)
			return `covering the ${ethnicity} community and ${themeText}`;
		if (ethnicity && format && !languages && !religion && !theme)
			return `covering the ${ethnicity} community`;

		if (religion && theme && !languages && !ethnicity && !format)
			return `covering the ${religion} community and ${themeText}`;
		if (religion && format && !languages && !ethnicity && !theme)
			return `covering the ${religion} community`;

		if (theme && format && !languages && !ethnicity && !religion) return `covering ${themeText}`;

		return '';
	})();

	export let filterCategory;
</script>

<div class="header">
	<p class="chart-title">
		{filterCategory === 'format'
			? 'Primary Format'
			: filterCategory === 'ethnicity'
				? 'Ethnicity'
				: filterCategory === 'religion'
					? 'Religion'
					: filterCategory === 'theme'
						? 'Subject'
						: filterCategory === 'language'
							? 'Primary Language'
							: ''}
	</p>
	<p class="chart-subtitle">
		{#if !format}
			Number of outlets, by {filterCategory}{#if headerFilterText}, {@html headerFilterText}{/if}
		{:else}
			Number of {format.toLowerCase()} outlets, by {filterCategory === 'format'
				? 'format'
				: filterCategory === 'ethnicity'
					? 'ethnicity'
					: filterCategory === 'language'
						? 'language'
						: ''}{#if headerFilterText}, {@html headerFilterText}{/if}
		{/if}
	</p>
	<hr />
</div>

<style>
	.header {
		padding: 5px;
	}

	.header {
		font-family: 'Roboto Condensed', sans-serif;
	}

	.chart-title {
		font-size: 0.95rem;
		font-weight: 600;
	}

	.chart-subtitle {
		font-size: 0.75rem;
	}

	hr {
		margin: 5px 0 0;
		border-top: 0.5px solid rgba(var(--black), 0.25);
	}
</style>
