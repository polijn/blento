import type { Blob } from '@atcute/lexicons';
import type { AppBskyActorDefs } from '@atcute/bluesky';

export type Item = {
	id: string;

	w: number;
	h: number;
	x: number;
	y: number;

	mobileW: number;
	mobileH: number;
	mobileX: number;
	mobileY: number;

	cardType: string;

	color?: string;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	cardData: any;

	updatedAt?: string;

	version?: number;

	page?: string;
};

export type WebsiteData = {
	page: string;
	did: string;
	handle: string;

	cards: Item[];
	publication:
		| {
				url?: string;
				name?: string;
				description?: string;
				icon?: Blob;
				preferences?: {
					/**
					 * @deprecated
					 *
					 * use hideProfileSection instead
					 */
					hideProfile?: boolean;

					// use this instead
					hideProfileSection?: boolean;
				};
		  }
		| undefined;
	profile: AppBskyActorDefs.ProfileViewDetailed;

	additionalData: Record<string, unknown>;
	updatedAt: number;
	version?: number;
};

export type UserCache = {
	get: (key: string) => string;
	put: (key: string, value: string) => void;
};
