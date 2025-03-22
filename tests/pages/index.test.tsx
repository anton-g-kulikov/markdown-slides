import React from "react";
import { render, screen, waitFor, fireEvent, act } from "../utils/test-utils";
import HomePage from "../../pages/index";
import { useRouter } from "next/router";
import "@testing-library/jest-dom";
import { describe, expect, it, beforeEach, vi } from "vitest";
import * as presentationsModule from "../../utils/presentations";

// Mock useRouter
vi.mock("next/router", () => ({
  useRouter: vi.fn(),
}));

// Mock the presentations utility
vi.mock("../../utils/presentations", () => ({
  getPresentations: vi.fn(),
}));

// Sample presentation data
const mockPresentations = [
  {
    slug: "intro-to-react",
    title: "Introduction to React",
    path: "/slides/intro-to-react",
  },
  {
    slug: "advanced-typescript",
    title: "Advanced TypeScript",
    path: "/slides/advanced-typescript",
  },
];

describe("HomePage", () => {
  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockRouter
    );

    // Default mock for getPresentations
    (
      presentationsModule.getPresentations as ReturnType<typeof vi.fn>
    ).mockReturnValue(mockPresentations);
  });

  it("should display 'No presentations found' when there are no presentations", async () => {
    // Mock empty presentations array
    (
      presentationsModule.getPresentations as ReturnType<typeof vi.fn>
    ).mockReturnValue([]);

    render(<HomePage presentations={[]} />);

    expect(screen.getByText("No presentations found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Place .md files in the /public/slides directory to see them here"
      )
    ).toBeInTheDocument();
  });

  it("should render the correct title and subtitle", async () => {
    render(<HomePage presentations={mockPresentations} />);

    expect(
      screen.getByRole("heading", { name: /Welcome to Markdown Slides/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Turn your .md files into nice and simple presentations/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Available Presentations/i })
    ).toBeInTheDocument();
  });

  it("should render presentation items with correct data-cy attributes", async () => {
    render(<HomePage presentations={mockPresentations} />);

    const reactItem = screen.getByText("Introduction to React").closest("li");
    const tsItem = screen.getByText("Advanced TypeScript").closest("li");

    expect(reactItem).toHaveAttribute(
      "data-cy",
      "presentation-item-intro-to-react"
    );
    expect(tsItem).toHaveAttribute(
      "data-cy",
      "presentation-item-advanced-typescript"
    );
  });

  it("should navigate to presentation when card is clicked", async () => {
    render(<HomePage presentations={mockPresentations} />);

    // Click on a presentation card
    await act(async () => {
      fireEvent.click(screen.getByText("Introduction to React"));
    });

    // Should navigate to the presentation page
    expect(mockRouter.push).toHaveBeenCalledWith("/slides/intro-to-react");
  });
});
