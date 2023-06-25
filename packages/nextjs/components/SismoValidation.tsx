"use client";

import { useEffect, useState } from "react";
import {
  AuthType,
  ClaimType,
  SismoConnectButton,
  SismoConnectConfig,
  SismoConnectResponse,
} from "@sismo-core/sismo-connect-react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { gameLogic } from "~~/abi/GameLogic";

/* ***********************  Sismo Connect Config *************************** */
const sismoConnectConfig: SismoConnectConfig = {
  appId: "0xf4977993e52606cfd67b7a1cde717069",
  vault: {
    // For development purposes insert the identifier that you want to impersonate here
    // Never use this in production
    impersonate: ["dhadrien.sismo.eth", "github:dhadrien", "twitter:dhadrien_"],
  },
};

export default function SismoValidation() {
  /* ***********************  Application states *************************** */
  const [loading, setLoading] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string | null>(null);

  const [user, setUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [userInput, setUserInput] = useState<string>("");

  function onUserInput(e: React.ChangeEvent<HTMLInputElement>) {
    setUserInput(e.target.value);
    localStorage.setItem("user-input", e.target.value);
  }

  useEffect(() => {
    const storedUserInput = localStorage.getItem("user-input");
    if (storedUserInput) setUserInput(storedUserInput);
  }, []);

  const { address } = useAccount();

  const { config, error } = usePrepareContractWrite({
    address: "0x05C98985118AA4B28ad2852cbA1dab283e445446",
    abi: gameLogic,
    functionName: "verifyUserSismo",
    args: [address],
  });

  const { write } = useContractWrite(config);

  const updateContract = async () => {
    console.log(address);
    write?.();
  };

  async function onSismoConnectResponse(response: SismoConnectResponse) {
    setLoading(true);

    try {
      const res = await fetch("/api/verifySismo", {
        method: "POST",
        body: JSON.stringify(response),
      });
      if (!res.ok) {
        const customError = await res.json();
        setCustomError(customError);
        return;
      }
      const user = await res.json();
      setUser(user);
      updateContract();
    } catch (err: any) {
      setCustomError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // For Testing
  function resetApp() {
    setUser(null);
    setUserInput("");
    setLoading(false);
    setCustomError(null);
    localStorage.removeItem("user-input");
    const url = new URL(window.location.href);
    url.searchParams.delete("sismoConnectResponseCompressed");
    window.history.replaceState({}, "", url.toString());
  }

  return (
    <>
      <SismoConnectButton
        // the client config created
        config={sismoConnectConfig}
        // the auth request we want to make
        // here we want the proof of a Sismo Vault ownership from our users
        auths={[{ authType: AuthType.VAULT }, { authType: AuthType.EVM_ACCOUNT }]}
        claims={[
          // we ask the user to prove that he has a gitcoin passport with a score above 15
          // https://factory.sismo.io/groups-explorer?search=0x1cde61966decb8600dfd0749bd371f12
          {
            groupId: "0x1cde61966decb8600dfd0749bd371f12",
            claimType: ClaimType.GTE,
            value: 15,
          },
          // we ask the user to prove that he is part of the Sismo Contributors group and selectively prove its level
          // https://factory.sismo.io/groups-explorer?search=0xe9ed316946d3d98dfcd829a53ec9822e
          {
            groupId: "0xe9ed316946d3d98dfcd829a53ec9822e",
            isSelectableByUser: true,
          },
          // we optionally ask the user to prove that he is a long time Sismo user
          {
            groupId: "0x43a2d7bce5bd0a0664b855f0b1a06052",
            isOptional: true,
          },
        ]}
        // we ask the user to sign a message
        signature={{ message: userInput, isSelectableByUser: true }}
        // onResponseBytes calls a 'setResponse' function with the responseBytes returned by the Sismo Vault
        onResponse={(response: SismoConnectResponse) => {
          onSismoConnectResponse(response);
        }}
        verifying={loading}
      />
    </>
  );
}
