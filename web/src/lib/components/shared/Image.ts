export interface Srcset {
	src: string;
	w: number;
}

export interface ImageSrc {
	img: string;
	srcsets?: Srcset[];
	w?: number;
	h?: number;
	fallback?: string[];
}
