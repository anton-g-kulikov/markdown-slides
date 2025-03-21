import "@testing-library/jest-dom/extend-expect"; // Add this explicit import
import React from "react";
import { render, screen, fireEvent, act } from "../utils/test-utils";
import SlideNavigation from "../../components/SlideNavigation";
import { useRouter } from "next/router";
import { describe, expect, it, beforeEach, vi } from "vitest";

// Mock useRouter
vi.mock("next/router", () => ({
  useRouter: vi.fn(),
}));

describe("SlideNavigation", () => {
  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockRouter
    );
    vi.clearAllMocks();
  });

  it("should render navigation controls and slide count", async () => {
    const goToPreviousSlide = vi.fn();
    const goToNextSlide = vi.fn();

    await act(async () => {
      render(
        <SlideNavigation
          currentSlideIndex={2}
          totalSlides={10}
          goToPreviousSlide={goToPreviousSlide}
          goToNextSlide={goToNextSlide}
        />
      );
    });

    // Check if navigation controls are rendered
    expect(
      screen.getByRole("button", { name: /previous/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();

    // Check if slide counter is displayed - using data-cy instead of text content
    const slideProgress = screen.getByTestId("slide-progress");
    expect(slideProgress).toBeInTheDocument();
    expect(slideProgress.textContent).toContain("3");
    expect(slideProgress.textContent).toContain("10");
  });

  it("should call navigation functions when buttons are clicked", async () => {
    const goToPreviousSlide = vi.fn();
    const goToNextSlide = vi.fn();

    await act(async () => {
      render(
        <SlideNavigation
          currentSlideIndex={1}
          totalSlides={3}
          goToPreviousSlide={goToPreviousSlide}
          goToNextSlide={goToNextSlide}
        />
      );
    });

    // Click previous button
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /previous/i }));
    });
    expect(goToPreviousSlide).toHaveBeenCalledTimes(1);

    // Click next button
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /next/i }));
    });
    expect(goToNextSlide).toHaveBeenCalledTimes(1);
  });

  it("should handle keyboard navigation", async () => {
    const goToPreviousSlide = vi.fn();
    const goToNextSlide = vi.fn();

    await act(async () => {
      render(
        <SlideNavigation
          currentSlideIndex={0}
          totalSlides={5}
          goToPreviousSlide={goToPreviousSlide}
          goToNextSlide={goToNextSlide}
        />
      );
    });

    // Test keyboard navigation if implemented
    await act(async () => {
      fireEvent.keyDown(document, { key: "ArrowLeft" });
    });

    await act(async () => {
      fireEvent.keyDown(document, { key: "ArrowRight" });
    });

    // Verify no routing occurred from keyboard events
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  // Test to ensure there is no home button since the component doesn't render one.
  it("should not render a home button", async () => {
    const goToPreviousSlide = vi.fn();
    const goToNextSlide = vi.fn();

    await act(async () => {
      render(
        <SlideNavigation
          currentSlideIndex={0}
          totalSlides={5}
          goToPreviousSlide={goToPreviousSlide}
          goToNextSlide={goToNextSlide}
        />
      );
    });

    const homeButton = screen.queryByRole("button", { name: /home/i });
    expect(homeButton).toBeNull();
  });

  // Test to ensure previous button is disabled on the first slide.
  it("should disable the previous button when on the first slide", async () => {
    const goToPreviousSlide = vi.fn();
    const goToNextSlide = vi.fn();

    await act(async () => {
      render(
        <SlideNavigation
          currentSlideIndex={0}
          totalSlides={5}
          goToPreviousSlide={goToPreviousSlide}
          goToNextSlide={goToNextSlide}
        />
      );
    });

    const prevButton = screen.getByRole("button", { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  // Test to ensure next button is disabled on the last slide.
  it("should disable the next button when on the last slide", async () => {
    const goToPreviousSlide = vi.fn();
    const goToNextSlide = vi.fn();

    await act(async () => {
      render(
        <SlideNavigation
          currentSlideIndex={4} // Index 4 for 5 slides (0-indexed)
          totalSlides={5}
          goToPreviousSlide={goToPreviousSlide}
          goToNextSlide={goToNextSlide}
        />
      );
    });

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeDisabled();
  });
});
