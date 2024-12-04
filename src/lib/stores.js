import { writable, derived } from 'svelte/store';

export let map = writable();
export let popup = writable(); // Map popup

export let directoryData = writable([]); // Raw directory data
export let filteredDirectory = writable([]); // Directory data with any filters applied

export let countyPolygons = writable(); // County polygons
export let ntaPolygons = writable(); // Neighborhood tabulation area polygons

// Panels
export let aboutPanelVisible = writable(true);
export let searchPanelVisible = writable(false);
export let outletPanelVisible = writable(false);

// Filters
export let selectedAudience = writable(null);
export let selectedLanguage = writable();
export let selectedFormat = writable();
export let selectedOutlet = writable();

// Get number of outlets in directory
export let outletCount = derived([directoryData], ([$directoryData]) => {
	if ($directoryData.features) {
		return $directoryData.features.length;
		//return '257';
	}
});
