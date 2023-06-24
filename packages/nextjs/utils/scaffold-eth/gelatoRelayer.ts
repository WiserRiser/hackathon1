// import { useDeployedContractInfo, useScaffoldContract, useScaffoldContractWrite } from "../../hooks/scaffold-eth";
// import { GelatoRelay, SponsoredCallRequest } from "@gelatonetwork/relay-sdk";
// import { ethers } from "ethers";
// import { Signer } from "ethers";
// import { useContract, useProvider } from "wagmi";
// import { useSigner } from "wagmi";

// const relay = new GelatoRelay();

// Used to write to a contract and can be called in any function
// const { data: signer } = useSigner();
// const { data: yourContract } = useScaffoldContract({
//   contractName: "SimpleCounter",
//   signerOrProvider: signer as Signer,
// });

// export const setGreeting = async () => {
//   // Call the method in any function
//   await yourContract?.setGreeting("the greeting here");
// };

// // set up target address and function signature abi
// const counterAddress = "0x763D37aB388C5cdd2Fb0849d6275802F959fbF30";
// const abi = ["function increment()"];

// // generate payload using front-end provider such as MetaMask
// const provider = useProvider()
// // const signer = provider.getSigner();
// const contract = useContract({
//     address: counterAddress,
//     abi: abi,
//     signerOrProvider: provider,
//   });

// // const contract = new ethers.Contract(counterAddress, abi, signer);
// const { data } = await contract.populateTransaction.increment();

// export const { writeAsync } = useScaffoldContractWrite({
//   contractName: "SimpleCounter",
//   functionName: "increment",
//   // args: ["The value to set"],
//   // For payable functions, expressed in ETH
//   value: "0.01",
//   // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
//   blockConfirmations: 1,
//   // The callback function to execute when the transaction is confirmed.
//   onBlockConfirmation: txnReceipt => {
//     console.log("Transaction blockHash", txnReceipt.blockHash);
//   },
// });

// const request: SponsoredCallRequest = {
//   chainId: ,
//   target: counterAddress,
//   data: data,
// };

// Without a specific API key, the relay request will fail!
// Go to https://relay.gelato.network to get a testnet API key with 1Balance.
// Send the relay request using Gelato Relay!
// const relayResponse = await relay.sponsoredCall(request, apiKey);

// const counterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
// const abi = ["function increment()"];

// const provider = useProvider();
// const { data: deployedContractData } = useDeployedContractInfo("SimpleCounter");
// console.log(deployedContractData);
// const { data: signer, isError, isLoading } = useSigner();
// const { data: counterContract } = useScaffoldContract({
//   contractName: "SimpleCounter",
//   signerOrProvider: signer as Signer,
// });

// export const SimpleCount = async () => {
//   // Call the method in any function
//   let data = await counterContract?.increment();
//   console.log(data);
// };
// const request: SponsoredCallRequest = {
//   chainId: provider.network.chainId,
//   target: counter,
//   data: data,
// };
// const getSigner = async () => {
//   await useSigner();
// };
// getSigner();
