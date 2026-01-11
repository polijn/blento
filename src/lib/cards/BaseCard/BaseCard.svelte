<script lang="ts">
	import { margin, mobileMargin } from '$lib';
	import type { Item } from '$lib/types';
	import type { WithElementRef } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	const colors = {
		base: 'border-base-200 shadow-lg dark:shadow-none inset-shadow-sm inset-shadow-base-500/10 shadow-base-900/5 bg-base-50 dark:border-base-800 dark:bg-base-900 border',
		accent: 'border-accent-200 shadow-lg inset-shadow-sm inset-shadow-accent-500/10 shadow-accent-900/10 bg-accent-50 dark:border-accent-900/50 dark:bg-accent-950/20 border',
		transparent: ''
	} as Record<string, string>;

	export type BaseCardProps = {
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
	}: BaseCardProps = $props();
</script>

<div
	id={item.id}
	data-flip-id={item.id}
	bind:this={ref}
	draggable={isEditing}
	class={[
		'card group transition-transform duration-200 focus-within:outline-accent-500 @container/card absolute z-0 rounded-2xl outline-offset-2 focus-within:outline-2',
		item.color ? (colors[item.color] ?? colors.accent) : colors.base,
		item.color !== 'accent' && item.color !== 'base' && item.color !== 'transparent'
			? item.color
			: ''
	]}
	style={`
    --mx: ${item.mobileX * 2};
    --my: ${item.mobileY * 2};
    --mw: ${item.mobileW * 2};
    --mh: ${item.mobileH * 2};
    --mm: ${mobileMargin}px;

    --dx: ${item.x * 2};
    --dy: ${item.y * 2};
    --dw: ${item.w * 2};
    --dh: ${item.h * 2};
    --dm: ${margin}px;`}
	{...rest}
>
	<div class="relative h-full w-full overflow-hidden rounded-[15px]">
		{@render children?.()}
	</div>
	{@render controls?.()}
</div>

<style>
	.card {
		translate: calc((var(--mx) / 8) * 100cqw + var(--mm)) calc((var(--my) / 8) * 100cqw + var(--mm));
		width: calc((var(--mw) / 8) * 100cqw - (var(--mm) * 2));
		height: calc((var(--mh) / 8) * 100cqw - (var(--mm) * 2));
	}

	@container grid (width >= 42rem) {
		.card {
			translate: calc((var(--dx) / 8) * 100cqw + var(--dm))
				calc((var(--dy) / 8) * 100cqw + var(--dm));
			width: calc((var(--dw) / 8) * 100cqw - (var(--dm) * 2));
			height: calc((var(--dh) / 8) * 100cqw - (var(--dm) * 2));
		}
	}
</style>
