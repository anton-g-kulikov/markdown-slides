import React, { useState, useEffect } from "react";
import Markdown from "./Markdown";
import SlideNavigation from "./SlideNavigation";
import TitleBar from "./TitleBar";
import { useRouter } from "next/router";

interface SlideRendererProps {
  markdownPath: string;
  title?: string;
}

const SlideRenderer: React.FC<SlideRendererProps> = ({
  markdownPath,
  title,
}) => {
  const [slides, setSlides] = useState<string[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [slideTitle, setSlideTitle] = useState(title || "Presentation");
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        // Fetch the markdown file
        const response = await fetch(markdownPath);

        if (!response.ok) {
          console.error(
            `HTTP error: ${response.status} ${response.statusText}`
          );
          setLoading(false);
          return;
        }

        const markdown = await response.text();

        // Split the markdown by horizontal rules (---) to get individual slides
        const slideContent = markdown.split(/\n---\n/);
        setSlides(slideContent);

        // Try to extract title from first slide if not provided
        if (!title) {
          const firstSlideTitle = slideContent[0].match(/^#\s+(.+)/m);
          if (firstSlideTitle && firstSlideTitle[1]) {
            setSlideTitle(firstSlideTitle[1]);
          }
        }
      } catch (error) {
        console.error("Error loading slides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [markdownPath, title]);

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
      } else if (e.key === "Escape") {
        goHome();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex, slides.length]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen bg-gray-900 text-white"
        data-cy="loading-state"
      >
        <div className="animate-pulse text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-screen bg-gray-900 text-white"
        data-cy="no-slides"
      >
        <div className="text-xl font-semibold">No slides found</div>
      </div>
    );
  }

  return (
    <div
      className="slide-container h-screen flex flex-col bg-gray-900"
      data-cy="slide-container"
    >
      {/* Title bar that's always visible */}
      <TitleBar title={slideTitle} />

      {/* Main content area with padding to avoid overlap with header and footer */}
      <div
        className="slide-content flex-1 p-8 pt-20 pb-20 flex items-center justify-center overflow-auto"
        data-cy="slide-content"
      >
        <Markdown content={slides[currentSlideIndex]} />
      </div>

      {/* Navigation controls at the bottom */}
      <div className="slide-navigation fixed bottom-0 left-0 right-0 bg-gray-800 text-white shadow-lg z-10">
        <SlideNavigation
          currentSlideIndex={currentSlideIndex}
          totalSlides={slides.length}
          goToPreviousSlide={goToPreviousSlide}
          goToNextSlide={goToNextSlide}
        />
      </div>
    </div>
  );
};

export default SlideRenderer;
