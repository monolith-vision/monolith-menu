import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isEnvBrowser, resourceName } from './constants';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function fetchNui<T = unknown>(
	event: string,
	data?: unknown,
	mockData?: T,
): Promise<void | T> {
	if (isEnvBrowser) {
		if (mockData) return mockData;
		return;
	}

	const resp = await fetch(`https://${resourceName}/${event}`, {
		method: 'POST',
		body: JSON.stringify(data),
	});

	return await resp.json();
}

const urlRegex = new RegExp(
	'^(https?:\\/\\/)?' + // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
		'(\\#[-a-z\\d_]*)?$',
	'i',
);

// https://web.archive.org/web/20110806041156/http://forums.devshed.com/javascript-development-115/regexp-to-match-url-pattern-493764.html
export const isUrl = (str?: string) => str && urlRegex.test(str);

export function hexToRGB(hexCode: `#${string}`): {
	r: number;
	g: number;
	b: number;
} {
	let hex = hexCode.replace('#', '');

	if (hex.length === 3)
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];

	const r = parseInt(hex.substring(0, 2), 16),
		g = parseInt(hex.substring(2, 4), 16),
		b = parseInt(hex.substring(4, 6), 16);

	return { r, g, b };
}

export const debugData = <P>(events: DebugEvent<P>[], timer = 0) => {
	if (import.meta.env.MODE !== 'development' || !isEnvBrowser) return;

	for (const { action, data } of events)
		setTimeout(() => window.postMessage({ action, data }), timer);
};
