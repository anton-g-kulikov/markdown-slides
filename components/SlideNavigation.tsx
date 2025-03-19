import React, { useEffect } from "react";
import { useRouter } from "next/router";

interface SlideNavigationProps {
  currentSlideIndex: number;
  totalSlides: number;
  goToPreviousSlide: () => void;
  goToNextSlide: () => void;
}

const SlideNavigation: React.FC<SlideNavigationProps> = ({
  currentSlideIndex,
  totalSlides,
  goToPreviousSlide,
  goToNextSlide,
}) => {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        goHome();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="slide-controls fixed bottom-0 left-0 right-0 flex justify-between items-center p-4 bg-gray-100 border-t border-gray-200">
      <button
        onClick={goToPreviousSlide}
        disabled={currentSlideIndex === 0}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Previous
      </button>

      <div className="slide-progress text-center">
        {currentSlideIndex + 1} / {totalSlides}
      </div>

      <button
        onClick={goToNextSlide}
        disabled={currentSlideIndex === totalSlides - 1}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Next
      </button>

      <button
        onClick={goHome}
        className="px-4 py-2 bg-gray-500 text-white rounded ml-4"
      >
        Home
      </button>
    </div>
  );
};

export default SlideNavigation;
