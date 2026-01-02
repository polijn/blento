<script lang="ts">
	import ImageCard from './cards/ImageCard/ImageCard.svelte';
	import { sortItems } from './helper';
	import Profile from './Profile.svelte';
	import type { Item } from './types';

	let { handle, did, items }: { handle: string; did: string, items: Item[] } = $props();

	let maxHeight = $derived(items.reduce((max, item) => Math.max(max, item.y + item.h), 0));

	let container: HTMLDivElement | undefined = $state();
</script>

<Profile {handle} {did} />

<div class="md:grid md:grid-cols-3">
	<div></div>
	<div
		bind:this={container}
		class="relative col-span-2 p-8"
		style="container-type: inline-size;"
	>
		{#each items.toSorted(sortItems) as item}
			<ImageCard
				{item}
			/>
		{/each}
		<div style="height: {((maxHeight) / 4) * 100}cqw;"></div>
	</div>
</div>
