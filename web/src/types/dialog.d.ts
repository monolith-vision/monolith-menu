type DialogComponentTypes =
	| 'text'
	| 'number'
	| 'password'
	| 'color'
	| 'date'
	| 'checkbox'
	| 'textarea'
	| 'select';

type ColorArray = [number, number, number, number];

interface SelectValue {
	label?: string;
	value: string;
}

type DialogComponentValues = string | Date | number | boolean | ColorArray;
type DialogComponentDefaultValues = string | number | boolean | ColorArray;

interface DialogComponentBase {
	id: string;
	type: DialogComponentTypes;
	label: string;
	description?: string;
	placeholder?: string;
	valid?: boolean;
	values: SelectValue[];
	value?: DialogComponentValues;
	defaultValue?: DialogComponentDefaultValues;
	min?: number;
	max?: number;
	required?: boolean;
}

interface Dialog {
	__resource: string;
	id: string;
	title: string;
	description?: string;
	components: DialogComponent[];
	submitLabel?: string;
	cancelLabel?: string;
}

type DialogComponentKeys = keyof DialogComponentBase;

interface DialogTextComponent extends DialogComponentBase {
	type: 'text';
	value?: string;
	defaultValue?: string;
}

interface DialogPasswordComponent extends DialogTextComponent {
	type: 'password';
}

interface DialogTextareaComponent extends DialogTextComponent {
	type: 'textarea';
}

interface DialogNumberComponent extends DialogComponentBase {
	type: 'number';
	value?: number;
	defaultValue?: number;
}

interface DialogColorComponent extends DialogComponentBase {
	type: 'color';
	value?: ColorArray;
	defaultValue?: ColorArray;
}

interface DialogDateComponent extends DialogComponentBase {
	type: 'date';
	value?: Date;
	defaultValue?: number;
}

interface DialogCheckboxComponent extends DialogComponentBase {
	type: 'checkbox';
	value?: boolean;
	defaultValue?: boolean;
}

interface DialogSelectComponent extends DialogComponentBase {
	type: 'select';
	value?: string;
	defaultValue?: string;
}

type DialogComponent =
	| DialogTextComponent
	| DialogTextareaComponent
	| DialogPasswordComponent
	| DialogNumberComponent
	| DialogColorComponent
	| DialogDateComponent
	| DialogCheckboxComponent
	| DialogSelectComponent;

interface DialogComponentPropsBase extends DialogComponentBase {
	setValue: (value: DialogComponentValues | undefined) => void;
	setValidity: (value: boolean) => void;
}

interface DialogTextComponentProps extends DialogComponentPropsBase {
	type: 'text';
	value?: string;
	defaultValue?: string;
}

interface DialogPasswordComponentProps extends DialogTextComponentProps {
	type: 'password';
}

interface DialogTextareaComponentProps extends DialogTextComponentProps {
	type: 'textarea';
}

interface DialogNumberComponentProps extends DialogComponentPropsBase {
	type: 'number';
	value?: number;
	defaultValue?: number;
}

interface DialogColorComponentProps extends DialogComponentPropsBase {
	type: 'color';
	value?: ColorArray;
	defaultValue?: ColorArray;
}

interface DialogDateComponentProps extends DialogComponentPropsBase {
	type: 'date';
	value?: Date;
	defaultValue?: number;
}

interface DialogCheckboxComponentProps extends DialogComponentPropsBase {
	type: 'checkbox';
	value?: boolean;
	defaultValue?: boolean;
}

interface DialogSelectComponentProps extends DialogTextComponentProps {
	type: 'select';
}

type DialogComponentProps =
	| DialogTextComponentProps
	| DialogTextareaComponentProps
	| DialogPasswordComponentProps
	| DialogNumberComponentProps
	| DialogColorComponentProps
	| DialogDateComponentProps
	| DialogCheckboxComponentProps
	| DialogSelectComponentProps;
