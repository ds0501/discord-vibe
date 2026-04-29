import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const { isAuthenticated } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect("/servers");
  }

  return (
    <div className="flex h-full items-center justify-center bg-[#313338]">
      <div className="flex flex-col items-center gap-8 rounded-lg bg-[#2b2d31] px-8 py-10 shadow-xl w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5865f2]">
            <svg
              className="h-10 w-10 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Discord Vibe</h1>
          <p className="text-sm text-zinc-400">친구들과 대화하고 싶다면 로그인하세요</p>
        </div>

        {/* Login Button */}
        <LoginLink className="flex w-full items-center justify-center gap-2 rounded-md bg-[#5865f2] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-75">
          로그인
        </LoginLink>

        {/* Divider */}
        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-zinc-700" />
          <span className="text-xs text-zinc-500">또는</span>
          <div className="h-px flex-1 bg-zinc-700" />
        </div>

        {/* Register Button */}
        <LoginLink
          authUrlParams={{ prompt: "create" }}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-zinc-600 px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-400 hover:text-white"
        >
          계정 만들기
        </LoginLink>
      </div>
    </div>
  );
}
