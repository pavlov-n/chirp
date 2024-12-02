import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Head from "next/head";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import LoadingSpinner from "~/components/loading";
import { useState } from "react";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["post"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <li key={post.id} className="flex gap-3 border-b border-slate-400 p-8">
      <Image
        className="rounded-full"
        src={author?.profilePicture}
        alt={`${author.profilePicture}'s profile image`}
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-2 font-bold text-slate-400">
          <span>{`@${author.username}`}</span>
          <span className="font-thin">{":"}</span>
          <span className="font-thin">{`${dayjs(post.createdAt).fromNow()}`}</span>
        </div>

        {post.content}
      </div>
    </li>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();

  if (postsLoading)
    return (
      <div className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (!data) return <div>Something wrong!</div>;

  return (
    <ul className="border">
      {data?.map((fullpost) => (
        <PostView {...fullpost} key={fullpost.post.id} />
      ))}
    </ul>
  );
};

export default function Home() {
  const { user } = useUser();

  api.post.getAll.useQuery();

  const ctx = api.useUtils();

  const {mutate, isPending: isPosting} = api.post.create.useMutation({onSuccess: () => {
    setInput("");
    ctx.post.getAll.invalidate();
  }});
  const [input, setInput] = useState("");

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex h-14 w-full items-center gap-3 px-4 text-sm">
            <SignedOut>
              <SignInButton />
            </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            <input
              className="bg-transparent grow outline-none"
              placeholder="Emojies!<3"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isPosting}
            />
            <button onClick={() => mutate({content: input})}>POST</button>
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
}
