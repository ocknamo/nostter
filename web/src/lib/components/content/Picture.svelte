<script lang="ts">
	import { robohash } from '$lib/Items';
	import { formatStyleFromObject } from '$lib/styles/FormatStyleFromObject';
	import { Image, type ImageSrc } from 'svelte-remote-image';
	export let src: string | undefined = undefined;
	export let pubkey: string;
	export let style = {};

	// PoC
	// TODO: set from config
	const optimazerPrefix = 'https://nostr-image-optimizer.ocknamo.com/image/';

	$: imageSrc = !src
		? {
				img: robohash(pubkey),
				failback: robohash(pubkey),
				alt: ''
		  }
		: ({
				img: `${optimazerPrefix}width=120,quality=70,format=webp/${src}`,
				webp: [
					{ src: `${optimazerPrefix}width=32,quality=50,format=webp/${src}`, w: 32 },
					{ src: `${optimazerPrefix}width=64,quality=70,format=webp/${src}`, w: 64 },
					{ src: `${optimazerPrefix}width=120,quality=70,format=webp/${src}`, w: 120 }
				],
				jpeg: [
					{ src: `${optimazerPrefix}width=32,quality=50,format=webp/${src}`, w: 32 },
					{ src: `${optimazerPrefix}width=64,quality=70,format=webp/${src}`, w: 64 },
					{ src: `${optimazerPrefix}width=120,quality=70,format=jpeg/${src}`, w: 120 }
				],
				failback: src,
				alt: '',
				blur: true
		  } as ImageSrc);
</script>

<Image src={imageSrc} style={formatStyleFromObject(style)} />
