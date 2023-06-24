//import Link from "next/link";
import { useState } from "react";
import type { NextPage } from "next";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
type POST_TYPE = 'uri' | 'ipfs' | 'text';
const Home: NextPage = () => {
  const [communityName, setCommunityName] = useState("");
  const [postType, setPostType] = useState<POST_TYPE>("ipfs");
  const [postURI, setPostURI] = useState("");
  const [postIPFS, setPostIPFS] = useState("");
  const [postText, setPostText] = useState("");
  const [postedValue, setPostedValue] = useState("0");

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    //TODO: If the text type is selected, store that in IPFS and convert to IPFS type.
    //TODO: Expand to use other parameters, have the game logic contract mint the ERC721 for the post,
    //and have it transfer that to the parent post or community.
    //Also transfer any associated value to the parent post or community- maybe only with value tokens?
    contractName: "YourContract",
    functionName: "setGreeting", //"createCommunity"
    args: [
      postURI
      /*
        network,
        site,
        newCommunityName,
        rules,
        mod1,
        mod2,
        mod3,
        mod4,
        mod5
      */
    ],
    value: postedValue,
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">WiserRiser</span>
            <span className="block text-4xl font-bold">Post In a Community</span>
          </h1>
          <p className="text-center text-lg">
            This is a basic demo page for creating a post in a community;{" "}
            normally the host site would take care of improving on this UI.
          </p>
          <p className="text-center text-lg">
            You can also provide a payment to the community when authoring a post;{" "}
            this will likely be used only by certain specialized review communities.
          </p>
        </div>
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <p>
            Community name:{" "}
            <input
              style={{ color: "black" }}
              type="text"
              id="communityName"
              name="communityName"
              value={communityName}
              onChange={e => setCommunityName(e.target.value)}
            />
          </p>
          <p>
            <input
              type="radio"
              id="postTypeURI"
              name="postType"
              value="uri"
              checked={postType === 'uri'}
              onChange={() => setPostType('uri')}
            /> {" URI: "}
            <input
              style={{ color: "black" }}
              type="text"
              id="postURI"
              name="postURI"
              value={postURI}
              onChange={e => setPostURI(e.target.value)}
            />
          </p>
          <p>
            <input
              type="radio"
              id="postTypeIPFS"
              name="postType"
              value="gitcoin"
              checked={postType === 'ipfs'}
              onChange={() => setPostType('ipfs')}
            /> {" IPFS: "}
            <input
              style={{ color: "black" }}
              type="text"
              id="postIPFS"
              name="postIPFS"
              value={postIPFS}
              onChange={e => setPostIPFS(e.target.value)}
            />
          </p>
          <p>
            <input
              type="radio"
              id="postTypeText"
              name="postType"
              value="pix"
              checked={postType === 'text'}
              onChange={() => setPostType('text')}
            /> {" Text: "}
            <br />
            <textarea
              rows={7}
              cols={100}
              id="postText"
              name="postText"
              value={postText}
              onChange={e => setPostText(e.target.value)}
              style={{ color: "black" }}
            />
          </p>
          <p>
            Optional amount posted to the community with this post (xDAI/MATIC): {" "}
            <input
              style={{ color: "black" }}
              type="number"
              id="postedValue"
              name="postedValue"
              value={postedValue}
              min={0}
              onChange={e => setPostedValue(e.target.value)}
            />
          </p>
          <button
            className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
              isLoading ? "loading" : ""
            }`}
            onClick={writeAsync}
          >
            {!isLoading && (
              <>
                Create Post <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
