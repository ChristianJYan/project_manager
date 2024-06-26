import { SignUp } from "~/app/_components/sign-up-form";
import { api } from "~/trpc/server";

export default function SignUpPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                Sign Up
            </h1>
            <SignUpBox />
        </main>
    )
}

async function SignUpBox() {
    const latestPost = await api.post.getLatest();
  
    return (
      <div className="w-full max-w-xs">
          <p className="truncate">Username</p>
        <SignUp />
      </div>
    );
  }