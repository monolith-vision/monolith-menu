import { cn } from '@/lib/utils';
import { CardDescription } from './ui/card';
import { Slider } from './ui/slider';

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
		<div
			className={cn(
				'p-2 rounded-md transition-colors flex items-center justify-between',
				{
					'bg-white bg-opacity-10': selected,
				},
			)}
		>
			<div>
				<h1>{label}</h1>
				<CardDescription>{description}</CardDescription>
			</div>
			<div className="w-[220px]">
				<Slider
					value={[value ?? min ?? 0]}
					min={min ?? 0}
					max={max}
					step={step ?? 1}
				/>
			</div>
		</div>
	);
}
