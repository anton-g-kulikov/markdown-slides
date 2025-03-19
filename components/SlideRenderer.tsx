import React, { useState, useEffect } from "react";
import Markdown from "./Markdown";

interface SlideRendererProps {
  markdownPath: string;
}

const SlideRenderer: React.FC<SlideRendererProps> = ({ markdownPath }) => {
  const [slides, setSlides] = useState<string[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        // Fetch the markdown file
        const response = await fetch(markdownPath);
        const markdown = await response.text();

        // Split the markdown by horizontal rules (---) to get individual slides
        const slideContent = markdown.split(/\n---\n/);
        setSlides(slideContent);
      } catch (error) {
        console.error("Error loading slides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [markdownPath]);

  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        goToNextSlide();
      } else if (e.key === "ArrowLeft") {
        goToPreviousSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex, slides.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        No slides found
      </div>
    );
  }

  return (
    <div className="slide-container h-screen flex flex-col">
      <div className="slide-content flex-1 p-8 flex items-center justify-center">
        <Markdown content={slides[currentSlideIndex]} />
      </div>

      <div className="slide-controls flex justify-between p-4 bg-gray-100">
        <button
          onClick={goToPreviousSlide}
          disabled={currentSlideIndex === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>

        <div className="slide-progress">
          {currentSlideIndex + 1} / {slides.length}
        </div>

        <button
          onClick={goToNextSlide}
          disabled={currentSlideIndex === slides.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SlideRenderer;
