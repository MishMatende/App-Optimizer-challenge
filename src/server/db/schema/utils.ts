import { sql } from "drizzle-orm";
import { pgTableCreator, serial, timestamp,} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

console.log("pgTableCreator running");
// patientstracker ==> ptr
export const pgTable = pgTableCreator((name) => `cms_${name}`);

export const id = () => serial("id").primaryKey().notNull();

export const timestamp_ = (name: string) =>
	timestamp(name, { mode: "string" }).defaultNow();

export const timestamp_null = (name: string) =>
	timestamp(name, { mode: "string" });

export const updatedAt = () =>
	timestamp_("updatedAt").$defaultFn(() => sql`NOW()`);
