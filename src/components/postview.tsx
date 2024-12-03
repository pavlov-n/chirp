
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["post"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <li key={post.id} className="flex gap-3 shadow-sm shadow-slate-400 p-8">
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


export default PostView;