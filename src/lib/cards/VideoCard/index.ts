import { uploadBlob } from '$lib/atproto';
import type { CardDefinition } from '../types';
import VideoCard from './VideoCard.svelte';
import VideoCardSettings from './VideoCardSettings.svelte';

async function getAspectRatio(videoBlob: Blob): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const video = document.createElement('video');
		video.preload = 'metadata';

		video.onloadedmetadata = () => {
			URL.revokeObjectURL(video.src);
			resolve({
				width: video.videoWidth,
				height: video.videoHeight
			});
		};

		video.onerror = () => {
			URL.revokeObjectURL(video.src);
			reject(new Error('Failed to load video metadata'));
		};

		video.src = URL.createObjectURL(videoBlob);
	});
}

export const VideoCardDefinition = {
	type: 'video',
	contentComponent: VideoCard,
	createNew: (card) => {
		card.cardType = 'video';
		card.cardData = {
			video: null,
			href: ''
		};
	},
	upload: async (item) => {
		if (item.cardData.blob) {
			const blob = item.cardData.blob;
			const aspectRatio = await getAspectRatio(blob);
			const uploadedBlob = await uploadBlob({ blob });

			item.cardData.video = {
				$type: 'app.bsky.embed.video',
				video: uploadedBlob,
				aspectRatio
			};

			delete item.cardData.blob;
		}

		if (item.cardData.objectUrl) {
			URL.revokeObjectURL(item.cardData.objectUrl);
			delete item.cardData.objectUrl;
		}

		return item;
	},
	settingsComponent: VideoCardSettings,

	name: 'Video',
	groups: ['Media'],
	icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>`
} as CardDefinition & { type: 'video' };
