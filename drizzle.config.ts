import { type Config } from "drizzle-kit";

import { env } from "~/env.js";

export default ({
	schema: ["./src/server/db/schema/index.ts"],
	introspect:{
		casing:'preserve'
	},
	driver: "pg",
	dbCredentials: {
		connectionString: env.DATABASE_URL,
	},
	//dbCredentials: {
	//   connectionString: process.env.DB_URL,
	// },
schemaFilter:['public'],
	verbose: true,
	out: "./sql",
	strict: true,
	tablesFilter: ["cms_*"],

} satisfies Config);
