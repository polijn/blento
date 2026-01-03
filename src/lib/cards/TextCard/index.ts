import type { CardDefinition } from '../types';
import EditingTextCard from './EditingTextCard.svelte';
import TextCard from './TextCard.svelte';

export const TextCardDefinition = {
	type: 'text',
	cardComponent: TextCard,
	editingCardComponent: EditingTextCard,
	createNew: (card) => {
		card.cardType = 'text';
		card.cardData = {
			text: ''
		};
	}
} as CardDefinition & { type: 'text' };
