export const data = {
    "id": "7f38a193-0918-4a48-9fac-36adfdb8b542",
    "typ": "application/iden3comm-plain-json",
    "type": "https://iden3-communication.io/proofs/1.0/contract-invoke-request",
    "thid": "7f38a193-0918-4a48-9fac-36adfdb8b542",
    "body": {
        "reason": "voting participation",
        "transaction_data": {
            "contract_address": "0x1C30DC7674e5Fd4f6154152E018b92ff29E66B41",
            "method_id": "b68967e2",
            "chain_id": 80001,
            "network": "polygon-mumbai"
        },
        "scope": [
            {
                "id": 1,
                "circuitId": "credentialAtomicQuerySigV2OnChain",
                "query": {
                    "allowedIssuers": [
                        "*"
                    ],
                    "context": "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld",
                    "credentialSubject": {
                        "birthday": {
                            "$lt": 20050625
                        }
                    },
                    "type": "KYCAgeCredential"
                }
            }
        ]
    }
} as const;
