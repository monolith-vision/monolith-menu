import { Checkbox } from '@/components/ui/checkbox';
import ComponentWrapper from './wrapper';

export default function MenuCheckbox({
	id,
	label,
	description,
	selected,
	checked,
}: MenuComponentProps) {
	return (
		<ComponentWrapper
			label={label}
			description={description}
			selected={selected}
		>
			<Checkbox
				id={id}
				checked={checked}
				className="w-[20px] h-[20px] transition-colors mr-2"
			/>
		</ComponentWrapper>
	);
}
