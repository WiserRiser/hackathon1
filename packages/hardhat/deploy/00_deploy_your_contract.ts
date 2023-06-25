import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { unlock } from "hardhat";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("YourContract", {
    from: deployer,
    // Contract constructor arguments
    args: [deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  await deploy("Counter", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  const deployedCommunityToken = await deploy("CommunityToken", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const deployedVoteToken = await deploy("VoteToken", {
    from: deployer,
    // Contract constructor arguments
    args: [42000000], //42MM total supply
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const deployedPostToken = await deploy("PostToken", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
  console.log('Deployed tokens. About to deploy Users.');
  const deployedUsers = await deploy("Users", {
    from: deployer,
    // Contract constructor arguments
    args: [deployedVoteToken.address],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
  console.log('Deployed Users. About to deploy GameLogic.');
  const deployedGameLogic = await deploy("GameLogic", {
    from: deployer,
    // Contract constructor arguments
    args: [deployedCommunityToken.address, deployedVoteToken.address, deployedPostToken.address, deployedUsers.address],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
  console.log('Deployed GameLogic.');
  const communityToken = await hre.ethers.getContractAt(
    deployedCommunityToken.abi,
    deployedCommunityToken.address,
    deployer,
  );
  await communityToken.transferOwnership(deployedGameLogic.address);
  const voteToken = await hre.ethers.getContractAt(deployedVoteToken.abi, deployedVoteToken.address, deployer);
  await voteToken.transferOwnership(deployedGameLogic.address);
  const postToken = await hre.ethers.getContractAt(deployedPostToken.abi, deployedPostToken.address, deployer);
  await postToken.transferOwnership(deployedGameLogic.address);
  console.log('Transferred ownership of token contracts.');
  // Get the deployed contract
  // const yourContract = await hre.ethers.getContract("YourContract", deployer);
  await setRequest(hre, deployedGameLogic.address);

  //https://docs.unlock-protocol.com/tutorials/smart-contracts/deploying-locally
  //has these first two but they don't appear in the Typescript typings
  //await unlock.deployUnlock(); //deploys the Unlock contract
  //await unlock.deployPublicLock(); //deploys the template
  await unlock.deployProtocol(); //deploys the whole protocol, only on localhost
  await unlock.createLock({
    expirationDuration: 60 * 60 * 24 * 7, // 7 days
    currencyContractAddress: null, // null for ETH or erc20 address
    keyPrice: "1000000000000", // in wei
    //maxNumberOfKeys: 10,
    name: "An Example Lock",
  });
};

const Operators = {
  NOOP : 0, // No operation, skip query verification in circuit
  EQ : 1, // equal
  LT : 2, // less than
  GT : 3, // greater than
  IN : 4, // in
  NIN : 5, // not in
  NE : 6   // not equal
}

async function setRequest(
    hre: HardhatRuntimeEnvironment,
    verifierAddress: string,
  ) { //address of just-deployed contract

  // you can run https://go.dev/play/p/rnrRbxXTRY6 to get schema hash and claimPathKey using YOUR schema
  const schemaBigInt = "74977327600848231385663280181476307657"

   // merklized path to field in the W3C credential according to JSONLD  schema e.g. birthday in the KYCAgeCredential under the url "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld"
  const schemaClaimPathKey = "20376033832371109177683048456014525905119173674985843915445634726167450989630"

  const requestId = 1;

  const query = {
    schema: schemaBigInt,
    claimPathKey  : schemaClaimPathKey,
    operator: Operators.LT, // operator
    value: [20050625, ...new Array(63).fill(0).map(i => 0)], // for operators 1-3 only first value matters
    };

  const erc20Verifier = await hre.ethers.getContractAt("ERC20Verifier", verifierAddress);
  const validatorAddress = "0xF2D4Eeb4d455fb673104902282Ce68B9ce4Ac450"; // sig validator
  // const validatorAddress = "0x3DcAe4c8d94359D31e4C89D7F2b944859408C618"; // mtp validator

  try {
    console.log("Setting request for age verification");
    await erc20Verifier.setZKPRequest(
        requestId,
        validatorAddress,
        query.schema,
        query.claimPathKey,
        query.operator,
        query.value
    );
    console.log("Request set");
  } catch (e) {
    console.log("error: ", e);
  }
}

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
