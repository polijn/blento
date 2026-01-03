<script lang="ts">
	import BaseEditingCard, { type BaseEditingCardProps } from '../BaseCard/BaseEditingCard.svelte';

	let { item = $bindable(), ...rest }: BaseEditingCardProps = $props();
</script>

<BaseEditingCard {item} {...rest}>
	{#key item.cardData.image}
		<img
			class={[
				'absolute inset-0 h-full w-full object-cover opacity-100 transition-transform duration-300 ease-in-out',
				item.cardData.href ? 'group-hover:scale-105' : ''
			]}
			src={item.cardData.image}
			alt=""
		/>
	{/key}
	{#if item.cardData.href}
		<a
			href={item.cardData.href}
			class="absolute inset-0 h-full w-full"
			target="_blank"
			rel="noopener noreferrer"
		>
			<span class="sr-only">
				{item.cardData.hrefText ?? 'Learn more'}
			</span>
		</a>
	{/if}
</BaseEditingCard>
