import {
	timestamp,
	text,
	primaryKey,
	integer,
	index,
	json,
} from "drizzle-orm/pg-core";
import { id, pgTable, timestamp_ } from "./utils";
import { userIdForeignKey } from "./postsinfo";


export const BasicLog = pgTable("basiclog", {
	id: id(),
	query: json("query").notNull(),
	userId: userIdForeignKey(),
	time: timestamp_("time"),
	response: json("result").notNull(),
});
