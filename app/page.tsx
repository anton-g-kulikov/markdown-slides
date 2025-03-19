import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">Welcome to VibeCoding Slides</h1>
      <p className="text-xl mb-8">
        Start creating your interactive presentations
      </p>
      <div className="flex gap-4">
        <Link
          href="/slides"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Browse Slides
        </Link>
        <Link
          href="/create"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Create New
        </Link>
      </div>
    </main>
  );
}
