import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-7xl font-extrabold text-teal-400">404</h1>
      <p className="text-2xl font-semibold">Page Not Found</p>
      <p className="text-gray-400 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 border-2 border-white rounded-full hover:bg-white hover:text-black transition font-medium"
      >
        Back to Home
      </Link>
    </div>
  );
}
