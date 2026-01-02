<script lang="ts">
	import { ThemeToggle } from '@foxui/core';

	import '../app.css';
	import { onMount } from 'svelte';
	import { initClient } from '$lib/oauth';
	import { gsap } from 'gsap';

	import { Flip } from 'gsap/Flip';

	gsap.registerPlugin(Flip);

	let { children } = $props();

	onMount(() => {
		initClient();
	});
</script>


{@render children()}

<ThemeToggle class="fixed top-2 left-2 z-10" />
