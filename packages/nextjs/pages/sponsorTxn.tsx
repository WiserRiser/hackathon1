import { useEffect, useState } from "react";
import { GelatoRelay, SponsoredCallRequest } from "@gelatonetwork/relay-sdk";
import { ethers } from "ethers";
import { useProvider, useSigner } from "wagmi";

const Sponsored = () => {
  const relay = new GelatoRelay();
  const apiKey = process.env.GELATO_API_KEY;
  const { data: signer } = useSigner();
  const provider = useProvider();
  const [data, setData] = useState();

  const counterAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
  const abi = ["function increment()"];
  const contract = new ethers.Contract(counterAddress, abi, signer as ethers.Signer);
  console.log(contract);

  const increment = async () => {
    const { data } = await contract.increment();
    setData(data);
  };

  useEffect(() => {
    if (data) {
      const request: SponsoredCallRequest = {
        chainId: provider.network.chainId,
        target: counterAddress,
        data: data,
      };
      console.log("========Request data========", request);
      const getRelayResponse = async () => {
        const relayResponse = await relay.sponsoredCall(request, apiKey!);
        return relayResponse;
      };
      console.log("GetRelayResponse", getRelayResponse());
    }
  }, [data]);

  return (
    <div>
      <button onClick={() => increment()}>Click</button>
    </div>
  );
};

export default Sponsored;
