<script lang="ts">
	import { Image, type ImageSrc } from 'svelte-remote-image';
	export let src: string;

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

	let imageSrc: ImageSrc = {
		w: 48,
		img: `${optimazerPrefix}width=120,quality=80,format=webp/${src}`,
		webp: [
			{ src: `${optimazerPrefix}width=120,quality=70,format=webp/${src}`, w: 120 },
			{ src: `${optimazerPrefix}width=48,quality=50,format=webp/${src}`, w: 48 }
		],
		jpeg: [
			{ src: `${optimazerPrefix}width=120,quality=70,format=jpeg/${src}`, w: 120 },
			{ src: `${optimazerPrefix}width=48,quality=50,format=jpeg/${src}`, w: 48 }
		],
		failback: src,
		alt: 'users picture icon',
		blur: false
	};
</script>

<Image src={imageSrc} style={formatToHTMLStyleFromObject(imgStyleObj)} />
