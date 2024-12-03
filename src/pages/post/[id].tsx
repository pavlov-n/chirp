import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import LoadingSpinner from "~/components/loading";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import PostView from "~/components/postview";


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
