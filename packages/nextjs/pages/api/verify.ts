import type { NextApiRequest, NextApiResponse } from "next";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { gameLogic } from "~~/abi/GameLogic";

export type Reply = {
  code: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Reply>) {
  const { address } = useAccount();

  const { config, error } = usePrepareContractWrite({
    address: "0x05C98985118AA4B28ad2852cbA1dab283e445446",
    abi: gameLogic,
    functionName: "verifyUserWorldcoinOrb",
    args: [address],
  });

  const { write } = useContractWrite(config);

  const reqBody = {
    nullifier_hash: req.body.nullifier_hash,
    merkle_root: req.body.merkle_root,
    proof: req.body.proof,
    credential_type: req.body.credential_type,
    action: req.body.action,
    signal: req.body.signal,
  };

  fetch(`https://developer.worldcoin.org/api/v1/verify/${process.env.NEXT_PUBLIC_WLD_APP_ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  }).then(async verifyRes => {
    const wldResponse = await verifyRes.json();
    if (verifyRes.status == 200) {
      res.status(200).send({ code: wldResponse.code });

      // This is where you should perform backend actions based on the verified credential, such as setting a user as "verified" in a database

      //TODO: query to find smart contract and update contract through
      write?.();
    } else {
      res.status(400).send({ code: wldResponse.code });
    }
  });
}
