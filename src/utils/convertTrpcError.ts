import { TRPCClientError } from "@trpc/client";
import { ApiError } from "next/dist/server/api-utils";
import { ZodError, ZodIssue, typeToFlattenedError } from "zod";

export namespace TransformTrpcError {
	export function toZodError<T, U = string>(
		error: typeToFlattenedError<T, U>,
		alternatives: { [key: string]: string } = {},
	) {
		const errObject = error?.fieldErrors;
		if (!errObject) return;
		const zodError: ZodIssue[] = [];
		type P = keyof typeof errObject;
		const paths: P[] = Object.keys(errObject).map((v) => v as unknown as P);
		if (!paths) return;
		for (const p of paths) {
			const op = errObject[p];
			if (p && op) {
				for (const message of op) {
					const alt = alternatives[p?.toString()];
					zodError.push({
						message: message as unknown as string,
						code: "custom",
						fatal: false,
						path: [alt ?? p?.toString()],
					});
				}
			}
		}
		if (zodError) {
			// console.log(zodError)
			return new ZodError(zodError);
		}
		return null;
	}
}
