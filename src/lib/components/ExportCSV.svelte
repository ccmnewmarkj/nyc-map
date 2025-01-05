<script>
	import { filteredDirectory } from '$lib/stores';
	import DownloadIcon from '$lib/components/icons/Download.svelte';

	// Modify filtered directory fields for export
	$: filteredDirectoryExport = $filteredDirectory?.features.map((d) => {
		const obj = {
			Outlet: d.properties['OUTLET'],
			Link: d.properties['URL'],
			'Directory Link': d.properties['DIRECTORY URL'],
			City: d.properties['CITY'],
			State: d.properties['STATE'],
			'Primary Format': d.properties['PRIMARY FORMAT'],
			Founded: d.properties['FOUNDED'],
			'Ethnic Audience': d.properties['TARGET ETHNICITY'],
			'Religious Audience': d.properties['TARGET RELIGION'],
			Subject: d.properties['TARGET THEME'],
			'Geographic Audience': d.properties['TARGET LOCATION'],
			'Primary Language': d.properties['PRIMARY LANGUAGE'],
			'Additional Language': d.properties['ADDITIONAL LANGUAGE']
		};
		return obj;
	});

	let csvContent = '';

	function convertToCSV(data) {
		if (data.length === 0) return '';

		const headers = Object.keys(data[0]).join(',');
		const rows = data
			.map((item) => {
				return Object.values(item).join(',');
			})
			.join('\n');

		return `${headers}\n${rows}`;
	}

	// let downloadErrorMsg = '';
	function downloadCSV() {
		const data = filteredDirectoryExport;
		if (data && data.length > 0) {
			csvContent = convertToCSV(data);
			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
			const link = document.createElement('a');
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', 'mvoc-ccm_nyc_directory.csv');
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
		// else {
		// 	//alert('No data available to export.');
		// 	downloadErrorMsg = `Data cannot be downloaded. If this is an error, please contact <a href="mailto:ccm@journalism.cuny.edu">ccm@journalism.cuny.edu</a>.`;
		// }
	}

	// Num of outlets in filtered directory
	$: outletNum = $filteredDirectory?.features.length;
</script>

<div class="dl-btn-container">
	<button on:click={downloadCSV} class:grayedOut={outletNum === 0}
		><DownloadIcon fillColor={'rgba(var(--dark-cerulean), 1)'} /><span>Download Data</span></button
	>
	<span
		>for the <strong>{outletNum}</strong>
		{outletNum > 1 || outletNum === 0 ? 'outlets' : 'outlet'} below (CSV file)</span
	>
</div>

<style>
	.dl-btn-container {
		display: block;
		font-family: 'Roboto Condensed', sans-serif;
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		column-gap: 5px;
	}

	button {
		border: 1px solid rgba(var(--black), 1);
		text-transform: uppercase;
		font-size: 0.8rem;
		padding: 4px 8px;
		border-radius: 3px;
		display: flex;
		align-items: center;
		gap: 3px;
		font-weight: 800;
		background-color: rgba(var(--off-white), 1);
		color: rgba(var(--dark-cerulean), 1);
		box-shadow: rgba(var(--cerulean), 0.5) 0 -2px 0 inset;
		display: flex;
		column-gap: 5px;
	}

	button:hover {
		transition: 0.5s;
		box-shadow: rgba(var(--dark-cerulean), 0.65) 0 -2px 0 inset;
		filter: saturate(150%);
	}

	button.grayedOut {
		opacity: 50%;
		cursor: auto;
	}
</style>
