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
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to VibeCoding Slides
        </h1>
        <p className="text-xl mb-8">
          Start creating your interactive presentations
        </p>

        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Available Presentations</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-center">
                <p>Loading presentations...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8 bg-red-50 text-red-500 rounded">
              <p>{error}</p>
            </div>
          ) : presentations.length === 0 ? (
            <div className="text-center py-8 bg-gray-100 rounded">
              <p>No presentations found</p>
              <p className="text-sm text-gray-500 mt-2">
                Place .md files in the /public/slides directory to see them here
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {presentations.map((presentation) => (
                <li
                  key={presentation.slug}
                  className="bg-gray-100 p-4 rounded hover:bg-gray-200 cursor-pointer transition"
                  onClick={() => router.push(presentation.path)}
                >
                  <h3 className="text-xl font-semibold">
                    {presentation.title}
                  </h3>
                  <p className="text-gray-600">Click to view presentation</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
