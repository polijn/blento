<script lang="ts">
	import { Button, Input, Label, Modal, Subheading } from '@foxui/core';
	import type { CreationModalComponentProps } from '../types';
	import { onMount } from 'svelte';
	import { AtpBaseClient } from '@atproto/api';
	import { getDidContext } from '$lib/website/context';
	import { getImageBlobUrl } from '$lib/website/utils';

	let { item = $bindable(), oncreate, oncancel }: CreationModalComponentProps = $props();

	let did = getDidContext();

	let mediaList: { fullsize: string; isVideo?: boolean; playlist?: string }[] = $state([]);

	onMount(async () => {
		const agent = new AtpBaseClient({ service: 'https://api.bsky.app' });
		const authorFeed = await agent.app.bsky.feed.getAuthorFeed({
			actor: did,
			filter: 'posts_with_media',
			limit: 100
		});

		console.log(authorFeed);

		for (let post of authorFeed.data.feed) {
			for (let image of post.post.embed?.images ?? []) {
				mediaList.push(image);
			}

			if (post.post.embed.thumbnail && post.post.embed.playlist) {
				mediaList.push({
					...post.post.embed,
					isVideo: true
				});
			}
		}
	});

	let selected = $state();
</script>

<Modal
	bind:open={
		() => true,
		(change) => {
			if (!change) oncancel();
		}
	}
	closeButton={false}
	class="flex max-h-screen flex-col"
>
	<Subheading>Select an image or video</Subheading>

	<div
		class="bg-base-100 dark:bg-base-950 grid h-[50dvh] grow grid-cols-3 gap-4 overflow-y-scroll rounded-2xl p-4"
	>
		{#each mediaList as media}
			<button
				onclick={() => {
					console.log(media);
					selected = media;
					if (media.isVideo) {
						item.cardData = {
							video: media
						};
					} else item.cardData.image = media;
				}}
				class="relative cursor-pointer"
			>
				<img
					src={media.fullsize ?? media.thumbnail}
					alt=""
					class={[
						'h-24 w-full rounded-xl object-cover',
						selected === media
							? 'outline-accent-500 opacity-100 outline-2 -outline-offset-2'
							: 'opacity-80'
					]}
				/>
				{#if media.isVideo}
					<div class="absolute inset-0 inline-flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="text-accent-500 size-6"
						>
							<path
								fill-rule="evenodd"
								d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				{/if}
			</button>
		{/each}
		{#if mediaList.length === 0}
			<span class="col-span-3 p-4 text-lg italic">Loading your media...</span>{/if}
	</div>

	<Label class="mt-4">Link (optional):</Label>
	<Input bind:value={item.cardData.href} />

	<div class="mt-4 flex justify-end gap-2">
		<Button
			onclick={() => {
				oncancel();
			}}
			variant="ghost">Cancel</Button
		>
		<Button
			disabled={!selected}
			onclick={async () => {
				oncreate();
			}}>Create</Button
		>
	</div>
</Modal>
