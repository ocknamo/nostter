<script lang="ts">
	import { imageOptimazerUrl } from '$lib/Constants';
	import { robohash } from '$lib/Items';
	import { Image, type ImageSrc } from 'svelte-remote-image';
	export let src: string | undefined = undefined;
	export let pubkey: string;
	export let style = '';
	export let alt = '';
	export let title = '';

	$: imageSrc = !src
		? {
				img: robohash(pubkey),
				failback: [robohash(pubkey)]
		  }
		: ({
				img: `${imageOptimazerUrl}width=120,quality=60,format=webp/${src}`,
				webp: [
					{ src: `${imageOptimazerUrl}width=120,quality=60,format=webp/${src}`, w: 120 }
				],
				jpeg: [
					{ src: `${imageOptimazerUrl}width=120,quality=60,format=jpeg/${src}`, w: 120 }
				],
				failback: [src, robohash(pubkey)],
				blur: false
		  } as ImageSrc);
</script>

<Image src={imageSrc} {alt} {title} {style} />
