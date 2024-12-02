import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({
  getUserByUserName: publicProcedure.input(z.object({username: z.string()}))
  .query(async({ctx, input}) => {
    const userResponse = await (await clerkClient()).users.getUserList({
      username: [input.username],
    });
    const [user] = userResponse.data;

    if (!user) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "User not found",
      })
    }
    return filterUserForClient(user);
  }),
});
