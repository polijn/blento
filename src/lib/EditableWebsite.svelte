<script lang="ts">
	import { setContext } from 'svelte';
	import { BlueskyLogin, Button, Navbar, toast, Toaster } from './website/foxui';
	import { client, login } from '$lib/oauth/auth.svelte.js';

	import { settingsModal } from './website/components/head/EditHead.svelte';
	import HeadItem from './website/components/head/HeadItem.svelte';
	import {
		setDataContext,
		setDidContext,
		setIsEditing,
		setUpdateFunctionsContext,
		type UpdateFunction
	} from './website/context';

	import { margin } from '$lib';
	import EditingImageCard from './cards/ImageCard/EditingImageCard.svelte';
	import { cardsEqual, clamp, fixCollisions, overlaps, sortItems } from './helper';
	import Profile from './Profile.svelte';
	import type { Item } from './types';
	import { deleteRecord, putRecord } from './oauth/atproto';
	import { innerWidth } from 'svelte/reactivity/window';
	import { TID } from '@atproto/common-web';

	let {
		handle,
		did,
		data,
		items: originalItems
	}: { handle: string; did: string; data: any; items: Item[] } = $props();

	// svelte-ignore state_referenced_locally
	let items: Item[] = $state(originalItems);

	let updateFunctions: UpdateFunction[] = $state([]);

	setIsEditing(true);
	// svelte-ignore state_referenced_locally
	setDidContext(data.did);
	setUpdateFunctionsContext(updateFunctions);
	// svelte-ignore state_referenced_locally
	setContext('current', data.current);
	// svelte-ignore state_referenced_locally
	setDataContext(data.data);

	let container: HTMLDivElement | undefined = $state();

	let activeDragElement: {
		element: HTMLDivElement | null;
		item: Item | null;
		w: number;
		h: number;
		x: number;
		y: number;
		mouseDeltaX: number;
		mouseDeltaY: number;
	} = $state({
		element: null,
		item: null,
		w: 0,
		h: 0,
		x: -1,
		y: -1,
		mouseDeltaX: 0,
		mouseDeltaY: 0
	});

	let isMobile = $derived((innerWidth.current ?? 1000) < 768);

	const getX = (item: Item) => (isMobile ? (item.mobileX ?? item.x) : item.x);
	const getY = (item: Item) => (isMobile ? (item.mobileY ?? item.y) : item.y);
	const getW = (item: Item) => (isMobile ? (item.mobileW ?? item.w) : item.w);
	const getH = (item: Item) => (isMobile ? (item.mobileH ?? item.h) : item.h);

	let maxHeight = $derived(items.reduce((max, item) => Math.max(max, getY(item) + getH(item)), 0));
	$inspect(maxHeight);
</script>

<Profile {handle} {did} />

