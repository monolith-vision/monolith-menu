/// <reference types="vite/client" />

interface NuiMessageData<T = unknown> {
	action: string;
	data: T;
}

type NuiHandlerSignature<T> = (data: T) => void;

type MenuComponentTypes =
	| 'placeholder'
	| 'button'
	| 'submenu'
	| 'slider'
	| 'list'
	| 'checkbox';

type MenuPositions =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'center-left'
	| 'center'
	| 'center-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right';

interface MenuComponent {
	id: string;
	type: MenuComponentTypes;
	label: string;
	description?: string;
	values?: string[];
	value?: number;
	step?: number;
	min?: number;
	max?: number;
	checked?: boolean;
}

interface Menu {
	__resource: string;
	id: string;
	title: string;
	position: MenuPositions;
	description?: string;
	banner?: string;
	components: MenuComponent[];
	transition?: string;
}

interface MenuComponentProps extends MenuComponent {
	selected?: boolean;
}
