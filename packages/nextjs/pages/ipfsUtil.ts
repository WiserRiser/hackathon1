import { create } from 'ipfs-http-client';

export const storeInIPFS = async (data: string): Promise<string> => {
  const auth =
    'Basic ' + Buffer.from(process.env.INFURA_ID + ':' + process.env.INFURA_SECRET_KEY).toString('base64');
  const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });

  const { cid } = await ipfs.add(data);

  const ipfsHash = cid.toString();
  console.log('IPFS Hash: ' + ipfsHash);
  return ipfsHash;
};