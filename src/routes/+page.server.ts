import { loadData } from '$lib/website/utils';
import { env } from '$env/dynamic/private';

export async function load() {
	const data = await loadData(env.MAIN_HANDLE);
	return { ...data, handle: env.MAIN_HANDLE };
}
