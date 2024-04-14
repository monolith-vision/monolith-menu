import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { useEffect, useState } from 'react';
import { cn, fetchNui, useKeyEvent, useNuiEvent } from './lib';
import { CSSTransition } from 'react-transition-group';

// Menu Components
import Placeholder from './components/placeholder';
import Button from './components/button';
import Slider from './components/slider';
import List from './components/list';
import Checkbox from './components/checkbox';

const componentMap: Record<
	MenuComponentTypes,
	(props: MenuComponentProps) => JSX.Element
> = {
	placeholder: Placeholder,
	button: Button,
	submenu: Button,
	slider: Slider,
	list: List,
	checkbox: Checkbox,
};

let lastPos = 'top-left';

export default function Menu() {
	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const [menu, setMenu] = useState<Menu | undefined>();
	const [display, toggleDisplay] = useState(false);

	const ArrowUp = () => {
		if (!menu) return;

		setSelectedIndex((prevIndex) => {
			let index = Math.max(-1, prevIndex - 1);

			if (index < 0) index = menu.components.length - 1;

			if (menu.components[index]?.type === 'placeholder') index -= 1;

			return index;
		});
	};
	useKeyEvent('ArrowUp', ArrowUp);
	useNuiEvent('ArrowUp', ArrowUp);

	const ArrowDown = () => {
		if (!menu) return;

		setSelectedIndex((prevIndex) => {
			let index = Math.min(menu.components.length, prevIndex + 1);

			if (menu.components[index]?.type === 'placeholder') index += 1;

			if (index === menu.components.length)
				index =
					menu.components.findIndex(
						(c) => c.type !== 'placeholder',
					) ?? 0;

			return index;
		});
	};
	useKeyEvent('ArrowDown', ArrowDown);
	useNuiEvent('ArrowDown', ArrowDown);

	const ArrowLeft = () => {
		if (!menu) return;

		const component = menu.components[selectedIndex];

		if (!['list', 'slider'].includes(component?.type)) return;

		setMenu((menu) => {
			if (!menu) return menu;

			component.value = Math.max(
				-1,
				(component.value ?? 0) - (component.step ?? 1),
			);

			if (component.value === -1)
				component.value = (component.values?.length ?? 0) - 1;

			fetchNui('onChange', {
				component,
				menu,
			});

			return { ...menu };
		});
	};
	useKeyEvent('ArrowLeft', ArrowLeft);
	useNuiEvent('ArrowLeft', ArrowLeft);

	const ArrowRight = () => {
		if (!menu) return;

		const component = menu.components[selectedIndex];

		if (!['list', 'slider'].includes(component?.type)) return;

		setMenu((menu) => {
			if (!menu) return;

			const max = component.max ?? component.values?.length;

			component.value = Math.min(
				max ?? 0,
				(component.value ?? 0) + (component.step ?? 1),
			);

			if (component.value === component.values?.length)
				component.value = 0;

			fetchNui('onChange', {
				component,
				menu,
			});

			return { ...menu };
		});
	};
	useKeyEvent('ArrowRight', ArrowRight);
	useNuiEvent('ArrowRight', ArrowRight);

	const Enter = async () => {
		if (!menu) return;

		const component = menu.components[selectedIndex];

		setMenu((menu) => {
			if (!menu || component?.type !== 'checkbox') return menu;

			component.checked = !component.checked;

			fetchNui('onCheck', {
				component,
				menu,
			});

			return { ...menu };
		});

		if (!['slider', 'placeholder'].includes(component.type))
			await fetchNui('onClick', {
				component,
				menu,
			});
	};
	useKeyEvent('Enter', Enter);
	useNuiEvent('Enter', Enter);

	const Backspace = async () => {
		await fetchNui('Back', { menu });
	};
	useKeyEvent('Backspace', Backspace);
	useNuiEvent('Backspace', Backspace);

	const Escape = async () => {
		await fetchNui('Exit', { menu });
	};
	useKeyEvent('Escape', Escape);
	useNuiEvent('Escape', Escape);

	useNuiEvent<{ menu: Menu | undefined }>('SetMenu', ({ menu }) => {
		if (menu) {
			setSelectedIndex(
				menu.components.findIndex((c) => c.type !== 'placeholder'),
			);

			lastPos = menu.position;
		}

		if (menu) setMenu(menu);
		else
			setTimeout(() => {
				setMenu(undefined);
			}, 150);

		toggleDisplay(menu !== undefined);
	});

	useEffect(() => {
		if (!menu) return;

		const component = JSON.parse(
			JSON.stringify(menu.components[selectedIndex]),
		);

		if (component.type === 'placeholder')
			return setSelectedIndex(
				menu.components.findIndex((c) => c.type !== 'placeholder'),
			);

		component.index = selectedIndex;

		fetchNui('onComponentSelect', {
			component,
			menu,
		});
	}, [selectedIndex, menu]);

	// https://web.archive.org/web/20110806041156/http://forums.devshed.com/javascript-development-115/regexp-to-match-url-pattern-493764.html
	const isUrl = (str?: string) =>
		str &&
		new RegExp(
			'^(https?:\\/\\/)?' + // protocol
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
				'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
				'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
				'(\\#[-a-z\\d_]*)?$',
			'i',
		).test(str);

	return (
		<CSSTransition
			in={display}
			timeout={150}
			classNames="fade"
			unmountOnExit
		>
			<Card
				className={cn(
					'w-[450px] dark m-4 absolute transition-height duration-150 ease-in-out',
					menu?.position ?? lastPos,
				)}
			>
				<CardHeader
					className={cn(
						'text-center rounded-md transition-colors mix-blend-difference',
						{
							'm-6 mb-3': menu?.banner !== undefined,
						},
					)}
					style={{
						background: isUrl(menu?.banner)
							? `url(${menu?.banner})`
							: menu?.banner,
						backgroundPosition: 'center',
						backgroundSize: 'cover',
					}}
				>
					<CardTitle>{menu?.title}</CardTitle>
					{menu?.description !== undefined && (
						<CardDescription>{menu?.description}</CardDescription>
					)}
				</CardHeader>
				<CardContent className="flex flex-col gap-3">
					{menu?.components.map((component) => {
						const Component = componentMap[component.type];

						return (
							<Component
								key={component.id}
								id={component.id}
								type={component.type}
								label={component.label}
								description={component.description}
								selected={
									menu?.components[selectedIndex ?? 0].id ===
									component.id
								}
								values={component.values}
								value={component.value}
								step={component.step}
								min={component.min}
								max={component.max}
								checked={component.checked}
							/>
						);
					})}
				</CardContent>
			</Card>
		</CSSTransition>
	);
}
