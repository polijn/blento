<script lang="ts">
	import { onMount } from 'svelte';
	import Hls from 'hls.js';

	const {
		video
	}: {
		video: {
			playlist: string;
			thumbnail: string;
			alt: string;
		};
	} = $props();

	onMount(async () => {
		if (Hls.isSupported()) {
			var hls = new Hls();
			hls.loadSource(video.playlist);
			hls.attachMedia(element);
		}

		element.play();
	});

	let element: HTMLMediaElement;
</script>

<img src={video.thumbnail} class="absolute inset-0 -z-10 h-full w-full object-cover" alt="" />
<!-- svelte-ignore a11y_media_has_caption -->
<video
	bind:this={element}
	muted
	loop
	autoplay
	class="absolute inset-0 h-full w-full object-cover"
	aria-label={video.alt}
></video>
