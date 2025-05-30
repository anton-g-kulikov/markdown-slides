import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Presentation, getPresentations } from "../utils/presentations";

interface HomeProps {
  presentations: Presentation[];
}

export default function Home({ presentations }: HomeProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Markdown Slides</title>
        <meta name="description" content="Interactive coding slides platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-gray-900 text-white"
        data-cy="home-page"
      >
        <h1
          className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          data-cy="main-title"
        >
          Welcome to Markdown Slides
        </h1>
        <p className="text-xl mb-12 text-gray-300 text-center">
          Turn your .md files into nice and simple presentations
        </p>

        <div className="w-full max-w-4xl" data-cy="presentations-container">
          <h2 className="text-2xl font-bold mb-6 text-blue-300">
            Available Presentations
          </h2>

          {presentations.length === 0 ? (
            <div
              className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700"
              data-cy="no-presentations"
            >
              <p className="text-gray-300">No presentations found</p>
              <p className="text-sm text-gray-400 mt-2">
                Place .md files in the /public/slides directory to see them here
              </p>
            </div>
          ) : (
            <ul className="space-y-4" data-cy="presentations-list">
              {presentations.map((presentation) => (
                <li
                  key={presentation.slug}
                  className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 cursor-pointer transition border border-gray-700 hover:border-blue-500"
                  onClick={() => router.push(presentation.path)}
                  data-cy="presentation-card" // Changed to match E2E tests
                >
                  <h3
                    className="text-xl font-semibold text-blue-300"
                    data-cy="presentation-title"
                  >
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

// Get data at build time
export async function getStaticProps() {
  const presentations = getPresentations();
  return {
    props: {
      presentations,
    },
  };
}