<div class="md:grid md:grid-cols-3">
	<div></div>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={container}
		ondragover={(e) => {
			e.preventDefault();
			if (!container) return;

			const x = e.clientX + activeDragElement.mouseDeltaX;
			const y = e.clientY + activeDragElement.mouseDeltaY;
			const rect = container.getBoundingClientRect();

			let gridX = clamp(
				Math.floor(((x - rect.left) / rect.width) * 4),
				0,
				4 - (activeDragElement.w ?? 0)
			);
			let gridY = Math.max(Math.floor(((y - rect.top) / rect.width) * 4), 0);
			if (isMobile) {
				gridX = Math.floor(gridX / 2) * 2;
				gridY = Math.floor(gridY / 2) * 2;
			}

			activeDragElement.x = gridX;
			activeDragElement.y = gridY;
		}}
		ondragend={async (e) => {
			e.preventDefault();
			if (!container) return;

			const x = e.clientX + activeDragElement.mouseDeltaX;
			const y = e.clientY + activeDragElement.mouseDeltaY;
			const rect = container.getBoundingClientRect();

			let gridX = clamp(
				Math.floor(((x - rect.left) / rect.width) * 4),
				0,
				4 - (activeDragElement.w ?? 0)
			);
			let gridY = Math.max(Math.floor(((y - rect.top) / rect.width) * 4), 0);
			if (isMobile) {
				gridX = Math.floor(gridX / 2) * 2;
				gridY = Math.floor(gridY / 2) * 2;
			}

			if (activeDragElement.item) {
				if (isMobile) {
					activeDragElement.item.mobileX = gridX;
					activeDragElement.item.mobileY = gridY;
				} else {
					activeDragElement.item.x = gridX;
					activeDragElement.item.y = gridY;
				}

				fixCollisions(items, activeDragElement.item, isMobile);
			}
			activeDragElement.x = -1;
			activeDragElement.y = -1;
			activeDragElement.element = null;
			return true;
		}}
		class="relative col-span-2 p-8"
		style="container-type: inline-size;"
	>
		{#each items.toSorted(sortItems) as item}
			<EditingImageCard
				ondragstart={(e) => {
					const target = e.target as HTMLDivElement;
					activeDragElement.element = target;
					activeDragElement.w = item.w;
					activeDragElement.h = item.h;
					activeDragElement.item = item;

					const rect = target.getBoundingClientRect();
					activeDragElement.mouseDeltaX = rect.left + margin - e.clientX;
					activeDragElement.mouseDeltaY = rect.top - e.clientY;
				}}
				{item}
				ondelete={() => {
					items = items.filter((it) => it !== item);
				}}
				onsetsize={(newW: number, newH: number) => {
					if (isMobile) {
						item.mobileW = newW * 2;
						item.mobileH = newH * 2;
					} else {
						item.w = newW;
						item.h = newH;
					}

					fixCollisions(items, item, isMobile);
				}}
				onshowsettings={() => {
					toast('No settings available for this card yet.', {
						description: 'More settings will be added in the future.'
					});
				}}
			/>
		{/each}

		{#if activeDragElement.element && activeDragElement.x >= 0 && activeDragElement.item}
			{@const item = activeDragElement}
			<div
				class={['bg-base-500/10 absolute aspect-square rounded-2xl']}
				style={`translate: calc(${(item.x / 4) * 100}cqw + ${margin / 2}px) calc(${(item.y / 4) * 100}cqw + ${margin / 2}px); 
                
                width: calc(${(getW(activeDragElement.item) / 4) * 100}cqw - ${margin}px);
                height: calc(${(getH(activeDragElement.item) / 4) * 100}cqw - ${margin}px);`}
			></div>
		{/if}
		<div style="height: {((maxHeight + 1) / 4) * 100}cqw;"></div>
	</div>
</div>

<HeadItem collection="com.example.head" />

<Navbar
	class="dark:bg-base-900 bg-base-100 top-auto bottom-2 mx-4 mt-3 max-w-3xl rounded-full px-4 md:mx-auto"
>
	<div class="flex items-center gap-2">
		<Button
			size="iconLg"
			variant="ghost"
			class="backdrop-blur-none"
			onclick={() => (settingsModal.show = true)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
				/>
			</svg>
		</Button>
		<Button
			size="iconLg"
			variant="ghost"
			class="backdrop-blur-none"
			onclick={() => {
				let newItem: Item = {
					id: TID.nextStr(),
					x: 0,
					y: 0,
					w: 1,
					h: 1,
					mobileH: 2,
					mobileW: 2,
					mobileX: 0,
					mobileY: 0,
					cardType: 'image',
					cardData: {
						image: `https://picsum.photos/seed/1${crypto.randomUUID()}/800/800`,
						href: 'https://example.com',
						hrefText: 'Visit example page'
					}
				};

				let foundPosition = false;
				while (!foundPosition) {
					for (newItem.x = 0; newItem.x <= 4 - newItem.w; newItem.x++) {
						let collision = items.find((item) => overlaps(newItem, item));
						console.log('checking position', newItem.x, newItem.y, 'collision:', collision);
						if (!collision) {
							foundPosition = true;
							break;
						}
					}
					if (!foundPosition) newItem.y += 1;
				}

				let foundMobilePosition = false;
				while (!foundMobilePosition) {
					for (newItem.mobileX = 0; newItem.mobileX <= 4 - newItem.mobileW; newItem.mobileX += 1) {
						let collision = items.find((item) => overlaps(newItem, item, true));

						if (!collision) {
							foundMobilePosition = true;
							break;
						}
					}
					if (!foundMobilePosition) newItem.mobileY! += 2;
				}

				items = [...items, newItem];
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
			</svg>
		</Button>
	</div>
	<div class="flex items-center gap-2">
		{#if client.isInitializing}{:else if client.isLoggedIn}
			<Button
				onclick={async () => {
					// check if did is same
					if (client?.profile?.did !== data.did) {
						toast('Not authorized', {
							description: 'Please login with the correct account'
						});
						return;
					}

					for (const updateFunction of updateFunctions) {
						await updateFunction();
					}

					// find all cards that have been updated (where items differ from originalItems)
					for (let item of items) {
						const originalItem = originalItems.find((i) => cardsEqual(i, item));

						if (!originalItem) {
							console.log('updated or new item', item);
							await putRecord({ collection: 'com.example.bento', rkey: item.id, record: item });
						}
					}

					// delete items that are in originalItems but not in items
					for (let originalItem of originalItems) {
						const item = items.find((i) => i.id === originalItem.id);
						if (!item) {
							console.log('deleting item', originalItem);
							await deleteRecord({ collection: 'com.example.bento', rkey: originalItem.id, did });
						}
					}

					toast('Saved', {
						description: 'Your website has been saved!'
					});
				}}>Save</Button
			>
		{:else}
			<BlueskyLogin
				login={async (handle) => {
					await login(handle);
					return true;
				}}
			/>
		{/if}
	</div>
</Navbar>

<Toaster />
