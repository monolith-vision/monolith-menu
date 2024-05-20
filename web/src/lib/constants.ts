export const isEnvBrowser = !('GetParentResourceName' in window);

export const noop = () => {};

export const resourceName = (window as GameWindow).GetParentResourceName
	? (window as GameWindow).GetParentResourceName?.()
	: 'nui-resource';
