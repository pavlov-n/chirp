import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import type { User } from "@clerk/nextjs/server";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "30 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profilePicture: user.imageUrl,
  };
};

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });
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

  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji("only emojis").min(1).max(280),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.session.userId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const post = await ctx.db.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });
      return post;
    }),
});
