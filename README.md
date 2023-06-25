# Wiser Riser

🧪 An open-source web3-based social media component set for scaling up moderator effort on sites with a lot of user-generated content.
This could be used in social media settings (similar to Reddit), in screening processes for quadratic funding community support rounds
(like a blend of Giveth and Gitcoin), and co-learning/review communities (e.g. around photography, writing, or much more).

⚙️ This was built using Scaffold-ETH 2 at [ETHGlobal Waterloo 2023](https://ethglobal.com/events/waterloo2023).

- Home Page
<img width="1511" alt="Screenshot 2023-06-25 at 4 01 33 AM" src="https://github.com/WiserRiser/hackathon1/assets/20705520/b1bb0a06-a523-48dc-a73d-2e4f57daf081">

- Onboarding users with WorldCoinID / Polygon ID
<img width="1505" alt="Screenshot 2023-06-25 at 4 03 14 AM" src="https://github.com/WiserRiser/hackathon1/assets/20705520/688c53b7-6100-4515-9161-d6bd52299d5c">

- Login via WorldcoinId
<img width="1502" alt="Screenshot 2023-06-25 at 4 03 39 AM" src="https://github.com/WiserRiser/hackathon1/assets/20705520/ae55314f-609f-4e98-b431-48206ea4180e">

Add Community and mod members
<img width="1503" alt="Screenshot 2023-06-25 at 4 04 25 AM" src="https://github.com/WiserRiser/hackathon1/assets/20705520/3007f58a-258c-4c94-9879-23c72deed2ef">

## How To Run

Before you begin, you need to install the following tools:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

In this directory, then run `yarn install`.

Then open three terminal windows in this directory.

In one, run `yarn chain` as a test blockchain.
In the second browser window, run `yarn start` and then visit `http://localhost:3000` in your browser.
In the third, run `yarn deploy` to deploy the test contracts.  If you want to deploy to a different network, use `yarn deploy --network target_network`. You may also wish to change the "targetNetwork" value in scaffold.config.ts.
To deploy elsewhere, you may need the environment variables ALCHEMY_API_KEY and DEPLOYER_PRIVATE_KEY set by renaming `.env.example` to `.env` and filling in required keys. `yarn generate` can get you a new random account and add the private key to that .env file.

You can do Etherscan verification with `yarn verify --network network_name` and you can deploy a frontend to vercel without type/lint checking by using `yarn vercel:yolo` & set `NEXT_PUBLIC_IGNORE_BUILD_ERROR` to `true` in a [environment variable](https://vercel.com/docs/concepts/projects/environment-variables).

For additional details, see the scaffold-eth documentation [as of the time it was forked](https://github.com/scaffold-eth/scaffold-eth-2/blob/d81a32b8ecb23f0cc3dbc0b695aab4fec5efd8ba/README.md) or [now](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/README.md).
