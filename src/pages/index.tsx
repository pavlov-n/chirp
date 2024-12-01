import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import LoadingSpinner from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { PageLayout } from "~/components/layout";

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
          <Link href={`@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{":"}</span>
            <span className="font-thin">{`${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        {post.content}
      </div>
    </li>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();
  const { user } = useUser();

  if (!user) return null;

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
  api.post.getAll.useQuery();

  const ctx = api.useUtils();

  const { mutate, isPending: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.post.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage) {
        if (errorMessage[0]) {
          toast.error(errorMessage[0]);
        }
      } else {
        toast.error("Failed to post(");
      }
    },
  });
  const [input, setInput] = useState("");

  return (
    <>
      <PageLayout>
          <div className="flex h-14 w-full items-center gap-3 px-4 text-sm">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <input
              className="grow bg-transparent outline-none"
              placeholder="Emojies!<3"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isPosting}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (input !== "") {
                    mutate({ content: input });
                  }
                }
              }}
            />
            {isPosting && (
              <div className="size-8">
                <LoadingSpinner circleSize={"size-10"} size={true} />
              </div>
            )}
            {input !== "" && !isPosting && (
              <button onClick={() => mutate({ content: input })}>POST</button>
            )}
          </div>
          <Feed />
          </PageLayout>
    </>
  );
}
