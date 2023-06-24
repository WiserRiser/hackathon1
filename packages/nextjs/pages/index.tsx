import Link from "next/link";
import type { NextPage } from "next";
import { MagnifyingGlassIcon, PencilSquareIcon, SparklesIcon, UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import WorldID from "~~/components/WorldID";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <WorldID />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">WiserRiser</span>
          </h1>
          <p className="text-center text-lg">
            A hackathon project seeking to scale up community-building moderators&apos; efforts!
          </p>
          <p className="text-center text-lg" style={{ fontStyle: "italic" }}>
            This is a hackathon project which has not reached maturity for further use.
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <UserIcon className="h-8 w-8 fill-secondary" />
              <p>
                <Link href="/onboarding" passHref className="link">
                  Sign up / verify your account & update settings here
                </Link>
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <UserGroupIcon className="h-8 w-8 fill-secondary" />
              <p>
                <Link href="/addCommunity" passHref className="link">
                  Add a new community here
                </Link>
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <PencilSquareIcon className="h-8 w-8 fill-secondary" />
              <p>
                <Link href="/addPost" passHref className="link">
                  Add a post to an existing community here.
                </Link>{" "}
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                <Link href="/posts" passHref className="link">
                  View and vote on an individual post here.
                </Link>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
