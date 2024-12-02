import Head from "next/head";
import { PageLayout } from "~/components/layout";

export default function SinglePostPage() {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <PageLayout>
        <div className="flex h-14 w-full items-center justify-center gap-3 px-4 text-sm">
          <div>POST VIEW</div>
        </div>
      </PageLayout>
    </>
  );
}
