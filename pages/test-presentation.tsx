import React from "react";
import SlideRenderer from "../components/SlideRenderer";
import Head from "next/head";

export default function TestPresentation() {
  return (
    <>
      <Head>
        <title>Example Presentation | VibeCoding Slides</title>
      </Head>

      <SlideRenderer markdownPath="/slides/example.md" />
    </>
  );
}
