<script lang="ts">
	import { onMount } from "svelte";

	onMount(async () => {
		const data = await fetch('/api/links?link=https://bento.me/flo-bit');
		const json = await data.json();
		console.log(json);
	})
</script>

<div class="flex h-screen items-center justify-center">
	<h1 class="text-7xl font-bold">blento</h1>
</div>
