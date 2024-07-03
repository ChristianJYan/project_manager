import { redirect } from "next/navigation";
import { SignIn} from "~/app/_components/sign-in-form";
import { validateRequest } from "~/app/actions/auth.actions";
import { api } from "~/trpc/server";
import Link from "next/link";

export default async function SignInPage() {
    const { user } = await validateRequest();
	if (user) {
		return redirect("/");
	}
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                Sign In
            </h1>
            <SignInBox />
            <Link href="/sign-up" className="px-4 py-2 font-semibold transition hover:bg-white/20 rounded-full text-blue-500">
              Sign Up
            </Link>
        </main>
    )
}

async function SignInBox() {
    const latestPost = await api.post.getLatest();
  
    return (
      <div className="w-full max-w-xs">
          <p className="truncate">Username</p>
        <SignIn />
      </div>
    );
  }