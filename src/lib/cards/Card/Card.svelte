<script lang="ts">
	import { CardDefinitionsByType } from '.';
	import BaseCard, { type BaseCardProps } from '../BaseCard/BaseCard.svelte';
	import ImageCard from '../ImageCard/ImageCard.svelte';
	import TextCard from '../TextCard/TextCard.svelte';

	let { item, ref = $bindable(null), ...rest }: BaseCardProps = $props();
</script>

{#if CardDefinitionsByType[item.cardType]}
	{@const cardDef = CardDefinitionsByType[item.cardType]}
	<cardDef.cardComponent {item} {ref} {...rest} />
{:else}
	<BaseCard {item} {...rest}>
		<div>Unsupported card type: {item.cardType}</div>
	</BaseCard>
{/if}
