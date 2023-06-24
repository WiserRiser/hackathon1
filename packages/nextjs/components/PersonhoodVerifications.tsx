import { SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { StoreContext } from "./Store";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { log } from "console";
import { BigNumber } from "ethers";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import ContractAbi from "~~/abi/Contract.abi";
import { decode } from "~~/lib/wld";

const PersonhoodVerifications = () => {
  const { address } = useAccount();
  const [proof, setProof] = useState<ISuccessResult | null>(null);

  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR as `0x${string}`,
    abi: ContractAbi,
    enabled: proof != null && address != null,
    functionName: "verifyAndExecute",
    args: [
      address!,
      proof?.merkle_root ? decode<BigNumber>("uint256", proof?.merkle_root ?? "") : BigNumber.from(0),
      proof?.nullifier_hash ? decode<BigNumber>("uint256", proof?.nullifier_hash ?? "") : BigNumber.from(0),
      proof?.proof
        ? decode<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>(
            "uint256[8]",
            proof?.proof ?? "",
          )
        : [
            BigNumber.from(0),
            BigNumber.from(0),
            BigNumber.from(0),
            BigNumber.from(0),
            BigNumber.from(0),
            BigNumber.from(0),
            BigNumber.from(0),
            BigNumber.from(0),
          ],
    ],
  });

  useEffect(() => {
    console.log("config", config);
  }, [proof]);

  const { write } = useContractWrite(config);

  console.log(proof);
  return (
    <div className="relative -mx-5 mt-8 flex flex-col bg-slate-700/25 ring-1 ring-slate-700/50 sm:mx-0 sm:rounded-2xl overflow-hidden w-full">
      {/* World Id */}
      {proof ? (
        <button
          onClick={() => {
            if (write) {
              console.log("function is defined");
              write();
            }
          }}
        >
          submit tx
        </button>
      ) : (
        <IDKitWidget
          signal={address}
          action="your-action"
          onSuccess={(result: SetStateAction<ISuccessResult | null>) => {
            console.log(result);
            setProof(result);
          }}
          app_id={process.env.NEXT_PUBLIC_APP_ID!}
          // walletConnectProjectId="get_this_from_walletconnect_portal"
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
      )}
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
