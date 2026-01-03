import type { CardDefinition } from '../types';
import EditingLinkCard from './EditingLinkCard.svelte';
import LinkCard from './LinkCard.svelte';

export const LinkCardDefinition = {
	type: 'link',
	cardComponent: LinkCard,
	editingCardComponent: EditingLinkCard,
	createNew: (card) => {
		card.cardType = 'link';
		card.cardData = {
			src: '',
			alt: '',
			href: ''
		};
	}
} as CardDefinition & { type: 'link' };
