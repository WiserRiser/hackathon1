import { useState } from "react";
import Image from "next/image";
import { Signer } from "ethers";
import { useAccount, useContractWrite, usePrepareContractWrite, useSigner } from "wagmi";
import PersonhoodVerifications from "~~/components/PersonhoodVerifications";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

const Onboarding = () => {
  const [agreedToXMTP, setAgreedToXMTP] = useState(false);
  const [agreedToDonation, setAgreedToDonation] = useState(false);
  const [votingWeight, setVotingWeight] = useState(5);
  const { data: signer, /*isError,*/ isLoading } = useSigner();
  const { data: gameLogicContract } = useScaffoldContract({
    contractName: "GameLogic",
    signerOrProvider: signer as Signer,
  });

  const handleVotingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);

    if (isNaN(newValue)) {
      if (newValue >= 0 && newValue <= 10) {
        setVotingWeight(newValue);
      }
    }
  };

  const handleAgreeToXMTP = () => {
    setAgreedToXMTP(!agreedToXMTP);
  };

  const handleAgreeToDonation = () => {
    setAgreedToDonation(!agreedToDonation);
  };

  // Interact with game logic contracts

  const { address } = useAccount();

  const handleSubmission = async () => {
    if (gameLogicContract === null) {
      throw new Error("gameLogicContract is unexpectedly null.");
    }

    const defaultVoting = await gameLogicContract.setUserDefaultVoteWeight(address, votingWeight);
    console.log("defaultVoting:", defaultVoting);

    const defaultDonate = await gameLogicContract.setUserDefaultDonate(address, agreedToDonation);
    console.log("defaultDonate:", defaultDonate);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative  z-10 -mx-4 bg-[radial-gradient(164.75%_100%_at_50%_0%,#334155_0%,#0F172A_48.73%)] px-5 py-10 shadow-lg sm:mx-0 sm:rounded-2xl sm:px-10 max-w-2xl ">
        <h1 className="w-full text-center font-semibold text-2xl">Moderation Onboarding</h1>
        {/* Unique Person */}
        <h2 className="text-lg">Prove you&apos;re a unique person.</h2>
        <p className="opacity-40 pb-6 border-b-4 border-indigo-500 text-sm">
          We only want real humans to vote, this step helps create an equitable market! If you don&apos;t have an
          account, you can select a provider and create one now.
        </p>
        <div className="flex w-full justify-center">
          <PersonhoodVerifications />
        </div>
        {/* Prove your Age */}
        <h2 className="text-lg mt-8">Prove your age.</h2>
        <p className="opacity-40 pb-6 border-b-4 border-indigo-500 text-sm">
          We want to ensure you only moderate posts that fit your age demographic! As an over 18 verified user you will
          be consenting to moderating adult content.
        </p>
        <div className="flex flex-row w-full justify-around">
          <button onClick={() => console.log("clicked")}>
            <div className="relative -mx-5 mt-8 flex flex-col bg-slate-700/25 ring-1 ring-slate-700/50 sm:mx-0 sm:rounded-2xl h-32 w-32 justify-center items-center hover:bg-slate-700">
              {/* <PolygonIDVerifier publicServerURL={
                    process.env.REACT_APP_VERIFICATION_SERVER_PUBLIC_URL
                  }
                  localServerURL={
                    process.env.REACT_APP_VERIFICATION_SERVER_LOCAL_HOST_URL
                  }/> */}
              <Image
                src={"/assets/youngest_noun.svg"}
                alt="Badge"
                className="rounded-lg"
                width={60}
                height={60}
                priority
              />
              <p className="mt-2 mb-0">I am over 13</p>
            </div>
          </button>
          <button onClick={() => console.log("clicked")}>
            <div className="relative -mx-5 mt-8 flex flex-col bg-slate-700/25 ring-1 ring-slate-700/50 sm:mx-0 sm:rounded-2xl h-32 w-32 justify-center items-center hover:bg-slate-700">
              <Image
                src={"/assets/oldest_noun.svg"}
                alt="Badge"
                className="rounded-lg"
                width={60}
                height={60}
                priority
              />
              <p className="mt-2 mb-0">I am over 18</p>
            </div>
          </button>
        </div>
        <h2 className="text-lg mt-8">Additional perferences.</h2>
        <div className="flex flex-row items-end w-full justify-between">
          <div className="flex flex-col">
            <div className="flex flow-row items-center">
              <p className="text-md opacity-60 mr-4">Default vote weight:</p>
              <input
                className="h-8 relative flex flex-col bg-slate-700/25 ring-1 ring-slate-700/50 sm:mx-0 rounded-lg w-8 justify-center items-center text-center"
                type="text"
                placeholder="5"
                onChange={handleVotingChange}
              />
            </div>
            <div className="flex items-center mb-0">
              <input
                type="checkbox"
                id="agreeToDonations"
                checked={agreedToDonation}
                onChange={handleAgreeToDonation}
                className="mr-2"
              />
              <label htmlFor="agreeToDonations" className="text-sm">
                <p className="opacity-60">Donate my winnings by default</p>
              </label>
            </div>
            <div className="flex items-center mt-0">
              <input
                type="checkbox"
                id="agreeToXMTP"
                checked={agreedToXMTP}
                onChange={handleAgreeToXMTP}
                className="mr-2"
              />
              <label htmlFor="agreeToXMTP" className="text-sm">
                <p className="opacity-60">I agree to receive messages on XMTP</p>
              </label>
            </div>
          </div>
          <div className="h-full flex justify-start">
            <button
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 px-4 border-b-4 border-indigo-700 hover:border-indigo-500 rounded"
              onClick={handleSubmission}
            >
              Submit!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
