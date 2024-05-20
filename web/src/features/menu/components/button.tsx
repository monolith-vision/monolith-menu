import { ChevronRight } from 'lucide-react';
import ComponentWrapper from './wrapper';

export default function Button({
	type,
	label,
	description,
	selected,
}: MenuComponentProps) {
	return (
		<ComponentWrapper
			label={label}
			description={description}
			selected={selected}
		>
			{type === 'submenu' && <ChevronRight stroke="#fff" />}
		</ComponentWrapper>
	);
}
