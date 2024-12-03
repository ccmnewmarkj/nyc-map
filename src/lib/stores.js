import { writable } from 'svelte/store';

export let map = writable();
export let popup = writable(); // Map popup

export let directoryData = writable([]); // Raw directory data
export let filteredDirectory = writable([]); // Filtered directory data

export let countyPolygons = writable(); // County polygons
export let ntaPolygons = writable(); // Neighborhood tabulation areas polygons

// Panels
export let aboutPanelVisible = writable(true);
export let searchPanelVisible = writable(false);
export let outletPanelVisible = writable(false);

// Filters
export let selectedAudience = writable();
export let selectedLanguage = writable();
export let selectedFormat = writable();
export let selectedOutlet = writable();
