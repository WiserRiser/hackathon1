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
    upvoteProgress == 0 ? setUpvotesClicked(false) : setUpvotesClicked(true);

    if (downvoteBets + upvoteProgress <= 10) {
      setUpvoteBets(upvoteProgress);
    }

    //TODO: add upvote endpoint call here
  };

  const handleDownvote = () => {
    downvoteProgress == 0 ? setDownvotesClicked(false) : setDownvotesClicked(true);

    if (upvoteBets + downvoteProgress <= 10) {
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
      <div className={`flex relative min-w-[5rem] items-center ${alignment == "row" ? "flex-row" : "flex-col"}`}>
        <div
          className="flex flex-row"
          onMouseEnter={() => setIsUpHovered(true)}
          onMouseLeave={() => {
            setIsUpHovered(false);
            setUpvoteProgress(upvoteBets);
          }}
        >
          <div
            className={`flex flex-row ${
              isUpHovered
                ? "w-16 py-1 px-2 text-center bg-[#6ee7b7] border border-gray-300 rounded-md outline-none -m-2"
                : ""
            }`}
          >
            <div className="relative flex flex-row items-center">
              <button className={`${isUpHovered ? "hover:scale-[1.15]" : ""}`} onClick={handleUpvote}>
                <AiOutlineArrowUp size={20} />
              </button>
              <div className={`text-xs absolute left-6 ${upvoteClicked && !isUpHovered ? "" : "hidden"}`}>
                {upvoteBets}
              </div>
            </div>
            <div className={`${isUpHovered ? "" : "hidden"}`}>
              <input
                type="number"
                value={upvoteProgress}
                id="upvote"
                max={10}
                min={0}
                onChange={handleInputChange}
                className="outline-none bg-inherit w-8"
              />
            </div>
          </div>
        </div>

        {/* TODO: Add net score parsing here */}
        <p className="text-sm font-semibold">+120</p>

        {/* DOWNVOTE */}
        <div
          className="flex flex-row"
          onMouseEnter={() => setIsDownHovered(true)}
          onMouseLeave={() => {
            setIsDownHovered(false);
            setDownvoteProgress(downvoteBets);
          }}
        >
          <div
            className={`flex flex-row ${
              isDownHovered
                ? "w-16 py-1 px-2 text-center bg-[#f87171] border border-gray-300 rounded-md outline-none"
                : ""
            }`}
          >
            <div className="relative flex flex-row items-center">
              <button className={`${isDownHovered ? "hover:scale-[1.15]" : ""}`} onClick={handleDownvote}>
                <AiOutlineArrowDown size={20} />
              </button>
              <div className={`text-xs absolute left-6 ${downvoteClicked && !isDownHovered ? "" : "hidden"}`}>
                {downvoteBets}
              </div>
            </div>
            <div className={`${isDownHovered ? "" : "hidden"}`}>
              <input
                type="number"
                value={downvoteProgress}
                id="downvote"
                max={10}
                min={0}
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
