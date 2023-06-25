import { SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { StoreContext } from "./Store";
import { CredentialType, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";

// import { BigNumber } from "ethers";
// import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
// import ContractAbi from "~~/abi/Contract.abi";
// import { decode } from "~~/lib/wld";

const PersonhoodVerifications = () => {
  // const { address } = useAccount();
  // const [proof, setProof] = useState<ISuccessResult | null>(null);

  // const { config } = usePrepareContractWrite({
  //   address: process.env.NEXT_PUBLIC_CONTRACT_ADDR as `0x${string}`,
  //   abi: ContractAbi,
  //   enabled: proof != null && address != null,
  //   functionName: "verifyAndExecute",
  //   args: [
  //     address!,
  //     proof?.merkle_root ? decode<BigNumber>("uint256", proof?.merkle_root ?? "") : BigNumber.from(0),
  //     proof?.nullifier_hash ? decode<BigNumber>("uint256", proof?.nullifier_hash ?? "") : BigNumber.from(0),
  //     proof?.proof
  //       ? decode<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>(
  //           "uint256[8]",
  //           proof?.proof ?? "",
  //         )
  //       : [
  //           BigNumber.from(0),
  //           BigNumber.from(0),
  //           BigNumber.from(0),
  //           BigNumber.from(0),
  //           BigNumber.from(0),
  //           BigNumber.from(0),
  //           BigNumber.from(0),
  //           BigNumber.from(0),
  //         ],
  //   ],
  // });

  // const { write } = useContractWrite(config);

  const onSuccess = (result: ISuccessResult) => {
    // This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
  };

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

  return (
    <div className="relative -mx-5 mt-8 flex flex-col bg-slate-700/25 ring-1 ring-slate-700/50 sm:mx-0 sm:rounded-2xl overflow-hidden w-full">
      {/* World Id */}
      <IDKitWidget
        action={process.env.NEXT_PUBLIC_WLD_ACTION_NAME!}
        onSuccess={onSuccess}
        handleVerify={handleProof}
        app_id={process.env.NEXT_PUBLIC_WLD_APP_ID!}
        credential_types={[CredentialType.Orb]}
      >
        {({ open }) => (
          <button className="hover:bg-slate-700" onClick={open}>
            <div className="flex flex-row justify-center items-center border-b-[1px] border-b-indigo-200/10 ">
              <Image src={"/assets/worldcoin_icon.png"} alt="Badge" className="" width={40} height={40} priority />
              <p className="font-semibold">Worldcoin</p>
            </div>
          </button>
        )}
      </IDKitWidget>
      {/* Sigmo */}
      <button className="hover:bg-slate-700" onClick={() => console.log("clicked")}>
        <div className="flex flex-row justify-center space-x-2 items-center">
          <Image src={"/assets/sismo_icon.png"} alt="Badge" className="" width={30} height={30} priority />
          <p className="font-semibold">Sigmo</p>
        </div>
      </button>
    </div>
  );
};

export default PersonhoodVerifications;
