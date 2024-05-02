import React, { ReactNode, useId } from "react";
import { useEffect, useState } from "react";
import { ZodError, ZodIssue } from "zod";
import { useToast } from "../ui/components/ui/use-toast";
import { ToastActionElement, ToastProps } from "../ui/components/ui/toast";
import { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";

interface WordsSectionProps {
	children?: React.ReactNode | null;
	class?: string;
}

export function H1(props: WordsSectionProps) {
	return (
		<h1 className={`text-xl shrink-0 ${props?.class ?? ""}`}>
			{props.children}
		</h1>
	);
}

export type InputErrorType = ZodError | undefined;

// biome-ignore lint/suspicious/noExplicitAny: Simply use React.InputHTMLATttributes<T> as superclass
export type FormInputProps<TF extends FieldValues,T = any> = Omit<
	React.InputHTMLAttributes<T>,
	"className"
> & {
	label: string;
	name: Path<TF>;
	type: string;

	children?: ReactNode;
	required?: boolean;
	errors?: FieldErrors;
	showInput?: boolean;
	autoFocus?: boolean;
	block?: boolean;
	register?:UseFormRegister<TF>,
	className?: {
		div?: string;
		input?: string;
		error?: string;
		label?: string;
	};
};

const RootNumber = {
	num: 0,
	getRandom() {
		// biome-ignore lint/suspicious/noAssignInExpressions: reducing the number of calls to crypto
		return (RootNumber.num += 1);
	},
};

export function FormInput<TF extends FieldValues>({
	errors: propserrors,
	block,
	onClick,
	children,
	className,
	name,
	label,
	showInput,
	required,
	register,
	...restProps
}: FormInputProps<TF>) {
	const [errors, setErrors] = useState<Array<string>>();
	
	useEffect(() => {
		// console.log(props);
		if (propserrors) {
			const err = propserrors[name];
			// console.log(err)
			if (err?.message) {
				setErrors((_) => {
					if (Array.isArray(err.message)) {
						return err.message
						// biome-ignore lint/style/noUselessElse: <explanation>
					} else if (typeof err.message === 'string') {
						return [err.message]
					}
					return undefined
				})


			}
			// if (err?.length) {
			// 	setErrors(err);
			// }
		}
	}, [name, propserrors]);
	const id = restProps.id ?? useId()
	const divClass = `flex w-full flex-wrap ${block ? "" : " grid grid-cols-1 md:grid-cols-2   lg:items-center"
		}  mt-2 ${className?.div ?? ""}` as const;

	const Label = () => (
		<label htmlFor={id} className="px-2 capitalize col-span-1">
			{label}
			{required ? <span className="text-red-500 px-1">*</span> : <></>}
		</label>
	);

	const Input = () =>register? (
		<input
			{...{ ...restProps, id, required,  ...register(name,{required}) }}
			className={`${!block ? "ml-auto" : ""} w-full ${className?.input ?? ""}
				outline-none ${errors && !!errors.length
					? " border-opacity-100"
					: " border-opacity-0 "
				} bg-gray-100 p-1 rounded-md border-red-200 border-2 
			`}
		/>
	):(
		<input
			{...{ ...restProps, id, required, name,  }}
			className={`${!block ? "ml-auto" : ""} w-full ${className?.input ?? ""}
				outline-none ${errors && !!errors.length
					? " border-opacity-100"
					: " border-opacity-0 "
				} bg-gray-100 p-1 rounded-md border-red-200 border-2 
			`}
		/>
	);

	const TextArea = () =>register? (
		<textarea
			{...{ ...restProps, id, required, ...register(name,{required}) }}
			className={`${!block ? "ml-auto" : ""} ${className?.input ?? ""}
		outline-none ${errors && !!errors.length ? " border-opacity-100" : " border-opacity-0 "
				} col-span-1 bg-gray-100 p-1 rounded-md border-red-200 border-2  w-full
	`}
		/>
	): (
		<textarea
			{...{ ...restProps, id, required, name }}
			className={`${!block ? "ml-auto" : ""} ${className?.input ?? ""}
		outline-none ${errors && !!errors.length ? " border-opacity-100" : " border-opacity-0 "
				} col-span-1 bg-gray-100 p-1 rounded-md border-red-200 border-2  w-full
	`}
		/>
	);
	const Select = ({ children }: { children?: React.ReactNode }) => register? (
		<select
		
			{...{ ...restProps, id, required, ...register(name,{required}) }}
			className={`${!block ? "ml-auto" : ""} ${className?.input ?? ""}
			outline-none ${errors && !!errors.length ? " border-opacity-100" : " border-opacity-0 "
				} bg-gray-100 p-1 rounded-md border-red-200 border-2 
		`}
		>
			{children}
		</select>
	):(
		<select
		
			{...{ ...restProps, id, required, name }}
			className={`${!block ? "ml-auto" : ""} ${className?.input ?? ""}
			outline-none ${errors && !!errors.length ? " border-opacity-100" : " border-opacity-0 "
				} bg-gray-100 p-1 rounded-md border-red-200 border-2 
		`}
		>
			{children}
		</select>
	);
	const Errors = () =>
		errors &&
		!!errors.length && (
			<div className="flex flex-wrap text-white py-1">
				{errors.map((error, i) => (
					<p key={`${name}_${i}_err`} className="px-2 rounded-sm bg-[red] mr-2">
						{error}
					</p>
				))}
			</div>
		);

	if (!children) {
		switch (restProps.type) {
			case "textarea":
				return (
					<div className={divClass} onClick={onClick}>
						<Label />
						<TextArea />
						<Errors />
					</div>
				);
			default:
				return (
					<div className={divClass} onClick={onClick}>
						<Label />
						<Input />
						<Errors />
					</div>
				);
		}
	}

	if (!showInput) {
		switch (restProps.type) {
			case "select":
				return (
					<div className={divClass} onClick={onClick}>
						<Label />
						<Select>{children}</Select>
						<Errors />
					</div>
				);
			default:
				return (
					<div className={divClass} onClick={onClick}>
						<Label />
						{children}
						<Errors />
					</div>
				);
		}
	}

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: too much work
		<div className={divClass} onClick={onClick}>
			<Label />
			<Input />
			<Errors />
			{children}
		</div>
	);
}

