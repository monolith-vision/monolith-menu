import { Button } from '@/components/ui/button';
import { RgbaColorPicker } from 'react-colorful';
import { Pipette } from 'lucide-react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import InputWrapper from './wrapper';

import { cn, hexToRGB } from '@/lib/utils';

// @ts-expect-error EyeDropper isn't implement everywhere, if it is in our env, use it
const eyeDropper = 'EyeDropper' in window ? new window.EyeDropper() : undefined;
const defaultColor: ColorArray = [255, 255, 255, 1];

export default function DateInput({
	label,
	description,
	required,
	value,
	defaultValue,
	setValue,
}: DialogColorComponentProps) {
	const openEyedropper = async () => {
		const { sRGBHex } = await eyeDropper.open();
		const { r, g, b } = hexToRGB(sRGBHex);

		setValue([r, g, b, 1]);
	};

	return (
		<InputWrapper
			label={label}
			description={description}
			required={required}
		>
			<Popover>
				<div className="flex items-center w-full">
					<PopoverTrigger asChild>
						<Button
							variant={'outline'}
							className={cn(
								'w-full justify-start text-left font-normal pl-3',
								!!eyeDropper && 'rounded-r-none',
								!value &&
									!defaultValue &&
									'text-muted-foreground',
							)}
						>
							<div
								className="mr-2 rounded-full w-4 h-4"
								style={{
									backgroundColor: `rgba(${
										value || defaultValue || defaultColor
									})`,
								}}
							></div>
							{`rgba(${value || defaultValue || defaultColor})`}
						</Button>
					</PopoverTrigger>
					{!!eyeDropper && (
						<div className="flex flex-col h-10 w-9 rounded-r-md border border-input border-l-0 text-sm">
							<Button
								size="icon"
								variant="ghost"
								className="w-full max-h-full rounded-none rounded-r-sm active:bg-foreground/25"
								onClick={openEyedropper}
							>
								<Pipette size={15} />
							</Button>
						</div>
					)}
				</div>
				<PopoverContent className="w-auto p-2 rounded-xl">
					<RgbaColorPicker
						color={
							(value && {
								r: value[0],
								g: value[1],
								b: value[2],
								a: value[3],
							}) ||
							(defaultValue && {
								r: defaultValue[0],
								g: defaultValue[1],
								b: defaultValue[2],
								a: defaultValue[3],
							}) || {
								r: defaultColor[0],
								g: defaultColor[1],
								b: defaultColor[2],
								a: defaultColor[3],
							}
						}
						onChange={({ r, g, b, a }) => setValue([r, g, b, a])}
					/>
				</PopoverContent>
			</Popover>
		</InputWrapper>
	);
}
