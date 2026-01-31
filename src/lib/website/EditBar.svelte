<script lang="ts">
	import { dev } from '$app/environment';
	import { user } from '$lib/atproto';
	import type { WebsiteData } from '$lib/types';
	import { Button, Navbar, Toggle, toast } from '@foxui/core';

	let {
		data,

		showingMobileView = $bindable(),
		isSaving = $bindable(),
		hasUnsavedChanges,

		save,

		showCardCommand
	}: {
		data: WebsiteData;

		showingMobileView: boolean;

		isSaving: boolean;
		hasUnsavedChanges: boolean;

		save: () => Promise<void>;

		showCardCommand: () => void;
	} = $props();

	function getShareUrl() {
		const base = typeof window !== 'undefined' ? window.location.origin : '';
		const pagePath =
			data.page && data.page !== 'blento.self' ? `/${data.page.replace('blento.', '')}` : '';
		return `${base}/${data.handle}${pagePath}`;
	}

	async function copyShareLink() {
		const url = getShareUrl();
		await navigator.clipboard.writeText(url);
		toast.success('Link copied to clipboard!');
	}
</script>

{#if dev || (user.isLoggedIn && user.profile?.did === data.did)}
	<Navbar
		class={[
			'dark:bg-base-900 bg-base-100 top-auto bottom-2 mx-4 mt-3 max-w-3xl rounded-full px-4 md:mx-auto lg:inline-flex',
			!dev ? 'hidden' : ''
		]}
	>
		<div class="flex items-center gap-2">
			<Button size="iconLg" variant="ghost" class="backdrop-blur-none" onclick={showCardCommand}>
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
			<Toggle
				class="hidden bg-transparent backdrop-blur-none lg:block dark:bg-transparent"
				bind:pressed={showingMobileView}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
					/>
				</svg>
			</Toggle>
			{#if hasUnsavedChanges}
				<Button
					disabled={isSaving}
					onclick={async () => {
						save();
					}}>{isSaving ? 'Saving...' : 'Save'}</Button
				>
			{:else}
				<Button onclick={copyShareLink}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
						/>
					</svg>
					Share
				</Button>
			{/if}
		</div>
	</Navbar>
{/if}
