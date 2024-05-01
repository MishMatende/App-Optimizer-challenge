import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

import { posts } from "~/server/db/schema";
import { CreatePostSchema, validString } from "./resulttypes";
import { eq } from "drizzle-orm";
import { RunLoggedQuery, RunQuery } from "./utils";


const getPosts = protectedProcedure.input(validString().nullable()).query(async({ctx,input})=>{

	if(!input){

		return  {
			success: false,
			data: undefined,
			error: undefined,
		};
	}
	const query = ctx.db.select().from(posts).where(eq(posts.userId,input))

	return RunQuery(query)
})



const create = protectedProcedure.input(
	CreatePostSchema
).mutation(async({ctx,input})=>{


	return {success:false}
	
})

export const postsRouter = createTRPCRouter({
	getPosts,
	create,
})
