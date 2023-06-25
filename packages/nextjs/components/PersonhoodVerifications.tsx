import Image from "next/image";
import SismoValidation from "./SismoValidation";
import { CredentialType, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { gameLogic } from "~~/abi/GameLogic";

// import { BigNumber } from "ethers";
// import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
// import ContractAbi from "~~/abi/Contract.abi";
// import { decode } from "~~/lib/wld";

const PersonhoodVerifications = () => {
  const handleProof = async (result: ISuccessResult) => {
    const reqBody = {
      merkle_root: result.merkle_root,
      nullifier_hash: result.nullifier_hash,
      proof: result.proof,
      credential_type: result.credential_type,
      action: process.env.NEXT_PUBLIC_WLD_ACTION_NAME,
      signal: "",
    };
    fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    }).then(async (res: Response) => {
      if (res.status == 200) {
        console.log("Successfully verified credential.");
      } else {
        throw new Error("Error: " + (await res.json()).code) ?? "Unknown error.";
      }
    });
  };

  const { address } = useAccount();

  const { config, error } = usePrepareContractWrite({
    address: "0x05C98985118AA4B28ad2852cbA1dab283e445446",
    abi: gameLogic,
    functionName: "verifyUserWorldcoinOrb",
    args: [address],
  });

  const { write } = useContractWrite(config);

  const onSuccess = (result: ISuccessResult, write: any) => {
    // performing a write function here due to time constraints

    console.log(address);
    write?.();
  };

  return (
    <div className="relative -mx-5 mt-8 flex flex-col bg-slate-700/25 ring-1 ring-slate-700/50 sm:mx-0 sm:rounded-2xl overflow-hidden w-full">
      {/* World Id */}
      <IDKitWidget
        action={process.env.NEXT_PUBLIC_WLD_ACTION_NAME!}
        onSuccess={(result: ISuccessResult) => {
          onSuccess(result, write);
        }}
        handleVerify={handleProof}
        app_id={process.env.NEXT_PUBLIC_WLD_APP_ID!}
        credential_types={[CredentialType.Orb]}
      >
        {({ open }) => (
          <button className="hover:bg-slate-700" onClick={open}>
            <div className="flex flex-row justify-start ml-4 items-center border-b-[1px] border-b-indigo-200/10 ">
              <Image
                src={"/assets/worldcoin_icon.png"}
                alt="Badge"
                className="invert"
                width={40}
                height={40}
                priority
              />
              <p className="font-semibold">Sign in Worldcoin</p>
            </div>
          </button>
        )}
      </IDKitWidget>
      {/* Sismo */}
      {/* <button className="hover:bg-slate-700" onClick={() => console.log("clicked")}>
        <div className="flex flex-row justify-center space-x-2 items-center">
          <Image src={"/assets/sismo_icon.png"} alt="Badge" className="" width={30} height={30} priority />
          <p className="font-semibold">Sismo</p>
        </div>
      </button> */}
      <SismoValidation />
    </div>
  );
};

export default PersonhoodVerifications;
