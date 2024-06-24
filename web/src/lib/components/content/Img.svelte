<script lang="ts">
	import { Image, type ImageSrc } from 'svelte-remote-image';
	export let src: string;
	export let pathname: string;

	// PoC
	// TODO: set from config
	const optimazerPrefix = 'https://nostr-image-optimizer.ocknamo.com/image/';

	let imageSrc: ImageSrc = {
		w: 500,
		img: `${optimazerPrefix}width=1600,quality=80,format=webp/${src}`,
		webp: [
			{ src: `${optimazerPrefix}width=1000,quality=70,format=webp/${src}`, w: 1000 },
			{ src: `${optimazerPrefix}width=500,quality=50,format=webp/${src}`, w: 500 }
		],
		jpeg: [
			{ src: `${optimazerPrefix}width=1000,quality=70,format=jpeg/${src}`, w: 1000 },
			{ src: `${optimazerPrefix}width=500,quality=50,format=jpeg/${src}`, w: 500 }
		],
		failback: src,
		alt: src,
		placeholder: { dataUri: undefined, color: '#c5c5c5' },
		blur: true
	};
</script>

{#if /\.(avif|jpg|jpeg|png|webp)$/i.test(pathname)}
	<Image src={imageSrc} style="max-width: 100%;max-height: 100%;" />
{:else if /\.(apng|gif|bmp)$/i.test(pathname)}
	<img {src} alt={src} />
{/if}

<style>
	img {
		width: 100%;
		max-height: 260px;
		object-fit: cover;
	}
</style>
