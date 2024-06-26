import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import { useEffect, useState } from 'react';
import color from './components/color';
import checkbox from './components/checkbox';
import date from './components/date';
import number from './components/number';
import password from './components/password';
import select from './components/select';
import text from './components/text';
import textarea from './components/textarea';
import { debugData, fetchNui, useKeyUp, useNuiEvent } from '@/lib';

const componentMap: Record<
	DialogComponentTypes,
	(props: DialogComponentProps) => JSX.Element
	// @ts-expect-error DES
> = { text, number, password, color, date, checkbox, textarea, select };

export default function InputDialog() {
	const [current, setCurrent] = useState<Dialog | undefined>();

	const setValue =
		(id: string) => (value: DialogComponentValues | undefined) =>
			setCurrent((dialog) => {
				if (!dialog) return dialog;

				const componentIndex = dialog.components.findIndex(
					(dc) => dc.id === id,
				);

				if (componentIndex < 0) return dialog;

				dialog.components[componentIndex].value = value;

				return {
					...dialog,
				};
			});

	const setValidity = (id: string) => (valid: boolean) =>
		setCurrent((dialog) => {
			if (!dialog) return dialog;

			const componentIndex = dialog.components.findIndex(
				(dc) => dc.id === id,
			);

			if (componentIndex < 0) return dialog;

			dialog.components[componentIndex].valid = valid;

			return {
				...dialog,
			};
		});

	useNuiEvent<Dialog | undefined>('SetDialog', (dialog) => {
		if (!dialog) return setCurrent(undefined);

		dialog.components.map((component) => {
			if (component.type === 'date' && component.defaultValue)
				component.value = new Date(component.defaultValue);
			else component.value = component.defaultValue;

			return component;
		});

		setCurrent(dialog);
	});

	useEffect(() => {
		debugData([
			{
				action: 'SetDialog',
				data: {
					__resource: 'resource',
					id: 'resource',
					title: 'Title',
					description: 'Description',
					components: [
						{
							id: '1',
							type: 'text',
							label: 'Text',
							description: 'Description',
							placeholder: 'Placeholder',
							defaultValue: 'Default',
							min: 3,
							max: 10,
							required: true,
						},
						{
							id: '2',
							type: 'number',
							label: 'Number',
							description: 'Description',
							placeholder: 'Placeholder',
							defaultValue: 0,
							required: true,
						},
						{
							id: '3',
							type: 'password',
							label: 'Password',
							description: 'Description',
							placeholder: 'Placeholder',
							defaultValue: 'Password',
							required: true,
						},
						{
							id: '4',
							type: 'color',
							label: 'Color',
							description: 'Description',
							placeholder: 'Placeholder',
							defaultValue: [255, 0, 0, 1.0],
							required: true,
						},
						{
							id: '5',
							type: 'date',
							label: 'Date',
							description: 'Description',
							placeholder: 'Placeholder',
							defaultValue: new Date(),
							required: true,
						},
						{
							id: '6',
							type: 'checkbox',
							label: 'Checkbox',
							description: 'Description',
							placeholder: 'Placeholder',
							defaultValue: false,
							required: true,
						},
						{
							id: '7',
							type: 'textarea',
							label: 'Textarea',
							description: 'Description',
							placeholder: 'Placeholder',
							defaultValue: 'Default',
							required: true,
						},
						{
							id: '8',
							type: 'select',
							label: 'Select',
							description: 'Description',
							placeholder: 'Placeholder',
							values: [
								{
									label: 'Test',
									value: 'test',
								},
								{
									label: 'Test 2',
									value: 'test2',
								},
							],
							required: true,
						},
					] as DialogComponent[],
				},
			},
		]);
	}, []);

	const submit = async () => {
		if (
			!current ||
			!current.components.every((component) => {
				switch (component.type) {
					case 'color':
					case 'date':
						return true;
					case 'text':
					case 'password':
					case 'textarea':
						if (!component.required) return true;

						if (
							typeof component.value !== 'string' ||
							(!!component.min &&
								component.value.length < component.min) ||
							(!!component.max &&
								component.value.length > component.max)
						)
							return false;

						return true;
					case 'number':
						if (!component.required) return true;

						if (
							typeof component.value !== 'number' ||
							(!!component.min &&
								component.value < component.min) ||
							(!!component.max && component.value > component.max)
						)
							return false;

						return true;
					case 'checkbox':
					case 'select':
						if (!component.required) return true;

						if (!component.value) return false;

						return true;
					default:
						return false;
				}
			})
		)
			return;

		const values = current.components.map((component) =>
			component.type === 'date'
				? component.value?.getTime()
				: component.value,
		);

		await fetchNui('dialog:Submit', { dialog: current, values });
		setCurrent(undefined);
	};

	const close = () => {
		setCurrent(undefined);
		fetchNui('dialog:Close', { dialog: current });
	};

	useKeyUp('Escape', close);

	return (
		<Dialog
			open={current !== undefined}
			onOpenChange={(b) => !b && close()}
			modal={false}
		>
			<DialogContent className="max-w-sm px-0 dark">
				<DialogHeader className="items-center mb-2">
					<DialogTitle className="text-lg">
						{current?.title}
					</DialogTitle>
					{current?.description !== undefined && (
						<DialogDescription className="!mt-0 text-sm">
							{current?.description}
						</DialogDescription>
					)}
				</DialogHeader>
				<div className="flex flex-col items-center gap-6 max-h-[500px] overflow-auto w-full px-6 pb-6">
					{current?.components.map((component) => {
						const Component = componentMap[component.type];

						return (
							<Component
								key={component.id}
								setValue={setValue(component.id)}
								setValidity={setValidity(component.id)}
								{...component}
							/>
						);
					})}
				</div>
				<DialogFooter className="px-6">
					<Button onClick={submit}>
						{current?.submitLabel ?? 'Submit'}
					</Button>
					<DialogClose asChild>
						<Button variant="secondary">
							{current?.cancelLabel ?? 'Cancel'}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
