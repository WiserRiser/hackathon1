import { useEffect, useState } from "react";
import { GelatoRelay, SponsoredCallRequest } from "@gelatonetwork/relay-sdk";
import Safe, { EthersAdapter, getSafeContract } from "@safe-global/protocol-kit";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import { MetaTransactionData, MetaTransactionOptions, OperationType } from "@safe-global/safe-core-sdk-types";
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

  const initSponsorTransaction = async () => {
    const RPC_URL = "https://eth-goerli.alchemyapi.io/v2/oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const safeAddress = "0xE9714316A8AD987eb97068A6A7c831e7897Da628"; // Safe from which the transaction will be sent
    const chainId = 56;

    // Any address can be used for destination. In this example, we use vitalik.eth
    const destinationAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const withdrawAmount = ethers.utils.parseUnits("0.005", "ether").toString();

    // Usually a limit of 21000 is used but for smart contract interactions, you can increase to 100000 because of the more complex interactions.
    const gasLimit = "100000";

    // Create a transaction object
    const safeTransactionData: MetaTransactionData = {
      to: destinationAddress,
      data: "0x", // leave blank for native token transfers
      value: withdrawAmount,
      operation: OperationType.Call,
    };
    const options: MetaTransactionOptions = {
      gasLimit,
      isSponsored: true,
    };

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    const safeSDK = await Safe.create({
      ethAdapter,
      safeAddress,
    });

    const relayKit = new GelatoRelayPack("uAL9fLkeBLQQIDWdR4y15GIrnTWc_aWmE9iNYo_8Uko_");

    const safeTransaction = await safeSDK.createTransaction({ safeTransactionData });

    const signedSafeTx = await safeSDK.signTransaction(safeTransaction);
    const safeSingletonContract = await getSafeContract({
      ethAdapter,
      safeVersion: await safeSDK.getContractVersion(),
    });

    const encodedTx = safeSingletonContract.encode("execTransaction", [
      signedSafeTx.data.to,
      signedSafeTx.data.value,
      signedSafeTx.data.data,
      signedSafeTx.data.operation,
      signedSafeTx.data.safeTxGas,
      signedSafeTx.data.baseGas,
      signedSafeTx.data.gasPrice,
      signedSafeTx.data.gasToken,
      signedSafeTx.data.refundReceiver,
      signedSafeTx.encodedSignatures(),
    ]);

    const relayTransaction = {
      target: safeAddress,
      encodedTransaction: encodedTx,
      chainId,
      options,
    };
    const response = await relayKit.relayTransaction(relayTransaction);

    console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`);
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
      <button onClick={() => initSponsorTransaction()}>Sponsor Transaction</button>
    </div>
  );
};

export default Sponsored;
