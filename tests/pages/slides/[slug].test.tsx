import "@testing-library/jest-dom";
import React from "react";
import { render, screen, act } from "../../utils/test-utils";
import SlideView from "../../../pages/slides/[slug]";
import { useRouter } from "next/router";
import { describe, expect, it, beforeEach, vi } from "vitest";

// Mock useRouter
vi.mock("next/router", () => ({
  useRouter: vi.fn(),
}));

// Mock SlideRenderer component
vi.mock("../../../components/SlideRenderer", () => ({
  default: function MockSlideRenderer({
    markdownPath,
  }: {
    markdownPath: string;
  }) {
    return <div data-testid="slide-renderer">Rendering: {markdownPath}</div>;
  },
}));

describe("SlideView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render SlideRenderer with correct markdownPath when slug is available", async () => {
    // Set up mock router with a slug
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      query: { slug: "test-presentation" },
      isReady: true,
    });

    await act(async () => {
      render(<SlideView />);
    });

    // Should render SlideRenderer with the correct path
    expect(screen.getByTestId("slide-renderer")).toHaveTextContent(
      "Rendering: /slides/test-presentation.md"
    );
  });

  it("should show loading state when router is not ready", async () => {
    // Set up mock router with isReady false
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      query: {},
      isReady: false,
    });

    await act(async () => {
      render(<SlideView />);
    });

    // Should show loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
