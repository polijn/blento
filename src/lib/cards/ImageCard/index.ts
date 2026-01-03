import type { CardDefinition } from '../types';
import EditingImageCard from './EditingImageCard.svelte';
import ImageCard from './ImageCard.svelte';

export const ImageCardDefinition = {
	type: 'image',
	cardComponent: ImageCard,
	editingCardComponent: EditingImageCard,
	createNew: (card) => {
		card.cardType = 'image';
		card.cardData = {
			src: '',
			alt: '',
			href: ''
		};
	}
} as CardDefinition & { type: 'image' };
