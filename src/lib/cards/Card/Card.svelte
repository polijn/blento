<script lang="ts">
	import { margin } from '$lib';
	import type { Item } from '$lib/types';
	import type { WithElementRef } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { innerWidth } from 'svelte/reactivity/window';

	export type CardProps = {
		item: Item;
		controls?: Snippet<[]>;
		isEditing?: boolean;
	} & WithElementRef<HTMLAttributes<HTMLDivElement>>;

	let {
		item,
		children,
		ref = $bindable(null),
		isEditing = false,
		controls,
		...rest
	}: CardProps = $props();

	let isMobile = $derived((innerWidth.current ?? 1000) < 768);

	const getX = () => (isMobile ? (item.mobileX ?? item.x) : item.x);
	const getY = () => (isMobile ? (item.mobileY ?? item.y) : item.y);
	const getW = () => (isMobile ? (item.mobileW ?? item.w) : item.w);
	const getH = () => (isMobile ? (item.mobileH ?? item.h) : item.h);
</script>

<div
	id={item.id}
	data-flip-id={item.id}
	bind:this={ref}
	draggable={isEditing}
	class={[
		'card border-base-200 bg-base-50 group dark:border-base-800 dark:bg-base-900 focus-within:outline-accent-500 absolute z-0 rounded-2xl border outline-offset-2 focus-within:outline-2'
	]}
	style={`translate: calc(${(getX() / 4) * 100}cqw + ${margin}px) calc(${(getY() / 4) * 100}cqw + ${margin}px); 
                width: calc(${(getW() / 4) * 100}cqw - ${margin * 2}px);
                height: calc(${(getH() / 4) * 100}cqw - ${margin * 2}px);`}
	{...rest}
>
	<div class="relative h-full w-full overflow-hidden rounded-[15px]">
		{@render children?.()}
	</div>
	{@render controls?.()}
</div>
