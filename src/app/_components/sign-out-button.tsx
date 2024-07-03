// src/app/_components/SignOutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { logout } from "~/app/actions/auth.actions";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await logout();
    
    router.push("/");
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-full bg-white/10 px-4 py-2 font-semibold transition hover:bg-white/20 text-blue-500"
    >
      Sign Out
    </button>
  );
}