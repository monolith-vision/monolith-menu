import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { useEffect, useState } from 'react';
import { cn, debugData, fetchNui, isUrl, useKeyDown, useNuiEvent } from '@/lib';
import { CSSTransition } from 'react-transition-group';

// Menu Components
import placeholder from './components/placeholder';
import button from './components/button';
import slider from './components/slider';
import list from './components/list';
import checkbox from './components/checkbox';

const componentMap: Record<
	MenuComponentTypes,
	(props: MenuComponentProps) => JSX.Element
> = { placeholder, button, submenu: button, slider, list, checkbox };

export default function Menu() {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [current, setCurrent] = useState<Menu | undefined>();
	const [display, toggleDisplay] = useState(false);
	const [lastPos, setLastPos] = useState<MenuPositions>('top-left');

	const ArrowUp = () => {
		if (!current) return;

		setSelectedIndex((prevIndex) => {
			let index = Math.max(-1, prevIndex - 1);

			if (current.components[index]?.type === 'placeholder') index--;

			if (index < 0) index = current.components.length - 1;

			return index;
		});
	};
	useKeyDown('ArrowUp', ArrowUp);
	useNuiEvent('ArrowUp', ArrowUp);

	const ArrowDown = () => {
		if (!current) return;

		setSelectedIndex((prevIndex) => {
			let index = Math.min(current.components.length, prevIndex + 1);

			if (current.components[index]?.type === 'placeholder') index += 1;

			if (index === current.components.length)
				index =
					current.components.findIndex(
						(c) => c.type !== 'placeholder',
					) ?? 0;

			return index;
		});
	};
	useKeyDown('ArrowDown', ArrowDown);
	useNuiEvent('ArrowDown', ArrowDown);

	const ArrowLeft = () => {
		if (!current) return;

		const component = current.components[selectedIndex];

		if (!['list', 'slider'].includes(component?.type)) return;

		setCurrent((current) => {
			if (!current) return current;

			component.value = Math.max(
				-1,
				(component.value ?? 0) - (component.step ?? 1),
			);

			if (component.value === -1)
				component.value = (component.values?.length ?? 0) - 1;

			fetchNui('menu:onChange', {
				component,
				menu: current,
			});

			return { ...current };
		});
	};
	useKeyDown('ArrowLeft', ArrowLeft);
	useNuiEvent('ArrowLeft', ArrowLeft);

	const ArrowRight = () => {
		if (!current) return;

		const component = current.components[selectedIndex];

		if (!['list', 'slider'].includes(component?.type)) return;

		setCurrent((current) => {
			if (!current) return;

			const max = component.max ?? component.values?.length;

			component.value = Math.min(
				max ?? 0,
				(component.value ?? 0) + (component.step ?? 1),
			);

			if (component.value === component.values?.length)
				component.value = 0;

			fetchNui('menu:onChange', {
				component,
				menu: current,
			});

			return { ...current };
		});
	};
	useKeyDown('ArrowRight', ArrowRight);
	useNuiEvent('ArrowRight', ArrowRight);

	const Enter = async () => {
		if (!current) return;

		const component = current.components[selectedIndex];

		setCurrent((current) => {
			if (!current || component?.type !== 'checkbox') return current;

			component.checked = !component.checked;

			fetchNui('menu:onCheck', {
				component,
				menu: current,
			});

			return { ...current };
		});

		if (!['slider', 'placeholder'].includes(component.type))
			await fetchNui('menu:onClick', {
				component,
				menu: current,
			});
	};
	useKeyDown('Enter', Enter);
	useNuiEvent('Enter', Enter);

	const Backspace = async () => {
		await fetchNui('menu:Back', { menu: current });
	};
	useKeyDown('Backspace', Backspace);
	useNuiEvent('Backspace', Backspace);

	const Escape = async () => {
		await fetchNui('menu:Exit', { menu: current });
	};
	useKeyDown('Escape', Escape);
	useNuiEvent('Escape', Escape);

	useNuiEvent<Menu | undefined>('SetMenu', (current) => {
		if (current) {
			setSelectedIndex(
				current.components.findIndex((c) => c.type !== 'placeholder'),
			);

			setLastPos(current.position);

			setCurrent(current);
		}

		if (!current) setTimeout(() => setCurrent(undefined), 150);

		toggleDisplay(current !== undefined);
	});

	useEffect(() => {
		if (!current) return;

		const component = JSON.parse(
			JSON.stringify(current.components[selectedIndex]),
		);

		if (component.type === 'placeholder')
			return setSelectedIndex(
				current.components.findIndex((c) => c.type !== 'placeholder'),
			);

		component.index = selectedIndex;

		fetchNui('menu:onComponentSelect', {
			component,
			menu: current,
		});
	}, [selectedIndex, current]);

	useEffect(() => {
		debugData([
			{
				action: 'SetMenu',
				data: {
					__resource: 'resource',
					id: 'id',
					title: 'Menu',
					position: 'top-left',
					description: 'Description',
					banner: undefined,
					components: [
						{
							id: 'id',
							type: 'placeholder',
							label: 'Placeholder',
						},
						{
							id: 'id2',
							type: 'button',
							label: 'Button',
							description: 'Description',
						},
						{
							id: 'id3',
							type: 'submenu',
							label: 'Submenu',
							description: 'Description',
						},
						{
							id: 'id4',
							type: 'slider',
							label: 'Slider',
							value: 10,
							min: 0,
							max: 100,
							step: 1,
							description: 'Description',
						},
						{
							id: 'id5',
							type: 'list',
							label: 'List',
							description: 'Description',
							values: ['Item 1', 'Item 2', 'Item 3'],
							value: 0,
						},
						{
							id: 'id6',
							type: 'checkbox',
							label: 'Label',
							description: 'Description',
							checked: true,
						},
					],
				},
			},
		]);
	}, []);

	return (
		<CSSTransition
			in={display}
			timeout={150}
			classNames="fade"
			unmountOnExit
		>
			<Card
				className={cn(
					'w-[450px] m-4 absolute transition-height duration-150 ease-in-out pointer-events-none dark',
					current?.position ?? lastPos,
				)}
			>
				<CardHeader
					className={cn(
						'text-center rounded-md transition-colors mix-blend-difference',
						{
							'm-6 mb-3': current?.banner !== undefined,
						},
					)}
					style={{
						background: isUrl(current?.banner)
							? `url(${current?.banner})`
							: current?.banner,
						backgroundPosition: 'center',
						backgroundSize: 'cover',
					}}
				>
					<CardTitle>{current?.title}</CardTitle>
					{current?.description !== undefined && (
						<CardDescription>
							{current?.description}
						</CardDescription>
					)}
				</CardHeader>
				<CardContent className="flex flex-col gap-3">
					{current?.components.map((component) => {
						const Component = componentMap[component.type];

						return (
							<Component
								key={component.id}
								{...component}
								selected={
									current?.components[selectedIndex ?? 0]
										.id === component.id
								}
							/>
						);
					})}
				</CardContent>
			</Card>
		</CSSTransition>
	);
}
