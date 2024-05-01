
import { Result } from "./resulttypes";
import {
	Query, sql,
} from "drizzle-orm";
import { ZodError } from "zod";
import { dev_env } from "~/env.mjs";
import { User } from "@supabase/supabase-js";
import { BasicLog } from "~/server/db/schema";
import { db } from "~/server/db";

export type CustomErrType = {
	code: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	fullerr?: {
		[key: string]: any;
		message: string;
	};
	sql_?: Query;
};

export const catchQuery =
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		<Success = any>(
			customerror: CustomErrType,
			response: Result<Success>,
			sql: Query, // biome-ignore lint/suspicious/noExplicitAny: <explanation>
		) =>
		(error: any) => {
			if (dev_env) console.log("ERROR:", sql);
			console.error(error);
			customerror.code = error?.code;
			customerror.fullerr = error;
			response.success = false;
		};

/**
 * ctx: {
    session: {
        user: {
            id: string;
        } & {
            name?: string | null | undefined;
            email?: string | null | undefined;
            image?: string | null | undefined;
        };
        expires: string;
    };
    db: NodePgDatabase<typeof import("c:/Users/Shiloh/Documents/Judah/projects/drmatende/patientstracker/src/server/db/schema/index")>;
}
*/

interface ErrorDictType {
	[key: string]: (message?: string) => string;
}

const commonErrors: ErrorDictType = {
	"42703": (message?: string) => `fatal db issue ${message ?? ""}`,
	"23505": (message?: string) => `duplicates error: ${message ?? ""}`,
};

interface QueryInterface<T> {
	toSQL: () => Query;
	execute: () => Promise<T>;
}

export const RunQuery = async <T>(
	query: QueryInterface<T>,
	errorDict: { [key: string]: (message?: string) => string } = {},
): Promise<Result< T>> => {
	const response: Result< T> = {
		success: false,
		data: undefined,
		error: undefined,
	};
	const customError: CustomErrType = {
		code: "",
		sql_: query.toSQL(),
		fullerr: undefined,
	};

	const fetched = await query.execute().catch((error) => {
		if (error.code) {
			customError.code = error.code;
		}
		customError.fullerr = error;
	});

	if (customError.code) {
		if (dev_env) {
			// biome-ignore lint/suspicious/noConsoleLog:NEED TO LOG IF ERROR
			console.log({
				lne: {
					loc: "RunQuery",
					resource:
						"/C:/Users/Shiloh/Documents/Judah/projects/drmatende/patientstracker/src/server/api/routers/utils.ts",
				},

				customError,
			});
		}
		let reaction = errorDict[customError.code];
		if (!reaction) {
			reaction = commonErrors[customError.code];
		}
		response.error = new ZodError([
			{
				message: reaction?.(customError.fullerr?.message) ?? "error in db",
				code: "custom",
				fatal: true,
				path: ["db", "alert"],
			},
		]);

		return response;
	}
	if (
		"blank" in errorDict &&
		(!fetched || (Array.isArray(fetched) && !fetched.length))
	) {
		response.error = new ZodError([
			{
				message: "empty result from db",
				code: "custom",
				fatal: true,
				path: ["db", "alert"],
			},
		]);

		return response;
	}
	response.success = true;
	response.data = fetched ?? undefined;
	return response;
};

export const RunLoggedQuery = async <T>(
	query: QueryInterface<T>,
	{ session }: { session: User|null|undefined },
	errorDict: { [key: string]: (message?: string) => string } = {},
): Promise<Result<T>> => {
	if (!session) {
		return {
			success: false,
			error: new ZodError([
				{
					message: "no session",
					code: "custom",
					path: ["alert"],
				},
			]),
		};
	}

	const q_sql = JSON.stringify(query.toSQL());
	const userId = session.id;
	const response = await RunQuery(query, errorDict);
	const r_json = JSON.stringify(response).replaceAll("\\", "");
	const logQ = db.insert(BasicLog).values({
		userId,
		query: sql.raw(`(${q_sql})`),
		response: sql.raw(`(${r_json})`),
	});
	// RunQuery(logQ);
	console.log(logQ)
	return response;
};
