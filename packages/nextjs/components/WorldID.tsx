import { useCallback, useContext } from "react";
import dynamic from "next/dynamic";
import { StoreContext } from "./Store";
import { ISuccessResult } from "@worldcoin/idkit";

const WorldID = () => {
  const IDKitWidget = dynamic(() => import("@worldcoin/idkit").then(mod => mod.IDKitWidget), { ssr: false });
  const { store, setStore } = useContext(StoreContext);

  const handleProof = useCallback((result: ISuccessResult) => {
    return new Promise<void>(resolve => {
      setTimeout(() => resolve(), 3000);
      // NOTE: Example of how to decline the verification request and show an error message to the user
    });
  }, []);

  const onSuccess = (result: ISuccessResult) => {
    console.log(result);
    setStore({ ...store, isWorldIdVerified: true });
  };

  return (
    <IDKitWidget
      action="my_action"
      signal="my_signal"
      onSuccess={onSuccess}
      handleVerify={handleProof}
      app_id="app_45d56c05038d17585474349328cf4aab"
      // walletConnectProjectId="get_this_from_walletconnect_portal"
    >
      {({ open }) => (
        <button className="p-3 rounded-lg bg-blue-500 max-w-[6rem]" onClick={open}>
          Moderate
        </button>
      )}
    </IDKitWidget>
  );
};

export default WorldID;
