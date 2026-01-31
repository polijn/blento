<script lang="ts">
	import { getAdditionalUserData, getDidContext, getHandleContext } from '$lib/website/context';
	import { onMount } from 'svelte';
	import { CardDefinitionsByType } from '..';
	import type { ContentComponentProps } from '../types';
	import BlogEntry from './BlogEntry.svelte';

	let { item }: ContentComponentProps = $props();

	const data = getAdditionalUserData();
	// svelte-ignore state_referenced_locally
	let feed = $state(data[item.cardType] as any);

	let did = getDidContext();
	let handle = getHandleContext();

	onMount(async () => {
		if (!feed) {
			feed = (await CardDefinitionsByType[item.cardType]?.loadData?.([item], {
				did,
				handle
			})) as any;

			data[item.cardType] = feed;
		}
	});
</script>

<div class="flex h-full flex-col gap-10 overflow-y-scroll p-8">
	{#if feed && feed.length > 0}
		{#each feed as document (document.uri)}
			<BlogEntry
				title={document.value.title}
				description={document.value.description}
				date={document.value.publishedAt}
				href={document.value.href}
			/>
		{/each}
	{:else if feed}
		<div
			class="text-base-500 dark:text-base-400 accent:text-white/60 flex h-full flex-col items-center justify-center gap-2 text-center text-sm"
		>
			<span>No blog posts found.</span>
			<span>
				Create some on <a
					href="https://leaflet.pub"
					target="_blank"
					rel="noopener noreferrer"
					class="underline">Leaflet</a
				>
				or
				<a href="https://pckt.pub" target="_blank" rel="noopener noreferrer" class="underline"
					>Pckt</a
				>
			</span>
		</div>
	{:else}
		<div
			class="text-base-500 dark:text-base-400 accent:text-white/60 flex h-full items-center justify-center text-center text-sm"
		>
			Loading blog posts...
		</div>
	{/if}
</div>
