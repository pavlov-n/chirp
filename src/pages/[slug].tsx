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

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUserName.useQuery({
    username,
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
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative flex h-36 w-full items-center gap-3 border-b bg-gradient-to-bl from-[#2e026d] to-[#15162c] px-4 text-sm">
          <Image
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full shadow-lg shadow-gray-400"
            src={data.profilePicture}
            alt="profile picture"
            width={128}
            height={128}
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${data.username ?? ""}`}</div>
        <Feed />
      </PageLayout>
    </>
  );
};

// import { createSSGHelpers } from '@trpc';

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper(); 

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUserName.prefetch({ username: slug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