interface AlertProps extends ToastProps {
	errors?: ZodError;
	action?: ToastActionElement;
}

export function Alert({
	errors,
	title,
	variant,
	action,
	...restProps
}: AlertProps) {
	const { toast } = useToast();

	useEffect(() => {
		if (errors) {
			const err: string[] = ConvertZodErrorsToStringArray(errors, "alert");

			// biome-ignore lint/suspicious/noConsoleLog: <explanation>
			/* need to log any errors */ console.log({ errors, err });
			// err = errors?.flatten().fieldErrors?.alert
			err.map((v) =>
				toast({
					...restProps,

					variant: variant ?? "destructive",

					title: v
						.split(" ")
						.map((v_) => {
							const j = v_[0]?.toUpperCase();
							return j + v_.slice(1);
						})
						.join(" "),
					action,
				}),
			);
		}
		// console.log({
		// 	loc: "consultation",
		// });
	}, [errors, title, variant]);
	return <></>;
}

export function ConvertZodErrorsToStringArray(errors: ZodError, path: string) {
	const err: string[] = [];
	const err1 = errors.toString()?.slice("ZodError:".length).trim();
	if (err1) {
		try {
			const err2 =
				errors instanceof ZodError
					? errors.issues
					: (JSON.parse(err1) as unknown as ZodIssue[]);
			err2
				.filter((v) => {
					return v.path.includes(path);
				})
				?.map((v) => err.push(v.message));
		} catch (e) {
			// biome-ignore lint/suspicious/noConsoleLog: <explanation>
			/** something has gone terribly wrong*/ console.log({
			loc: "ConvertZodErrorsToStringArray",
			err1,
			e,
		});
		}
	}

	return err;
}
