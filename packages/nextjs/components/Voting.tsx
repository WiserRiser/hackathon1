import { ReactNode, useContext, useState } from "react";
import { StoreContext } from "./Store";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

interface IVoting {
  alignment?: "row" | "col";
  children: ReactNode;
}

// TODO
// const votingButtonArguments = [
//   { component: <AiOutlineArrowDown />, handleFunction: "handleDownvote", value: "value" },
//   { component: <AiOutlineArrowDown />, handleFunction: "handleDownvote", value: "value" },
// ];

const Voting: React.FC<IVoting> = ({ alignment = "col", children }) => {
  const { store } = useContext(StoreContext);
  const STANDARD_BET = 5;

  const [upvoteBets, setUpvoteBets] = useState(0);
  const [upvoteClicked, setUpvotesClicked] = useState(false);
  const [upvoteProgress, setUpvoteProgress] = useState(STANDARD_BET);
  const [downvoteBets, setDownvoteBets] = useState(0);
  const [downvoteClicked, setDownvotesClicked] = useState(false);
  const [downvoteProgress, setDownvoteProgress] = useState(STANDARD_BET);
  const [isUpHovered, setIsUpHovered] = useState(false);
  const [isDownHovered, setIsDownHovered] = useState(false);

  const handleUpvote = () => {
    if (downvoteBets + upvoteProgress) {
      setUpvotesClicked(true);
      setUpvoteBets(upvoteProgress);
    }

    //TODO: add upvote endpoint call here
  };

  const handleDownvote = () => {
    if (upvoteBets + downvoteProgress <= 10) {
      setDownvotesClicked(true);
      setDownvoteBets(downvoteProgress);
    }

    //TODO: add downvote endpoint call here
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    event.target.id == "upvote" ? setUpvoteProgress(newValue || 0) : setDownvoteProgress(newValue || 0);
  };

  return (
    <div className="flex flex-row">
      {/* Voting */}
      <div className={`flex items-center ${alignment == "row" ? "flex-row" : "flex-col"}`}>
        <div
          className="flex flex-row"
          onMouseEnter={() => setIsUpHovered(true)}
          onMouseLeave={() => setIsUpHovered(false)}
        >
          <div
            className={`flex flex-row ${
              isUpHovered ? "w-16 py-1 px-2 text-center bg-blue-500 border border-gray-300 rounded-md outline-none" : ""
            }`}
          >
            <div className="flex flex-row items-center">
              <button onClick={handleUpvote}>
                <AiOutlineArrowUp size={20} />
              </button>
              <div className={`text-xs ${upvoteClicked && !isUpHovered ? "" : "hidden"}`}>{upvoteBets}</div>
            </div>
            <div className={`${isUpHovered ? "" : "hidden"}`}>
              <input
                type="number"
                value={upvoteProgress}
                id="upvote"
                onChange={handleInputChange}
                className="outline-none bg-inherit w-8"
              />
            </div>
          </div>
        </div>

        {/* TODO: Add net score parsing here */}
        <p className="text-sm">NET SCORE: XXXX</p>

        <div
          className="flex flex-row"
          onMouseEnter={() => setIsDownHovered(true)}
          onMouseLeave={() => setIsDownHovered(false)}
        >
          <div
            className={`flex flex-row ${
              isDownHovered
                ? "w-16 py-1 px-2 text-center bg-blue-500 border border-gray-300 rounded-md outline-none"
                : ""
            }`}
          >
            <div className="flex flex-row items-center">
              <button onClick={handleDownvote}>
                <AiOutlineArrowDown size={20} />
              </button>
              <div className={`text-xs ${downvoteClicked && !isDownHovered ? "" : "hidden"}`}>{downvoteBets}</div>
            </div>
            <div className={`${isDownHovered ? "" : "hidden"}`}>
              <input
                type="number"
                value={downvoteProgress}
                id="downvote"
                onChange={handleInputChange}
                className="outline-none bg-inherit w-8"
              />
            </div>
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Voting;
