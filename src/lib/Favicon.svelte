<script lang="ts">
	let { favicon }: { favicon: string | null } = $props();
</script>

<svelte:head>
	{#if favicon}
		<link rel="icon" href={favicon} />
	{/if}
</svelte:head>
