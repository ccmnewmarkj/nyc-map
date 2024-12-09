import { writable, derived } from 'svelte/store';

export let map = writable();
export let popup = writable(); // Map popup

export let directoryData = writable([]); // Raw directory data
//export let filteredDirectory = writable([]); // Directory data with any filters applied

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

export let filteredDirectory = derived(
	[directoryData, selectedFormat, selectedAudience, selectedLanguage],
	([$directoryData, $selectedFormat, $selectedAudience, $selectedLanguage]) => {
		if (
			$selectedFormat ||
			$selectedAudience?.ethnicity ||
			$selectedAudience?.religion ||
			$selectedAudience?.theme ||
			$selectedAudience?.geography ||
			$selectedLanguage
		) {
			return {
				type: 'FeatureCollection',
				features: $directoryData.features?.filter((d) => {
					// FORMAT
					let formatState = !$selectedFormat || $selectedFormat === d.properties['PRIMARY FORMAT'];

					// COMMUNITY
					let audienceState =
						!$selectedAudience ||
						(($selectedAudience?.ethnicity
							? $selectedAudience.ethnicity.every(
									(ethnicity) =>
										d.properties['TARGET ETHNICITY'] &&
										d.properties['TARGET ETHNICITY']?.includes(ethnicity)
								)
							: true) &&
							($selectedAudience?.religion
								? $selectedAudience.religion.every(
										(religion) =>
											d.properties['TARGET RELIGION'] &&
											d.properties['TARGET RELIGION']?.includes(religion)
									)
								: true) &&
							($selectedAudience?.theme
								? $selectedAudience.theme.every(
										(theme) =>
											d.properties['TARGET THEME'] && d.properties['TARGET THEME']?.includes(theme)
									)
								: true) &&
							($selectedAudience?.geography
								? $selectedAudience.geography.every(
										(geography) =>
											d.properties['TARGET LOCATION'] &&
											d.properties['TARGET LOCATION']?.includes(geography)
									)
								: true));

					// LANGUAGE
					let languageState =
						!$selectedLanguage ||
						$selectedLanguage?.every((language) =>
							d.properties['PRIMARY LANGUAGE'].includes(language)
						);

					return formatState && audienceState && languageState;
				})
			};
		} else {
			return $directoryData;
		}
	}
);
