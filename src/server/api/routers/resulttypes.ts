import { PgEnum } from "drizzle-orm/pg-core";
import { ZodError, ZodIssue, z } from "zod";


export const validString = () =>
	z
		.string()
		.min(3, "too short")
		.regex(/([a-z0-9'\.,-]+)/, "invalid character") // sql injection
		.max(64, "too long");

export const validUserId = () =>
	validString().regex(/[0-9a-z]+/, "invalid format");

	
export type Result< SuccessType = any> = {
	success: boolean;
	error?: ZodError;
	data?: SuccessType;
};



export const CreatePostSchema= 	z.object({
	title:validString(),
	body:validString(),
	authorName:validString(),
	images:z.array(z.object({
		url: z.string().min(3),
		paragraph: z.number(),
		alt: validString(),
	})).nullable(),
	keywords:z.array(validString()),
})