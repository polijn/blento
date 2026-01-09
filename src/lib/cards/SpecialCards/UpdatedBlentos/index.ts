import type { CardDefinition } from '../../types';
import UpdatedBlentosCard from './UpdatedBlentosCard.svelte';

export const UpdatedBlentosCardDefitition = {
	type: 'updatedBlentos',
	contentComponent: UpdatedBlentosCard,
	loadData: async () => {
		const response = await fetch(
			'https://ufos-api.microcosm.blue/records?collection=app.blento.card'
		);
		return await response.json();
	}
} as CardDefinition & { type: 'updatedBlentos' };
