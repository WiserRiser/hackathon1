import { useEffect, useState } from "react";
import { GelatoRelay, SponsoredCallRequest } from "@gelatonetwork/relay-sdk";
import { ethers } from "ethers";
import { useProvider, useSigner } from "wagmi";

const Sponsored = () => {
  const relay = new GelatoRelay();
  const apiKey = "uAL9fLkeBLQQIDWdR4y15GIrnTWc_aWmE9iNYo_8Uko_";
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
      console.log("data", data);
      const request: SponsoredCallRequest = {
        chainId: provider.network.chainId,
        target: counterAddress,
        data: data,
      };
      console.log("========Request data========", request);
      const getRelayResponse = async () => {
        const relayResponse = await relay.sponsoredCall(request, apiKey);
        console.log("relayResponse", relayResponse);
        return relayResponse;
      };
      console.log("GetRelayResponse", getRelayResponse());
    }
  }, [data]);

  // Populate a relay request

  // Without a specific API key, the relay request will fail!
  // Go to https://relay.gelato.network to get a testnet API key with 1Balance.
  // Send the relay request using Gelato Relay!

  return (
    <div>
      <button onClick={() => increment()}>Click</button>
    </div>
  );
};

export default Sponsored;
