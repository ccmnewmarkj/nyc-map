<script>
	export let data;
	export let filter;

	// Add column names to data (if Format filter):
	$: dataFormatted = Object.entries(data)
		.map(([key, value]) => ({ [filter]: key, Count: value }))
		// Sort by count in descending order:
		.sort((a, b) => b.Count - a.Count);
</script>

<!-- Populate table with data -->
<table>
	<thead>
		<tr>
			<th></th>
			<th>{filter}</th>
			<th style="width: 85px;"># of Outlets</th>
		</tr>
	</thead>
	<tbody>
		{#each filter === 'Format' ? dataFormatted : data
					.map(({ name, value }) => ({ [filter]: name, Count: value }))
					.sort((a, b) => b.Count - a.Count) as row, index}
			<tr>
				<td>{index + 1}</td>
				<td>{row[filter]}</td>
				<td>{row.Count}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		border-collapse: collapse;
		width: 100%;
	}

	/* Header row */
	thead {
		text-align: left;
		font-family: 'Roboto Condensed', sans-serif;
		text-transform: uppercase;
		border-bottom: 1px solid rgba(var(--black), 1);
		font-size: 0.8rem;
	}

	/* Align text in last column to the right */
	th:last-child,
	td:last-child {
		text-align: right;
	}

	/* Add light gray line in between rows */
	tr:not(:last-child) {
		border-bottom: 1px solid rgba(var(--light-gray), 1);
	}

	/* Add gray line to bottom of table */
	/* tbody > tr:last-child {
		border-bottom: 1px solid rgba(var(--gray), 0.5);
	} */

	/* Format row # column */
	tbody > tr > td:first-child {
		color: rgba(var(--gray), 0.75);
		font-family: 'Roboto Condensed', sans-serif;
		padding-right: 0;
	}

	/* Make count values bold */
	tbody > tr > td:last-child {
		font-family: 'Roboto Condensed', sans-serif;
		font-weight: 600;
	}

	/* Add padding to table "cells" */
	th,
	td {
		padding: 3px 5px;
	}

	/* Add stripes to every other table row */
	tbody > tr:nth-child(even) {
		background-color: rgba(var(--light-gray), 0.5);
	}

	/* Add rounded corners to top of header row */
	/* thead th:first-child {
		border-top-left-radius: 5px;
	}

	thead th:last-child {
		border-top-right-radius: 5px;
	} */
</style>
