<script lang="ts">
	import { imageOptimazerUrl } from '$lib/Constants';
	import { newUrl } from '$lib/Helper';
	import { robohash } from '$lib/Items';
	import { Image, type ImageSrc } from 'svelte-remote-image';
	export let src: string | undefined = undefined;
	export let pubkey: string;
	export let style = '';
	export let alt = '';
	export let title = '';

	$: imageSrc = getImageSrc(src);

	function getImageSrc(src: string | undefined): ImageSrc {
		const url = src ? newUrl(src) : undefined;

		if (!url) {
			return {
				img: robohash(pubkey),
				failback: [robohash(pubkey)]
			} as ImageSrc;
		} else if (/\.(avif|jpg|jpeg|png|webp)$/i.test(url.pathname)) {
			return {
				img: `${imageOptimazerUrl}width=120,quality=60,format=webp/${src}`,
				webp: [
					{ src: `${imageOptimazerUrl}width=120,quality=60,format=webp/${src}`, w: 120 }
				],
				jpeg: [
					{ src: `${imageOptimazerUrl}width=120,quality=60,format=jpeg/${src}`, w: 120 }
				],
				failback: [src, robohash(pubkey)],
				blur: false
			} as ImageSrc;
		} else {
			return {
				img: url.href,
				failback: [robohash(pubkey)]
			} as ImageSrc;
		}
	}
</script>

<Image src={imageSrc} {alt} {title} {style} />
