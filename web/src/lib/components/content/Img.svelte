<script lang="ts">
	import { imageOptimazerUrl } from '$lib/Constants';
	import { formatStyleFromObject } from '$lib/styles/FormatStyleFromObject';
	import { Image, type ImageSrc } from 'svelte-remote-image';
	export let src: string;
	export let pathname: string;

	const imgStyleObj = {
		'max-width': 'calc(100% - 1.5em)',
		'min-width': '50%',
		'max-height': '20em',
		margin: ' 0.5em',
		border: '1px solid lightgray',
		'border-radius': '5px',
		'vertical-align': 'middle'
	};

	let imageSrc: ImageSrc = {
		img: `${imageOptimazerUrl}width=1280,quality=80,format=webp/${src}`,
		webp: [
			{ src: `${imageOptimazerUrl}width=1280,quality=70,format=webp/${src}`, w: 1280 },
			{ src: `${imageOptimazerUrl}width=640,quality=50,format=webp/${src}`, w: 640 },
			{ src: `${imageOptimazerUrl}width=320,quality=50,format=webp/${src}`, w: 320 }
		],
		jpeg: [
			{ src: `${imageOptimazerUrl}width=1280,quality=70,format=jpeg/${src}`, w: 1280 },
			{ src: `${imageOptimazerUrl}width=640,quality=50,format=jpeg/${src}`, w: 640 },
			{ src: `${imageOptimazerUrl}width=320,quality=50,format=jpeg/${src}`, w: 320 }
		],
		failback: src,
		alt: src,
		blur: false
	};
</script>

{#if /\.(avif|jpg|jpeg|png|webp)$/i.test(pathname)}
	<Image src={imageSrc} style={formatStyleFromObject(imgStyleObj)} />
{:else if /\.(apng|gif|bmp)$/i.test(pathname)}
	<img style={formatStyleFromObject(imgStyleObj)} {src} alt={src} />
{/if}
