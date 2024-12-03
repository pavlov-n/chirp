import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { db } from "~/server/db";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { appRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import LoadingSpinner from "~/components/loading";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import Feed from "~/components/Feed";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import PostView from "~/components/postview";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.post.getPostByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading)
    return (
      <div className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  if (!data || data.length === 0) return <div>User has not posted</div>;

  return <ul className="">

  </ul>
};

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.post.getById.useQuery({
    id,
  });

  if (isLoading)
    return (
      <div className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (!data) {
    return <div>404</div>;
  }

  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

// import { createSSGHelpers } from '@trpc';

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.post.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
