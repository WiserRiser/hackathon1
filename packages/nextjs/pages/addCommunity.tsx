import { useState } from "react";
import { User } from "../components/icons/user";
import contracts from "../generated/deployedContracts";
import { storeInIPFS } from "./ipfsUtil";
import * as dotenv from "dotenv";
import { Signer, ethers } from "ethers";
import type { NextPage } from "next";
import { useNetwork, useSigner, useSwitchNetwork } from "wagmi";
//import Link from "next/link";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

dotenv.config();

//SITE values: betterReddit = 1, qf = 2, pix = 3
type SITE = 1 | 2 | 3;
type NETWORK = "gnosis" | "polygon" | "linea";
const Home: NextPage = () => {
  const [site, setSite] = useState<SITE>(1);
  const [network, setNetwork] = useState<NETWORK>("gnosis");
  const [newCommunityName, setNewCommunityName] = useState("");
  const [mod1, setMod1] = useState("");
  const [mod2, setMod2] = useState("");
  const [mod3, setMod3] = useState("");
  const [mod4, setMod4] = useState("");
  const [mod5, setMod5] = useState("");
  const [rules, setRules] = useState("");
  const [restrictPostingChecked, setRestrictPostingChecked] = useState<boolean>(false);
  const [restrictVotingChecked, setRestrictVotingChecked] = useState<boolean>(false);
  const [sponsorPosts, setSponsorPosts] = useState<boolean>(false);
  const [gateAddress, setGateAddress] = useState("");
  const [deposit, setDeposit] = useState("1");
  const { switchNetwork, chains } = useSwitchNetwork();
  const { chain } = useNetwork();

  const { data: signer, /*isError,*/ isLoading } = useSigner();
  const { data: gameLogicContract } = useScaffoldContract({
    contractName: "GameLogic",
    signerOrProvider: signer as Signer,
  });
  const storeRulesInIPFS = async function (rules: string): Promise<string> {
    const rulesCid = await storeInIPFS(rules);
    console.log("rules CID: " + rulesCid);
    return rulesCid;
  };
  const submitForm = async function () {
    const currentNetwork = (await signer?.provider?.getNetwork())?.chainId;
    if (typeof currentNetwork === "undefined") {
      throw new Error("Current network is unexpectedly undefined.");
    }
    //@ts-ignore for now because keys of contracts are defined as const
    const gameLogicContractAddress = contracts[currentNetwork][0].contracts["GameLogic"].address;
    console.log("Contract is deployed at ", gameLogicContractAddress);
    if (gameLogicContract === null) {
      throw new Error("gameLogicContract is unexpectedly null.");
    }
    const rulesIPFSHash = await storeRulesInIPFS(rules);
    //TODO: Use the network state to decide which network to do this on.
    let gateAddressTrimmed = gateAddress.trim();
    if (gateAddressTrimmed.length === 0) {
      gateAddressTrimmed = "0x0000000000000000000000000000000000000000";
    }
    const communityCreation = await gameLogicContract.createCommunity(
      site,
      newCommunityName,
      rulesIPFSHash,
      restrictPostingChecked,
      restrictVotingChecked,
      sponsorPosts,
      gateAddressTrimmed,
      [mod1.trim(), mod2.trim(), mod3.trim(), mod4.trim(), mod5.trim()],
      {
        value: ethers.utils.parseUnits(deposit, "ether"),
      },
    );
    console.log("CommunityCreation:", communityCreation);
  };

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
        <div className="flex w-3/4 bg-slate-950 m-auto gap-8 rounded-xl">
          <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
            Enter the addresses of the five mod team members here: These will be the co-owners of a Gnosis Safe or
            similar multisig which owns the community NFT.
            <p>The group can add/remove members later.</p>
            <div className="flex flex-wrap gap-4 my-4 ">
              {" Site: " /*TODO: Make this a drop-down selectlist from set of available sites*/}
              <input
                type="radio"
                id="siteBetterReddit"
                name="site"
                value={1}
                checked={site === 1}
                onChange={() => setSite(1)}
              />{" "}
              {" Better Reddit "}
              <input
                type="radio"
                id="siteQF"
                name="site"
                value={2}
                checked={site === 2}
                onChange={() => setSite(2)}
              />{" "}
              {" Quadratic Funding Friends "}
              <input
                type="radio"
                id="sitePix"
                name="site"
                value={3}
                checked={site === 3}
                onChange={() => setSite(3)}
              />{" "}
              {" MegaPixels Photography "}
              <br />
              <em>
                If your site isn&rsquo;t on this list and you would like it to be, please{" "}
                <a href="mailto:sales@wiserriser.com">reach out by clicking here</a>.
              </em>
            </div>
            <div className="flex gap-3">
              <p className="text-2xl">Community name:</p>
              <input
                className="h-10 w-96 bg-base-300 px-2 border-b-2 border-white text-white outline-0"
                style={{ color: "white", marginBottom: "-10px !important" }}
                type="text"
                id="communityName"
                name="communityName"
                value={newCommunityName}
                onChange={e => setNewCommunityName(e.target.value)}
              />
            </div>
            <p className="flex items-center gap-2">
              <User />
              Mod member 1:
              <input
                className="rounded-md h-10 w-[450px] bg-slate-950 px-2 outline-0"
                type="text"
                id="mod1"
                name="mod1"
                value={mod1}
                onChange={e => setMod1(e.target.value)}
              />
            </p>
            <p className="flex items-center gap-2">
              <User />
              Mod member 2:
              <input
                className="rounded-md h-10 w-[450px] bg-slate-950 px-2 outline-0"
                type="text"
                id="mod2"
                name="mod2"
                value={mod2}
                onChange={e => setMod2(e.target.value)}
              />
            </p>
            <p className="flex items-center gap-2">
              <User />
              Mod member 3:
              <input
                className="rounded-md h-10 w-[450px] bg-slate-950 px-2 outline-0"
                type="text"
                id="mod3"
                name="mod3"
                value={mod3}
                onChange={e => setMod3(e.target.value)}
              />
            </p>
            <p className="flex items-center gap-2">
              <User />
              Mod member 4:
              <input
                className="rounded-md h-10 w-[450px] bg-slate-950 px-2 outline-0"
                type="text"
                id="mod4"
                name="mod4"
                value={mod4}
                onChange={e => setMod4(e.target.value)}
              />
            </p>
            <p className="flex items-center gap-2">
              <User />
              Mod member 5:
              <input
                className="rounded-md h-10 w-[450px] bg-slate-950 px-2 outline-0"
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
              <br />
              <textarea
                className="rounded-md w-[450px] bg-slate-950 px-2 outline-0"
                rows={7}
                cols={100}
                id="rules"
                name="rules"
                value={rules}
                onChange={e => setRules(e.target.value)}
              />
            </p>
            <p>
              {"Restrict "}
              <input
                type="checkbox"
                id="restrictPosting"
                name="restrictPosting"
                checked={restrictPostingChecked}
                onChange={e => setRestrictPostingChecked(e.target.checked)}
              />{" "}
              {" posting and/or "}
              <input
                type="checkbox"
                id="restrictVoting"
                name="restrictVoting"
                checked={restrictVotingChecked}
                onChange={e => setRestrictVotingChecked(e.target.checked)}
              />
              {" voting to holders of tokens in this contract:  "}
              <input
                style={{ width: "30em", marginTop: "10px" }}
                type="text"
                id="gateAddress"
                name="gateAddress"
                value={gateAddress}
                onChange={e => setGateAddress(e.target.value)}
              />
            </p>
            <p>
              <input
                type="checkbox"
                id="sponsorPosts"
                name="sponsorPosts"
                checked={sponsorPosts}
                onChange={e => setSponsorPosts(e.target.checked)}
              />
              {" Sponsor post and comment creation in this community."}
            </p>
            <p>
              {"Network: "}
              <input
                type="radio"
                id="networkGnosis"
                name="network"
                value="gnosis"
                checked={network === "gnosis"}
                onChange={() => {
                  setNetwork("gnosis");
                  switchNetwork?.(1);
                }}
              />{" "}
              Gnosis{" "}
              <input
                type="radio"
                id="networkPolygon"
                name="network"
                value="polygon"
                checked={network === "polygon"}
                onChange={() => {
                  setNetwork("polygon");
                  switchNetwork?.(1);
                }}
              />{" "}
              Polygon{" "}
              <input
                type="radio"
                id="networkLinea"
                name="network"
                value="linea"
                checked={network === "linea"}
                onChange={() => setNetwork("linea")}
              />{" "}
              Linea{" "}
            </p>
            <p>
              Deposit amount (xDAI/MATIC/ETH):{" "}
              <input
                className="rounded-md h-10 w-14 bg-slate-200 px-2"
                style={{ color: "black" }}
                type="number"
                id="depositAmount"
                name="depositAmount"
                value={deposit}
                min={0}
                onChange={e => setDeposit(e.target.value)}
              />
            </p>
            <button
              className={`btn btn-primary bg-black rounded-full capitalize font-normal font-white w-30 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
                isLoading ? "loading" : ""
              }`}
              onClick={submitForm}
            >
              {!isLoading && (
                <>
                  Create Community <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
