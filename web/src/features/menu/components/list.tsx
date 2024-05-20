import { ChevronLeft, ChevronRight } from 'lucide-react';
import ComponentWrapper from './wrapper';

export default function List({
	label,
	description,
	selected,
	values,
	value,
}: MenuComponentProps) {
	return (
		<ComponentWrapper
			label={label}
			description={description}
			selected={selected}
		>
			<div className="flex items-center gap-3">
				<ChevronLeft strokeOpacity={0.5} />
				<h1>{values?.[value ?? 0] ?? ''}</h1>
				<ChevronRight strokeOpacity={0.5} />
			</div>
		</ComponentWrapper>
	);
}
