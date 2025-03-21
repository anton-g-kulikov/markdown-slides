import React from "react";
import { render, screen, waitFor, fireEvent, act } from "../utils/test-utils";
import HomePage from "../../pages/index";
import { useRouter } from "next/router";
// Explicitly import the matchers
import "@testing-library/jest-dom";
import { describe, expect, it, beforeEach, vi } from "vitest";

// Mock useRouter
vi.mock("next/router", () => ({
  useRouter: vi.fn(),
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

    // Mock fetch to return our test presentations
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ presentations: mockPresentations }),
      })
    );
  });

  it("should display 'No presentations found' when API returns empty array", async () => {
    // Mock fetch to return empty presentations array
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({ presentations: [] }),
            });
          }, 100);
        })
    );

    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      expect(screen.getByText("No presentations found")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Place .md files in the /public/slides directory to see them here"
        )
      ).toBeInTheDocument();
    });
  });

  it("should handle HTTP error responses", async () => {
    // Mock fetch to return error status
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: false,
              status: 404,
              statusText: "Not Found",
            });
          }, 100);
        })
    );

    // Spy on console.error to suppress output during test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "Failed to load presentations. Please try again later."
        )
      ).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should render the correct title and subtitle", async () => {
    await act(async () => {
      render(<HomePage />);
    });

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
    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
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
  });

  it("should check for loading state and then presentations", async () => {
    // Create a delayed mock to ensure we can see the loading state
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({ presentations: mockPresentations }),
            });
          }, 100); // Small delay to ensure loading state is visible
        })
    );

    await act(async () => {
      render(<HomePage />);
    });

    // Check for loading state using querySelector to find by data-cy attribute directly
    const loadingElement = document.querySelector(
      '[data-cy="loading-presentations"]'
    );
    expect(loadingElement).not.toBeNull();

    // Also check for the loading text
    expect(screen.getByText("Loading presentations...")).toBeInTheDocument();

    // Wait for presentations to load
    await waitFor(() => {
      expect(screen.getByText("Introduction to React")).toBeInTheDocument();
      expect(screen.getByText("Advanced TypeScript")).toBeInTheDocument();
    });
  });

  it("should navigate to presentation when card is clicked", async () => {
    // Use act for initial render
    await act(async () => {
      render(<HomePage />);
    });

    // Wait for presentations to load
    await waitFor(() => {
      expect(screen.getByText("Introduction to React")).toBeInTheDocument();
    });

    // Click on a presentation card needs to be in act
    await act(async () => {
      fireEvent.click(screen.getByText("Introduction to React"));
    });

    // Should navigate to the presentation page
    expect(mockRouter.push).toHaveBeenCalledWith("/slides/intro-to-react");
  });

  it("should handle fetch errors gracefully", async () => {
    // Spy on console.error to suppress output during test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Mock fetch to simulate an error
    global.fetch = vi
      .fn()
      .mockImplementation(() => Promise.reject(new Error("Failed to fetch")));

    // Use act for initial render that includes the effect with fetch
    await act(async () => {
      render(<HomePage />);
    });

    // Should show error state with exact error message
    await waitFor(() => {
      expect(
        screen.getByText(
          "Failed to load presentations. Please try again later."
        )
      ).toBeInTheDocument();
    });

    // Verify the error was logged
    expect(consoleSpy).toHaveBeenCalled();

    // Restore console.error
    consoleSpy.mockRestore();
  });
});
