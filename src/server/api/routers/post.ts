import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import type { User } from "@clerk/nextjs/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profilePicture: user.imageUrl,
  };
};

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({ take: 100 });
    const users = await (
      await clerkClient()
    ).users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    });
    const filteredUsers = users.data.map(filterUserForClient);

    return posts.map((post) => {
      const author = filteredUsers.find((user) => user.id === post.authorId);

      if (!author)
        throw new TRPCError({
          message: "No author",
          code: "INTERNAL_SERVER_ERROR",
        });
      if (!author.username)
        throw new TRPCError({
          message: "No author",
          code: "INTERNAL_SERVER_ERROR",
        });

      return {
        post,
        author,
      };
    });
  }),
});
