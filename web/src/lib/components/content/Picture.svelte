<script lang="ts">
	import { imageOptimazerUrl } from '$lib/Constants';
	import { robohash } from '$lib/Items';
	import { formatStyleFromObject } from '$lib/styles/FormatStyleFromObject';
	import { Image, type ImageSrc } from 'svelte-remote-image';
	export let src: string | undefined = undefined;
	export let pubkey: string;
	export let style = {};

	$: imageSrc = !src
		? {
				img: robohash(pubkey),
				failback: robohash(pubkey),
				alt: ''
		  }
		: ({
				img: `${imageOptimazerUrl}width=100,quality=50,format=webp/${src}`,
				webp: [
					{ src: `${imageOptimazerUrl}width=100,quality=50,format=webp/${src}`, w: 100 }
				],
				jpeg: [
					{ src: `${imageOptimazerUrl}width=100,quality=50,format=jpeg/${src}`, w: 100 }
				],
				failback: src,
				alt: '',
				blur: true,
				placeholder: {
					color: '#c5c5c5'
				}
		  } as ImageSrc);
</script>

<Image src={imageSrc} style={formatStyleFromObject(style)} />
