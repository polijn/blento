import { json } from '@sveltejs/kit';
import { getLinkPreview } from 'link-preview-js';

export async function GET({ url }) {
	const link = url.searchParams.get('link');
	if (!link) {
		return json({ error: 'No link provided' }, { status: 400 });
	}

	try {
		const data = await getLinkPreview(link);
		return json(data);
	} catch (error) {
		console.error('Error fetching link preview:', error);
		return json({ error: 'Failed to fetch link preview' }, { status: 500 });
	}
}
