import PostCard from "../components/PostCard";
import Voting from "~~/components/Voting";

const posts = () => {
  return (
    <div className="flex w-[100vw] h-[80vh] justify-center items-center">
      <Voting>
        <PostCard
          title={"A new post"}
          text={"a nice post text"}
          author={"0x2u3"}
          upvotes={12}
          downvotes={2}
          communityId={"232"}
        />
      </Voting>
    </div>
  );
};

export default posts;
