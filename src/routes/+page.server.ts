import { loadData } from '$lib/website/load';
import { env } from '$env/dynamic/public';
import { redirect } from '@sveltejs/kit';

export async function load({ platform, url }) {
	const hostname = url.hostname;

	if (hostname === 'flo-bit.blento.app') {
		redirect(308, '/flo-bit.dev');
	}

	const data = await loadData(env.PUBLIC_HANDLE, platform);
	return { ...data, handle: env.PUBLIC_HANDLE };
}
