import { relations, sql } from "drizzle-orm";
import superjson from "superjson";
import {
    AnyPgColumn,
    PgEnum,
   
    boolean,
    date,
    index,
    integer,
    json,
    serial,
    text,
    timestamp,
    unique,
    uuid,
    varchar,
    customType
} from "drizzle-orm/pg-core";
import { id, pgTable, timestamp_, timestamp_null, updatedAt } from "./utils";
import {authUsers} from "./auth.users";
import { userIdForeignKey } from "./postsinfo";

export const resources_tmp = pgTable("resources_tmp",{
    id:id(),
    uri:varchar('uri',{length:32}).notNull(),
    chunk:text('chunk').notNull(),
    i:integer('i').notNull(),
    userId:userIdForeignKey(),
    createdAt:timestamp_('createdAt'),
},(res_unit)=>({
    unique_unit:unique('unikUnit').on(res_unit.uri,res_unit.i),
}))