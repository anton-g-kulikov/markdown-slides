import React, { useState, useEffect } from "react";
import Markdown from "./Markdown";
import SlideNavigation from "./SlideNavigation";

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

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        // Fetch the markdown file
        const response = await fetch(markdownPath);
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
      {/* Title bar that's always visible */}
      <div className="slide-title fixed top-0 left-0 right-0 p-4 bg-gray-800 text-white text-center shadow-md">
        <h1 className="text-xl font-bold">{slideTitle}</h1>
      </div>

      {/* Main content area with padding to avoid overlap with header and footer */}
      <div className="slide-content flex-1 p-8 pt-20 pb-20 flex items-center justify-center overflow-auto">
        <Markdown content={slides[currentSlideIndex]} />
      </div>

      {/* Navigation controls at the bottom */}
      <SlideNavigation
        currentSlideIndex={currentSlideIndex}
        totalSlides={slides.length}
        goToPreviousSlide={goToPreviousSlide}
        goToNextSlide={goToNextSlide}
      />
    </div>
  );
};

export default SlideRenderer;
