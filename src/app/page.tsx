import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";
import { validateRequest } from "~/app/actions/auth.actions";
import { SignOutButton } from "~/app/_components/sign-out-button";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const { user } = await validateRequest();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        {user ? (
            <>
              Welcome <span className="text-[hsl(280,100%,70%)]">{user.username}</span>
            </>
          ) : (
            <>
              Not <span className="text-[hsl(280,100%,70%)]">Signed</span> In
            </>
          )}
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>
        </div>
        <div className="fixed top-0 right-0 p-4">
          {user ? (
            <SignOutButton />
          ) : (
            <Link href="/sign-in" className="rounded-full bg-white/10 px-4 py-2 font-semibold transition hover:bg-white/20 text-blue-500">
              Sign In
            </Link>
          )}
        </div>

      </div>
    </main>
  );
}

async function CrudShowcase() {
  const latestPost = await api.post.getLatest();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}