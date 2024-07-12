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
	export let size: string = 'm';

	const pictureSizeMap: Record<string, number> = {
		s: 40,
		m: 120,
		l: 320
	};

	const sizeNum = pictureSizeMap[size] ?? pictureSizeMap['m'];

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
				img: `${imageOptimazerUrl}width=${sizeNum},quality=60,format=webp/${src}`,
				webp: [
					{
						src: `${imageOptimazerUrl}width=${sizeNum},quality=60,format=webp/${src}`,
						w: sizeNum
					}
				],
				jpeg: [
					{
						src: `${imageOptimazerUrl}width=${sizeNum},quality=60,format=jpeg/${src}`,
						w: sizeNum
					}
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
