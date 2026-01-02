<script lang="ts">
	import { page } from '$app/state';
	import { type Item } from '$lib/types.js';
	import Website from '$lib/Website.svelte';
	import WebsiteWrapper from '$lib/website/WebsiteWrapper.svelte';

	let { data } = $props();
</script>

<WebsiteWrapper {data} handle={page.params.handle}>
	<Website
		handle={page.params.handle}
		did={data.did}
		items={Object.values(data.data['com.example.bento']).map((i) => i.value) as Item[]}
	/>
</WebsiteWrapper>
