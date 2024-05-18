import { Slider } from '@/components/ui/slider';
import ComponentWrapper from './wrapper';

export default function MenuSlider({
	label,
	description,
	selected,
	value,
	step,
	min,
	max,
}: MenuComponentProps) {
	return (
		<ComponentWrapper
			label={label}
			description={description}
			selected={selected}
		>
			<div className="w-[220px]">
				<Slider
					value={[value ?? min ?? 0]}
					min={min ?? 0}
					max={max}
					step={step ?? 1}
				/>
			</div>
		</ComponentWrapper>
	);
}
