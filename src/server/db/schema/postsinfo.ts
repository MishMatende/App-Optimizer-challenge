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
import { PostData } from "../datatypes/posts";
import { UserData } from "../datatypes/user";





const customJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return 'jsonb';
    },
    toDriver(value: TData): string {
      return JSON.stringify(superjson.serialize(value));
    },
    fromDriver(value:string) {
        return superjson.deserialize(JSON.parse(value))
    },
  })(name);


export const userIdForeignKey = ()=> uuid('user_uuid').notNull().references(()=>authUsers.id,{onDelete:'cascade'})


export const members = pgTable("members",{
  id:id(),
  user_id:userIdForeignKey(),
  email:text("email_").notNull(),
  phone_no:text("phone_no").notNull(),
  
  createdAt:timestamp_("createdAt"),
    updatedAt:timestamp_("updatedAt").$defaultFn(()=>sql`NOW()`)
})

export const payments = pgTable("payments",{
  id:id(),
})

export const posts = pgTable("posts", {
    id: id(),
    title: text("title").notNull(),
    meta: customJsonb<PostData.Metadata>("metadata").notNull(),
    createdAt: timestamp_("createdAt"),
    body: customJsonb<PostData.Section[]>("body").notNull(),
    updatedAt: timestamp_("updatedAt").$defaultFn(() => sql`NOW()`),
    stage:text("stage").$type<PgEnum<['draft','pending','published']>>().notNull(),
    userId:userIdForeignKey(),
    billingId:integer("billing_id").references(()=>payments.id)
});


export const interactions = pgTable("interactions",{
  id:id(),
  postid:integer('post_id').references(()=>posts.id).notNull(),
  likes:customJsonb<Array<string>>("likes"),
  comments:customJsonb<Array<PostData.CommentType>>("comments"),
  backlinks:customJsonb<Array<PostData.BackLinkType>>("backlinks"),
  shares:text("shares"),
})

export const interactionsHistory = pgTable("reactionshistory",{
  id:id(),
  postid:integer('post_id').references(()=>posts.id).notNull(),
  timestamp:timestamp("timestamp").notNull().$defaultFn(()=>sql`NOW()`),
  type:text("type").$type<PgEnum<['like','comment','share']>>().notNull(),
  ip:text("ip").notNull(),
  member_id:integer("member_id").references(()=>members.id)
})

export const clientData = pgTable("client", {
    id: id(),
    profile_:customJsonb<UserData.ProfileData>("profile_"),
    identity_:customJsonb<UserData.IdentityDatum>("identity_").notNull(),
    userId:uuid('user_uuid').unique().notNull().references(()=>authUsers.id,{onDelete:'cascade'}),
    createdAt:timestamp_("createdAt"),
    updatedAt:timestamp_("updatedAt").$defaultFn(()=>sql`NOW()`)
});


