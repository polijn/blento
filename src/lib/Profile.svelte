<script lang="ts">
	import Favicon from './Favicon.svelte';
	import { MarkdownText, SingleRecord } from './website/components';

	let { handle, did }: { handle: string; did: string } = $props();
</script>

<div class="mx-auto flex max-w-2xl px-10 lg:px-12 pt-16 lg:pt-24 pb-8 lg:fixed lg:h-screen lg:w-1/4 xl:w-1/3 lg:max-w-none">
	<div class="flex flex-col gap-4">
		<SingleRecord collection="app.bsky.actor.profile" rkey="self">
			{#snippet child(data)}
				<Favicon
					favicon={'https://cdn.bsky.app/img/avatar/plain/' +
						did +
						'/' +
						data.value.avatar.ref.$link}
				/>
				<img
					class="rounded-fulll size-32 lg:size-44 rounded-full"
					src={'https://cdn.bsky.app/img/avatar/plain/' + did + '/' + data.value.avatar.ref.$link}
					alt=""
				/>
				<div class="line-clamp-2 text-4xl font-bold wrap-anywhere">{handle}</div>

				<div
					class="text-base-600 dark:text-base-400 prose dark:prose-invert prose-a:text-accent-500 prose-a:no-underline line-clamp-3"
				>
					<MarkdownText key="description" {data} />
				</div>
			{/snippet}
		</SingleRecord>
	</div>
</div>
