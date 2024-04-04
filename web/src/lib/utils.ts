import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isEnvBrowser = !('GetParentResourceName' in window);

interface GameWindow {
	GetParentResourceName?: () => string;
}

const resourceName = (window as GameWindow).GetParentResourceName
	? (window as GameWindow).GetParentResourceName?.()
	: 'nui-resource';

export const noop = () => {};

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
