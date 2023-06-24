const contracts = {
  5: [
    {
      chainId: "5",
      name: "goerli",
      contracts: {
        SimpleCounter: {
          address: "0x7D1916883d9f6D42Ff0ecAeB9ce90CC08295fD2A",
          abi: [
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "newCounterValue",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "msgSender",
                  type: "address",
                },
              ],
              name: "IncrementCounter",
              type: "event",
            },
            {
              inputs: [],
              name: "counter",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "increment",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
