interface PostCardProps {
  title: string;
  text: string;
  upvotes: number;
  downvotes: number;
  author?: string;
  communityId: string;
}

function PostCard({ title, text, upvotes, downvotes, author, communityId }: PostCardProps) {
  return (
    <div className="flex flex-col rounded-lg bg-slate-900 p-4 gap-3 w-[450px]">
      <h3 className="font-bold text-xl">{title}</h3>
      <div className="flex gap-2 text-sm text-gray-300 text-light">
        <span>Posted By: {author}</span>
        <span>Community ID: {communityId} </span>
      </div>

      <div className="py-3 text-medium">{text}</div>

      <div className="flex gap-3">
        <div className="bg-green-500 p-1 rounded-md flex items-center text-sm">Up Vote: {upvotes} </div>
        <div className="bg-red-500 p-1 rounded-md flex items-center text-sm"> Down Vote: {downvotes} </div>
      </div>
    </div>
  );
}

export default PostCard;
