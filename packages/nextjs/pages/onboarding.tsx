import Image from "next/image";
import PersonhoodVerifications from "~~/components/PersonhoodVerifications";

const Onboarding = () => {
  return (
    <div className="relative  z-10 -mx-4 bg-[radial-gradient(164.75%_100%_at_50%_0%,#334155_0%,#0F172A_48.73%)] px-5 py-10 shadow-lg sm:mx-0 sm:rounded-2xl sm:px-10 max-w-2xl ">
      <h1 className="w-full text-center font-semibold text-2xl">Moderation Onboarding</h1>
      {/* Unique Person */}
      <h2 className="text-lg">Prove you&apos;re a unique person.</h2>
      <p className="opacity-20 pb-6 border-b-4 border-indigo-500 text-sm">
        We only want real humans to vote, this step helps create an equitable market! If you don&apos;t have an account, you
        can select a provider and create one now.
      </p>
      <div className="flex w-full justify-center">
        <PersonhoodVerifications />
      </div>
      {/* Prove your Age */}
      <h2 className="text-lg mt-8">Prove your age.</h2>
      <p className="opacity-20 pb-6 border-b-4 border-indigo-500 text-sm">
        We want to ensure you only moderate posts that fit your age demographic! As an over 18 verified user you will be
        consenting to moderating adult content.
      </p>
      <div className="flex flex-row w-full justify-around">
        <button onClick={() => console.log("clicked")}>
          <div className="relative -mx-5 mt-8 flex flex-col bg-slate-700/25 ring-1 ring-slate-700/50 sm:mx-0 sm:rounded-2xl h-32 w-32 justify-center items-center hover:bg-slate-700">
            <Image
              src={"/assets/youngest_noun.svg"}
              alt="Badge"
              className="rounded-lg"
              width={60}
              height={60}
              priority
            />
            <p className="mt-2 mb-0">I am over 13</p>
          </div>
        </button>
        <button onClick={() => console.log("clicked")}>
          <div className="relative -mx-5 mt-8 flex flex-col bg-slate-700/25 ring-1 ring-slate-700/50 sm:mx-0 sm:rounded-2xl h-32 w-32 justify-center items-center hover:bg-slate-700">
            <Image src={"/assets/oldest_noun.svg"} alt="Badge" className="rounded-lg" width={60} height={60} priority />
            <p className="mt-2 mb-0">I am over 18</p>
          </div>
        </button>
      </div>
      <h2 className="w-full text-center font-semibold text-2xl mt-8">Voting Settings</h2>
      <p>Default vote weight: </p>
      <input type="text" />
    </div>
  );
};

export default Onboarding;
