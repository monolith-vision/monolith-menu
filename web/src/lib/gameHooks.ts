import { MutableRefObject, useEffect, useRef } from 'react';
import { noop } from './constants';

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