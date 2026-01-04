import { loadData } from '$lib/website/utils';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	if (env.ONLY_ALLOW_MAIN_HANDLE) error(404);
	return await loadData(params.handle);
}
