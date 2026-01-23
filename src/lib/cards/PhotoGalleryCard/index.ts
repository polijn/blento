import type { CardDefinition } from '../types';
import { getRecord, listRecords, parseUri } from '$lib/atproto';
import PhotoGalleryCard from './PhotoGalleryCard.svelte';

export const PhotoGalleryCardDefinition = {
	type: 'photoGallery',
	contentComponent: PhotoGalleryCard,
	createNew: (card) => {
		// random grain.social url for testing
		card.cardData.galleryUri =
			'at://did:plc:tas6hj2xjrqben5653v5kohk/social.grain.gallery/3mclhsljs6h2w';

		card.w = 4;
		card.mobileW = 8;
		card.h = 3;
		card.mobileH = 6;
	},
	loadData: async (items) => {
		const itemsData: Record<string, unknown[]> = {};

		const galleryItems: Record<string, unknown[] | undefined> = {
			'social.grain.gallery.item': undefined
		};

		for (const item of items) {
			if (!item.cardData.galleryUri) continue;

			const { did, collection } = parseUri(item.cardData.galleryUri);

			if (collection === 'social.grain.gallery') {
				const itemCollection = 'social.grain.gallery.item';

				if (!galleryItems[itemCollection]) {
					galleryItems[itemCollection] = await listRecords({
						did,
						collection: itemCollection
					});
				}

				const images = galleryItems['social.grain.gallery.item']
					?.filter((i) => i.value.gallery === item.cardData.galleryUri)
					.map(async (i) => {
						const itemData = parseUri(i.value.item as string);
						const record = await getRecord(itemData);
						return { ...record, value: { ...record.value, ...i.value } };
					});

				itemsData[item.cardData.galleryUri] = await Promise.all(images);
			}
		}

		return itemsData;
	},
	minW: 4
	//sidebarButtonText: 'Photo Gallery'
} as CardDefinition & { type: 'photoGallery' };
