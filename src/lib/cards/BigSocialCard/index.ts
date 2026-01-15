import type { CardDefinition } from '../types';
import BigSocialCard from './BigSocialCard.svelte';
import CreateBigSocialCardModal from './CreateBigSocialCardModal.svelte';
import SidebarItemBigSocialCard from './SidebarItemBigSocialCard.svelte';

export const BigSocialCardDefinition = {
	type: 'bigsocial',
	contentComponent: BigSocialCard,
	creationModalComponent: CreateBigSocialCardModal,
	sidebarComponent: SidebarItemBigSocialCard,
	createNew: (card) => {
		card.cardType = 'bigsocial';
		card.cardData = {
			href: '',
			platform: ''
		};
		card.w = 2;
		card.h = 2;
		card.mobileW = 4;
		card.mobileH = 4;
	},
	allowSetColor: false,
	defaultColor: 'transparent',
	minW: 2,
	minH: 2,
	onUrlHandler: (url, item) => {
		const platform = detectPlatform(url);
		if (!platform) return null;

		item.cardData.platform = platform;
		item.cardData.color = platformsData[platform].hex;
		item.cardData.href = url;

		return item;
	}
} as CardDefinition & { type: 'bigsocial' };

export const platformPatterns: Record<string, RegExp> = {
	instagram: /(?:instagram\.com|instagr\.am)/i,
	facebook: /(?:facebook\.com|fb\.com|fb\.me)/i,
	twitter: /(?:twitter\.com)/i,
	x: /(?:x\.com)/i,
	youtube: /(?:youtube\.com|youtu\.be)/i,
	tiktok: /(?:tiktok\.com)/i,
	linkedin: /(?:linkedin\.com)/i,
	bluesky: /(?:bsky\.app|bsky\.social)/i,
	threads: /(?:threads\.net)/i,
	snapchat: /(?:snapchat\.com)/i,
	pinterest: /(?:pinterest\.com|pin\.it)/i,
	twitch: /(?:twitch\.tv)/i,
	discord: /(?:discord\.gg|discord\.com)/i,
	github: /(?:github\.com)/i,
	spotify: /(?:spotify\.com|open\.spotify\.com)/i,
	reddit: /(?:reddit\.com)/i,
	whatsapp: /(?:whatsapp\.com|wa\.me)/i,
	telegram: /(?:t\.me|telegram\.org)/i,
	mastodon: /(?:mastodon\.social|mastodon\.online|mstdn\.social)/i
};

import {
	siInstagram,
	siFacebook,
	siX,
	siYoutube,
	siTiktok,
	siBluesky,
	siThreads,
	siSnapchat,
	siPinterest,
	siTwitch,
	siDiscord,
	siGithub,
	siSpotify,
	siReddit,
	siWhatsapp,
	siTelegram,
	siMastodon,
	type SimpleIcon
} from 'simple-icons';

export const platformsData: Record<string, SimpleIcon> = {
	instagram: siInstagram,
	facebook: siFacebook,
	twitter: siX,
	x: siX,
	youtube: siYoutube,
	tiktok: siTiktok,
	bluesky: siBluesky,
	threads: siThreads,
	snapchat: siSnapchat,
	pinterest: siPinterest,
	twitch: siTwitch,
	discord: siDiscord,
	github: siGithub,
	spotify: siSpotify,
	reddit: siReddit,
	whatsapp: siWhatsapp,
	telegram: siTelegram,
	mastodon: siMastodon
};

export function detectPlatform(url: string): string | null {
	for (const [platform, pattern] of Object.entries(platformPatterns)) {
		if (pattern.test(url)) {
			return platform;
		}
	}
	return null;
}
