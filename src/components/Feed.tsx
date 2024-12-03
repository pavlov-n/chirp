import {
  useUser,
} from "@clerk/nextjs";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";
import LoadingSpinner from "~/components/loading";
import PostView from "~/components/postview";

dayjs.extend(relativeTime);


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
    <ul className="shadow-inner shadow-black">
      {data?.map((fullpost) => (
        <PostView {...fullpost} key={fullpost.post.id} />
      ))}
    </ul>
  );
};



export default Feed;