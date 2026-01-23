import { getDetailedProfile } from '$lib/atproto';
import type { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import type { CardDefinition } from '../../types';
import UpdatedBlentosCard from './UpdatedBlentosCard.svelte';
import { AppBskyActorDefs } from '@atcute/bluesky';

export const UpdatedBlentosCardDefitition = {
	type: 'updatedBlentos',
	contentComponent: UpdatedBlentosCard,
	loadData: async (items, { cache }) => {
		try {
			const response = await fetch(
				'https://ufos-api.microcosm.blue/records?collection=app.blento.card'
			);
			const recentRecords = await response.json();
			const existingUsers = await cache?.get('updatedBlentos');
			const existingUsersArray: ProfileViewDetailed[] = existingUsers
				? JSON.parse(existingUsers)
				: [];

			const existingUsersSet = new Set(existingUsersArray.map((v) => v.did));

			const uniqueDids = new Set<string>();
			for (const record of recentRecords as { did: string }[]) {
				if (!existingUsersSet.has(record.did)) uniqueDids.add(record.did);
			}

			const profiles: Promise<AppBskyActorDefs.ProfileViewDetailed>[] = [];

			for (const did of Array.from(uniqueDids)) {
				const profile = getDetailedProfile({ did });
				profiles.push(profile);
				if (profiles.length > 20) break;
			}

			const result = [...(await Promise.all(profiles)), ...existingUsersArray];

			if (cache) {
				await cache?.put('updatedBlentos', JSON.stringify(result));
			}
			return JSON.parse(JSON.stringify(result));
		} catch (error) {
			console.error('error fetching updated blentos', error);
			return [];
		}
	}
} as CardDefinition & { type: 'updatedBlentos' };
