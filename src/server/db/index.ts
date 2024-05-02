import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { dev_env, env } from "../../env.js";
import * as schema from "./schema/index";
import { registerService } from "~/utils/dbquerybuilder";

export const client = registerService("dbclient", async () => {
	const cl = new Client({
		connectionString: env.DATABASE_URL,
	});
	await cl.connect();
	return cl;
});

// biome-ignore lint/suspicious/noConsoleLog: THIS IS MY OWN LOG TRACE FOR DB CONNECTIONS
if (dev_env) console.log(`db url: ${env.DATABASE_URL}`);

export const db = await registerService(
	"db",
	(): Promise<NodePgDatabase<typeof schema>> =>
		client.then((cl) =>
			drizzle(cl, {
				schema,
			}),
		),
);
