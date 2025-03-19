import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

interface Presentation {
  slug: string;
  title: string;
  path: string;
}

export default function Home() {
  const router = useRouter();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPresentations() {
      try {
        const response = await fetch("/api/presentations");

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        setPresentations(data.presentations);
      } catch (error) {
        console.error("Failed to fetch presentations:", error);
        setError("Failed to load presentations. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchPresentations();
  }, []);

  return (
    <>
      <Head>
        <title>VibeCoding Slides</title>
        <meta name="description" content="Interactive coding slides platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-gray-900 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Welcome to VibeCoding Slides
        </h1>
        <p className="text-xl mb-12 text-gray-300 text-center">
          Start creating your interactive presentations
        </p>

        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-blue-300">
            Available Presentations
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-center">
                <p className="text-gray-300">Loading presentations...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8 bg-red-900/30 text-red-300 rounded-lg border border-red-700">
              <p>{error}</p>
            </div>
          ) : presentations.length === 0 ? (
            <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-gray-300">No presentations found</p>
              <p className="text-sm text-gray-400 mt-2">
                Place .md files in the /public/slides directory to see them here
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {presentations.map((presentation) => (
                <li
                  key={presentation.slug}
                  className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 cursor-pointer transition border border-gray-700 hover:border-blue-500"
                  onClick={() => router.push(presentation.path)}
                >
                  <h3 className="text-xl font-semibold text-blue-300">
                    {presentation.title}
                  </h3>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
