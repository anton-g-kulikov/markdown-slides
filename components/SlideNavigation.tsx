import React from "react";

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
  return (
    <div
      className="flex justify-between items-center p-4"
      data-cy="slide-navigation"
    >
      <button
        onClick={goToPreviousSlide}
        disabled={currentSlideIndex === 0}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
        data-cy="prev-slide-btn"
      >
        Previous
      </button>

      <div
        className="slide-progress text-center font-medium"
        data-cy="slide-progress"
        data-testid="slide-progress"
      >
        {currentSlideIndex + 1}/{totalSlides}
      </div>

      <button
        onClick={goToNextSlide}
        disabled={currentSlideIndex === totalSlides - 1}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
        data-cy="next-slide-btn"
      >
        Next
      </button>
    </div>
  );
};

export default SlideNavigation;
