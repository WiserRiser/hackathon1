//import Link from "next/link";
import { useState } from "react";
import type { NextPage } from "next";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
type SITE = 'betterReddit' | 'gitcoin' | 'pix';
type NETWORK = 'gnosis' | 'polygon' | 'linea';
const Home: NextPage = () => {
  const [site, setSite] = useState<SITE>("betterReddit");
  const [network, setNetwork] = useState<NETWORK>("gnosis");
  const [newCommunityName, setNewCommunityName] = useState("");
  const [mod1, setMod1] = useState("");
  const [mod2, setMod2] = useState("");
  const [mod3, setMod3] = useState("");
  const [mod4, setMod4] = useState("");
  const [mod5, setMod5] = useState("");
  const [rules, setRules] = useState("");
  const [deposit, setDeposit] = useState("1");

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    //TODO: Expand to use other parameters, create the multisig that owns the community ERC721,
    //mint the ERC721 and transfer it to the community,
    //ideally in one atomic transaction in our master contract.
    contractName: "YourContract",
    functionName: "setGreeting", //"createCommunity"
    args: [newCommunityName],
    value: deposit,
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
          Enter the addresses of the five mod team members here: These will be the co-owners of a Gnosis Safe or similar
          multisig which owns the community NFT.
          <p>The group can add/remove members later.</p>
          <p>
            {" Site: " /*TODO: Make this a drop-down selectlist from set of available sites*/}
            <input
              type="radio"
              id="siteBetterReddit"
              name="site"
              value="betterReddit"
              checked={site === 'betterReddit'}
              onChange={() => setSite('betterReddit')}
            /> {" Better Reddit "}
            <input
              type="radio"
              id="siteGitcoin"
              name="site"
              value="gitcoin"
              checked={site === 'gitcoin'}
              onChange={() => setSite('gitcoin')}
            /> {" Gitcoin Grants "}
            <input
              type="radio"
              id="sitePix"
              name="site"
              value="pix"
              checked={site === 'pix'}
              onChange={() => setSite('pix')}
            /> {" MegaPixels Photography "}
          </p>
          <p>
            Community name:{" "}
            <input
              style={{ color: "black" }}
              type="text"
              id="communityName"
              name="communityName"
              onChange={e => setNewCommunityName(e.target.value)}
            />
          </p>
          <p>
            Mod team member 1:{" "}
            <input
              style={{ color: "black" }}
              type="text"
              id="mod1"
              name="mod1"
              value={mod1}
              onChange={e => setMod1(e.target.value)}
            />
          </p>
          <p>
            Mod team member 2:{" "}
            <input
              style={{ color: "black" }}
              type="text"
              id="mod2"
              name="mod2"
              value={mod2}
              onChange={e => setMod2(e.target.value)}
            />
          </p>
          <p>
            Mod team member 3:{" "}
            <input
              style={{ color: "black" }}
              type="text"
              id="mod3"
              name="mod3"
              value={mod3}
              onChange={e => setMod3(e.target.value)}
            />
          </p>
          <p>
            Mod team member 4:{" "}
            <input
              style={{ color: "black" }}
              type="text"
              id="mod4"
              name="mod4"
              value={mod4}
              onChange={e => setMod4(e.target.value)}
            />
          </p>
          <p>
            Mod team member 5:{" "}
            <input
              style={{ color: "black" }}
              type="text"
              id="mod5"
              name="mod5"
              value={mod5}
              onChange={e => setMod5(e.target.value)}
            />
          </p>
          <p>
            Community rules (markdown likely to be supported):
            <br />
            <textarea
              rows={7}
              cols={100}
              id="rules"
              name="rules"
              value={rules}
              onChange={e => setRules(e.target.value)}
              style={{ color: "black" }}
          />
          </p>
          <p>
            {"Network: "}
            <input
              type="radio"
              id="networkGnosis"
              name="network"
              value="gnosis"
              checked={network === 'gnosis'}
              onChange={() => setNetwork('gnosis')}
            /> Gnosis{" "}
            <input
              type="radio"
              id="networkPolygon"
              name="network"
              value="polygon"
              checked={network === 'polygon'}
              onChange={() => setNetwork('polygon')}
            /> Polygon{" "}
            <input
              type="radio"
              id="networkLinea"
              name="network"
              value="linea"
              checked={network === 'linea'}
              onChange={() => setNetwork('linea')}
            /> Linea{" "}
          </p>
          <p>
            Deposit amount (xDAI/MATIC): {" "}
            <input
              style={{ color: "black" }}
              type="number"
              id="depositAmount"
              name="depositAmount"
              value={deposit}
              onChange={e => setDeposit(e.target.value)}
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
