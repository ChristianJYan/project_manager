//import { AddMember } from "~/app/_components/add-member";
import TeamList from "~/app/_components/list-teams";

export default async function TeamPage() {

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-[5rem]">
                Your teams.
            </h1>
            <div className="w-full max-w-xs pt-8">
                <TeamList />
            </div>
        </main>
    )
}