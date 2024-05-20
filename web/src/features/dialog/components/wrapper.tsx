import { CardDescription } from '@/components/ui/card';
import { cn } from '@/lib';

export default function InputWrapper({
	label,
	description,
	children,
	required,
	className,
	...props
}: {
	label: string;
	description?: string;
	children?: React.ReactNode;
	required?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn('w-full flex flex-col gap-2', className)} {...props}>
			<div>
				<h1
					className={cn('text-sm flex gap-1', {
						'after:content-["*"] after:text-red-600 after:text-sm':
							required,
					})}
				>
					{label}
				</h1>
				<CardDescription className="text-xs">
					{description}
				</CardDescription>
			</div>
			{children}
		</div>
	);
}
