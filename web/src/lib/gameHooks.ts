import { MutableRefObject, useEffect, useRef } from 'react';
import { noop } from './utils';

export const useNuiEvent = <T = unknown>(
	action: string,
	handler: (data: T) => void,
) => {
	const savedHandler: MutableRefObject<NuiHandlerSignature<T>> = useRef(noop);

	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		const eventListener = (event: MessageEvent) => {
			if (savedHandler.current) {
				if (event.data.action === action) {
					savedHandler.current(event.data.data as T);
				}
			}
		};

		window.addEventListener('message', eventListener);
		return () => window.removeEventListener('message', eventListener);
	}, [action]);
};

export const useKeyEvent = (
	key: string | string[],
	handler: (data: KeyboardEvent) => void,
) => {
	const savedHandler: MutableRefObject<(e: KeyboardEvent) => unknown> =
		useRef(noop);

	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		const keyListener = (event: KeyboardEvent) => {
			if (savedHandler.current) {
				if (event.key === key || key.includes(event.key))
					savedHandler.current(event);
			}
		};

		window.addEventListener('keydown', keyListener);
		return () => window.removeEventListener('keydown', keyListener);
	}, [key]);
};
