<script lang="ts">
	import { getAdditionalUserData } from '$lib/helper';
	import type { Item } from '$lib/types';
	import { BlueskyPost } from '../../components/bluesky-post';

	let { item }: { item: Item } = $props();

	const data = getAdditionalUserData();
	// svelte-ignore state_referenced_locally
	const feed = (data[item.cardType] as any).feed;

	$inspect(feed);
</script>

<div class="flex h-full flex-col justify-center-safe overflow-y-scroll p-4">
	{#if feed?.[0].post}
		<BlueskyPost showLogo feedViewPost={feed?.[0].post}></BlueskyPost>
		<div class="h-4 w-full"></div>
	{:else}
		Your latest bluesky post will appear here.
	{/if}
</div>
