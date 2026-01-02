<script lang="ts">
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '..';

	const {
		class: className,
		children,
		hasSidebar = false,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { hasSidebar?: boolean } = $props();
</script>

<div
	class={cn(
		'border-base-400/30 dark:border-base-300/10 fixed left-0 right-0 top-1 z-50 mx-1 flex h-16 items-center justify-between overflow-hidden rounded-2xl border p-2 shadow-2xl',
		hasSidebar ? 'lg:left-74' : '',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
