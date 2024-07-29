import { validateRequest } from "~/app/actions/auth.actions";
import { redirect } from "next/navigation";
import { CreateTeam } from "~/app/_components/create-team";

export default async function CreateTeamPage() {
    const { user } = await validateRequest();
	if (!user) {
		return redirect("/");
	}
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                Create a new Team.
            </h1>
            <div className="w-full max-w-xs">
            <CreateTeam />
          </div>
        </main>
    )
}