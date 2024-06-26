<script lang="ts">
	import { robohash } from '$lib/Items';
	import { Image, type ImageSrc } from 'svelte-remote-image';
	export let src: string | undefined = undefined;
	export let pubkey: string;

	const imgStyleObj = {
		width: '48px',
		height: '48px',
		'border-radius': '50%',
		'margin-right': '12px',
		'object-fit': 'cover'
	};

	// TODO: DRY
	const formatToHTMLStyleFromObject = (styleObj: Record<string, string>) => {
		return Object.entries(styleObj).reduce(
			(acc, [key, value]) => `${acc} ${key}: ${value};`,
			''
		);
	};

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
					{ src: `${optimazerPrefix}width=120,quality=70,format=webp/${src}`, w: 120 }
				],
				jpeg: [
					{ src: `${optimazerPrefix}width=120,quality=70,format=jpeg/${src}`, w: 120 }
				],
				failback: src,
				alt: 'user icon',
				blur: true
		  } as ImageSrc);
</script>

<Image src={imageSrc} style={formatToHTMLStyleFromObject(imgStyleObj)} />
