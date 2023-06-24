import Voting from "~~/components/Voting";

const posts = () => {
  return (
    <div className="flex w-[100vw] h-[80vh] justify-center items-center">
      <Voting>
        <div className="flex w-[60vw] h-[50vh] border-2 border-sky-500 rounded-sm"></div>
      </Voting>
    </div>
  );
};

export default posts;
