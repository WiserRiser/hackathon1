//import Link from "next/link";
import { useState } from "react";
import type { NextPage } from "next";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [newCommunityName, setNewCommunityName] = useState("");

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    //TODO: Expand to use other parameters, create the multisig that owns the community ERC721,
    //mint the ERC721 and transfer it to the community,
    //ideally in one atomic transaction in our master contract.
    contractName: "YourContract",
    functionName: "setGreeting", //"createCommunity"
    args: [newCommunityName],
    value: "0.01",
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
            <span className="block text-4xl font-bold">Create A Community</span>
          </h1>
          <p className="text-center text-lg">
            To create a community, you will need to have a mod team of at least 5 people, each of whom have a distinct
            Worldcoin (or in the future, Sismo Connect) proof-of-personhood.
          </p>
          <p className="text-center text-lg">
            You will also need a deposit amount which is used to sponsor gas fees in the community. In the future,
            crowdfunding functionality for that deposit can be added.
          </p>
        </div>
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          Enter the addresses of the five mod team members here: These will be the co-owners of a Gnosis Safe. The group
          can add/remove members later.
          <p>
            Community name:{" "}
            <input
              type="text"
              id="communityName"
              name="communityName"
              onChange={e => setNewCommunityName(e.target.value)}
            />
          </p>
          <p>
            Mod team member 1: <input type="text" id="mod1" name="mod1" />
          </p>
          <p>
            Mod team member 2: <input type="text" id="mod2" name="mod2" />
          </p>
          <p>
            Mod team member 3: <input type="text" id="mod3" name="mod3" />
          </p>
          <p>
            Mod team member 4: <input type="text" id="mod4" name="mod4" />
          </p>
          <p>
            Mod team member 5: <input type="text" id="mod5" name="mod5" />
          </p>
          <p>
            Community rules (markdown likely to be supported):
            <br />
            <textarea rows={7} cols={100} id="rules" name="rules" />
          </p>
          <p>
            Network: <input type="radio" id="networkGnosis" name="network" value="gnosis" /> Gnosis{" "}
            <input type="radio" id="networkPolygon" name="network" value="polygon" /> Polygon{" "}
          </p>
          <p>
            Deposit amount (xDAI/MATIC) <input type="text" id="depositAmount" name="depositAmount" />
          </p>
          <button
            className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
              isLoading ? "loading" : ""
            }`}
            onClick={writeAsync}
          >
            {!isLoading && (
              <>
                Create Community <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
