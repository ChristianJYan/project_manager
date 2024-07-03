import { validateRequest } from "~/app/actions/auth.actions";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    const { user } = await validateRequest();
	if (!user) {
		return redirect("/");
	}
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <h1>Hi, {user.username}!</h1>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                Admin Page
            </h1>
        </main>
    )
}