<script>
	// Import stores
	import { outletCount } from '$lib/stores.js';

	// Import icon components
	import MapPin from '$lib/components/icons/MapPin.svelte';

	// Logos
	import ccmLogo from '$lib/images/TheCenterForCommunityMedia.png';
	import newmarkJLogo from '$lib/images/NewmarkJ-logo.png';
</script>

<section id="about-body" aria-labelledby="about-btn">
	<p>
		This map of <span style="font-weight: 800;"
			>community media outlets in the New York City metro area</span
		>, includes {$outletCount}
		outlets serving communities of color, immigrants, and hyperlocal audiences. Accompanying the
		<strong
			><a href="https://directory-ccm.journalism.cuny.edu" target="_blank"
				>Many Voices, One City directory</a
			></strong
		>, it serves as a resource for advertisers, journalists, community organizers, and others who
		want to connect with the community media sector in the state.
	</p>

	<p class="callout" style="margin-top: 1rem;">
		For community media outlets in the state, visit CCM's <strong
			><a href="http://nysmap.journalism.cuny.edu">New York State Media Map</a></strong
		>.
	</p>

	<h2>How to use the map</h2>
	<p>
		Select the <span class="tab">Search</span> tab to apply filters that will narrow down the number
		of outlets, whether by community, language or media type. The list of outlets that appear under
		the
		<span class="tab">Outlets</span> tab will update accordingly.
	</p>
	<p class="address-search">
		You can also <span class="tab" style="background-color:transparent; padding:0; border: none;"
			>search by address</span
		>
		or city using the search bar. The map will then zoom in to the location, with a <MapPin
			strokeColor="#cc5f02"
		/> marker indicating the spot. To remove the marker, select the "X" in the search bar (which appears
		when you hover over, click or select the box) to clear it.
	</p>

	<h2>Add your outlet</h2>
	<p>
		If you have an outlet that is not part of the directory and fits the criteria, please <a
			href="https://directory-ccm.journalism.cuny.edu/join-our-directory/">fill out this form</a
		>.
	</p>
	<p>
		If you have any feedback, corrections or updates, please email us at <a
			href="mailto:ccm@journalism.cuny.edu">ccm@journalism.cuny.edu</a
		>.
	</p>
</section>

<section id="about-footer" aria-label="About the Advertising Boost Initiative">
	<p>
		The mission of the <strong
			><a
				href="https://www.journalism.cuny.edu/centers/center-community-media/"
				style="color: #0072a4;">Center for Community Media</a
			></strong
		> is to serve news organizations that provide essential local coverage for populations whose voices
		and issues are underrepresented in mainstream media. The Center serves as a hub of information, resources,
		and training aimed at increasing the sustainability of this news media sector.
	</p>
	<hr />
	<a
		href="https://www.journalism.cuny.edu/centers/center-community-media/advertising-boost-initiative/"
		><img src={ccmLogo} alt="Center for Community Media logo" width="250" height="auto" /></a
	>

	<a href="https://www.journalism.cuny.edu/"
		><img
			style="padding-top: 1rem;"
			src={newmarkJLogo}
			alt="Newmark J-School logo"
			width="310"
			height="auto"
			loading="lazy"
		/></a
	>
</section>

<style>
	#about-body {
		padding: 1rem;
	}

	p:not(:first-child) {
		margin-top: 12px;
	}

	#about-footer {
		padding: 1rem;
		background-color: rgba(var(--light-gray), 0.5);
		font-size: 0.85rem;
		border-top: 0.5px solid rgba(var(--gray), 0.5);
	}

	@media only screen and (max-device-width: 512px) {
		p.address-search {
			display: none;
		}
	}

	.callout {
		padding: 10px;
		font-size: 0.8rem;
		background-color: rgba(var(--light-blue-gray), 0.5);
	}
</style>
