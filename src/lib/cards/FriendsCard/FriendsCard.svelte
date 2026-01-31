<script lang="ts">
	import { onMount } from 'svelte';
	import type { ContentComponentProps } from '../types';
	import { getAdditionalUserData, getCanEdit, getIsMobile } from '$lib/website/context';
	import { getBlentoOrBskyProfile } from '$lib/atproto/methods';
	import type { FriendsProfile } from '.';
	import type { Did } from '@atcute/lexicons';
	import { Avatar } from '@foxui/core';

	let { item }: ContentComponentProps = $props();

	const isMobile = getIsMobile();
	const canEdit = getCanEdit();
	const additionalData = getAdditionalUserData();

	let dids: string[] = $derived(item.cardData.friends ?? []);

	let serverProfiles: FriendsProfile[] = $derived(
		(additionalData[item.cardType] as FriendsProfile[]) ?? []
	);

	let clientProfiles: FriendsProfile[] = $state([]);

	let profiles = $derived.by(() => {
		if (serverProfiles.length > 0) {
			return dids
				.map((did) => serverProfiles.find((p) => p.did === did))
				.filter((p): p is FriendsProfile => !!p);
		}
		return dids
			.map((did) => clientProfiles.find((p) => p.did === did))
			.filter((p): p is FriendsProfile => !!p);
	});

	onMount(() => {
		if (serverProfiles.length === 0 && dids.length > 0) {
			loadProfiles();
		}
	});

	async function loadProfiles() {
		const results = await Promise.all(
			dids.map((did) => getBlentoOrBskyProfile({ did: did as Did }).catch(() => undefined))
		);
		clientProfiles = results.filter(
			(p): p is FriendsProfile => !!p && p.handle !== 'handle.invalid'
		);
	}

	// Reload when dids change in editing mode
	$effect(() => {
		if (canEdit() && dids.length > 0) {
			loadProfiles();
		}
	});

	let sizeClass = $derived.by(() => {
		const w = isMobile() ? item.mobileW / 2 : item.w;
		if (w < 3) return 'sm';
		if (w < 5) return 'md';
		return 'lg';
	});

	function getLink(profile: FriendsProfile): string {
		if (profile.hasBlento && profile.handle && profile.handle !== 'handle.invalid') {
			return `/${profile.handle}`;
		}
		if (profile.handle && profile.handle !== 'handle.invalid') {
			return `https://bsky.app/profile/${profile.handle}`;
		}
		return `https://bsky.app/profile/${profile.did}`;
	}
</script>

<div class="flex h-full w-full items-center justify-center overflow-hidden px-2">
	{#if dids.length === 0}
		{#if canEdit()}
			<span class="text-base-400 dark:text-base-500 accent:text-accent-300 text-sm">
				Add friends in settings
			</span>
		{/if}
	{:else}
		<div class="flex items-center justify-center">
			{#each visibleProfiles as profile, i (profile.did)}
				<a
					href={getLink(profile)}
					class="accent:ring-accent-500/30 relative rounded-full ring-2 ring-white transition-transform hover:z-10 hover:scale-110 dark:ring-neutral-900"
					class:-ml-3={i > 0 && sizeClass === 'sm'}
					class:-ml-5={i > 0 && sizeClass === 'md'}
					class:-ml-6={i > 0 && sizeClass === 'lg'}
				>
					<Avatar
						src={profile.avatar}
						alt={profile.handle}
						class={sizeClass === 'sm' ? 'size-12' : sizeClass === 'md' ? 'size-16' : 'size-20'}
					/>
				</a>
			{/each}
			{#if overflowCount > 0}
				<div
					class="bg-base-200 dark:bg-base-700 accent:bg-accent-400/30 accent:ring-accent-500/30 relative flex items-center justify-center rounded-full ring-2 ring-white dark:ring-neutral-900"
					class:-ml-3={sizeClass === 'sm'}
					class:-ml-5={sizeClass === 'md'}
					class:-ml-6={sizeClass === 'lg'}
					class:size-12={sizeClass === 'sm'}
					class:size-16={sizeClass === 'md'}
					class:size-20={sizeClass === 'lg'}
				>
					<span
						class="text-base-600 dark:text-base-300 accent:text-accent-200 font-semibold"
						class:text-sm={sizeClass === 'sm'}
						class:text-base={sizeClass === 'md' || sizeClass === 'lg'}
					>
						+{overflowCount}
					</span>
				</div>
			{/if}
		</div>
	{/if}
</div>
