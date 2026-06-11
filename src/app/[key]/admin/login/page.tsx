import { notFound } from "next/navigation";
import LoginForm from "./LoginForm";

interface Props {
  params: Promise<{ key: string }>;
}

export default async function LoginPage({ params }: Props) {
  const { key } = await params;

  if (key !== process.env.ADMIN_KEY) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-neutral-800 rounded-2xl p-8 shadow-xl border border-neutral-700">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
        <p className="text-neutral-400 text-sm mb-8">
          Enter your password to continue.
        </p>
        <LoginForm adminKey={key} />
      </div>
    </main>
  );
}
