import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";
import LoadingSpinner from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import Feed from "~/components/Feed";

dayjs.extend(relativeTime);

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
