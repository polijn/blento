<script lang="ts">
	import type { Item } from '$lib/types';
	import BaseEditingCard, { type BaseEditingCardProps } from '../BaseCard/BaseEditingCard.svelte';
	import MarkdownTextEditor from './MarkdownTextEditor.svelte';

	let { item = $bindable<Item>(), ...rest }: BaseEditingCardProps = $props();
</script>

<BaseEditingCard {item} {...rest}>
	<div
		class="prose dark:prose-invert prose-base prose-a:no-underline prose-a:text-accent-600 dark:prose-a:text-accent-400 prose-sm hover:bg-base-500/20 prose-p:first:mt-0 prose-p:last:mb-0 m-1 rounded-md p-1"
	>
		<MarkdownTextEditor bind:item />
	</div>
</BaseEditingCard>
