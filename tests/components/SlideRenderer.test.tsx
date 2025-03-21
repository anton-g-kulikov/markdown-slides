import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor, fireEvent, act } from "../utils/test-utils";
import SlideRenderer from "../../components/SlideRenderer";
import { describe, expect, it, beforeEach, vi } from "vitest";

// Mock Next.js router
vi.mock("next/router", () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: "/",
    route: "/",
    asPath: "/",
    query: {},
  }),
}));

// Mock the Markdown component to render content immediately
vi.mock("../../components/Markdown", () => {
  return {
    __esModule: true,
    default: (props) => (
      <div data-testid="markdown-content">
        {props.content || props.markdown || props.children || ""}
      </div>
    ),
  };
});

// Sample markdown content for tests
const testMarkdownContent = `
# Test Presentation

First slide content

---

## Second Slide

- Bullet point 1
- Bullet point 2
`;

describe("SlideRenderer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock before each test
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(testMarkdownContent),
    });
  });

  // Add a separate test specifically for the loading state
  it("should show loading state before content loads", async () => {
    // Create a fetch that won't resolve during the test
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              text: () => Promise.resolve(testMarkdownContent),
            });
          }, 5000); // Long delay to ensure we're still in loading state
        })
    );

    await act(async () => {
      render(<SlideRenderer markdownPath="/slides/test.md" />);

      // We need a slight delay to let the component render the loading state
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    // Now the component should be in loading state
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Use a more flexible way to find the loading element
    // Option 1: Use querySelector to find by data-cy attribute directly
    const loadingElement = document.querySelector('[data-cy="loading-state"]');
    expect(loadingElement).not.toBeNull();

    // Option 2: Use custom queries from your test-utils
    // For example, if your customScreen has getByTestId that checks data-cy too
    // expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("should render the first slide and title", async () => {
    await act(async () => {
      render(<SlideRenderer markdownPath="/slides/test.md" />);
    });

    // Skip checking for loading state since it's transient
    // Wait directly for content to load

    await waitFor(() => {
      expect(screen.getByText("Test Presentation")).toBeInTheDocument();
    });

    // Check for first slide content
    await waitFor(() => {
      const contentElement = screen.getByTestId("markdown-content");
      expect(contentElement.textContent).toContain("First slide content");
    });
  });

  it("should navigate between slides", async () => {
    await act(async () => {
      render(<SlideRenderer markdownPath="/slides/test.md" />);
    });

    // Wait for content to load
    await waitFor(() => {
      const contentElement = screen.getByTestId("markdown-content");
      expect(contentElement.textContent).toContain("First slide content");
    });

    // Navigate to next slide within act
    await act(async () => {
      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);
    });

    // Should show second slide
    await waitFor(() => {
      const contentElement = screen.getByTestId("markdown-content");
      expect(contentElement.textContent).toContain("Second Slide");
      expect(contentElement.textContent).toContain("Bullet point 1");
    });

    // Navigate back to first slide within act
    await act(async () => {
      const prevButton = screen.getByRole("button", { name: /previous/i });
      fireEvent.click(prevButton);
    });

    // Should show first slide again
    await waitFor(() => {
      const contentElement = screen.getByTestId("markdown-content");
      expect(contentElement.textContent).toContain("First slide content");
    });
  });

  it("should handle keyboard navigation", async () => {
    await act(async () => {
      render(<SlideRenderer markdownPath="/slides/test.md" />);
    });

    // Wait for content to load
    await waitFor(() => {
      const contentElement = screen.getByTestId("markdown-content");
      expect(contentElement.textContent).toContain("First slide content");
    });

    // Press right arrow key within act
    await act(async () => {
      fireEvent.keyDown(document, { key: "ArrowRight" });
    });

    // Should show second slide
    await waitFor(() => {
      const contentElement = screen.getByTestId("markdown-content");
      expect(contentElement.textContent).toContain("Second Slide");
    });

    // Press left arrow key within act
    await act(async () => {
      fireEvent.keyDown(document, { key: "ArrowLeft" });
    });

    // Should show first slide again
    await waitFor(() => {
      const contentElement = screen.getByTestId("markdown-content");
      expect(contentElement.textContent).toContain("First slide content");
    });
  });

  it("should handle fetch errors gracefully", async () => {
    // Spy on console.error to prevent error messages in test output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Override the fetch mock for this specific test
    global.fetch = vi.fn().mockRejectedValue(new Error("Failed to fetch"));

    await act(async () => {
      render(<SlideRenderer markdownPath="/slides/nonexistent.md" />);
    });

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Should show "No slides found" as the error state
    expect(screen.getByText(/no slides found/i)).toBeInTheDocument();

    // Verify the error was logged
    expect(consoleSpy).toHaveBeenCalled();

    // Restore console.error
    consoleSpy.mockRestore();
  });

  it("should not navigate past the first or last slide", async () => {
    await act(async () => {
      render(<SlideRenderer markdownPath="/slides/test.md" />);
    });

    // Wait for first slide to load.
    await waitFor(() => {
      const contentElement = screen.getByTestId("markdown-content");
      expect(contentElement.textContent).toContain("First slide content");
    });

    // Try to navigate to previous slide (should stay on first slide)
    await act(async () => {
      const prevButton = screen.getByRole("button", { name: /previous/i });
      fireEvent.click(prevButton);
    });

    const contentElement = screen.getByTestId("markdown-content");
    expect(contentElement.textContent).toContain("First slide content");

    // Navigate to second slide
    await act(async () => {
      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("markdown-content").textContent).toContain(
        "Second Slide"
      );
    });

    // Try to navigate past last slide (should remain on second slide)
    await act(async () => {
      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("markdown-content").textContent).toContain(
        "Second Slide"
      );
    });
  });

  it("should handle HTTP error responses", async () => {
    // Spy on console.error to prevent error messages in test output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Override the fetch mock for this specific test
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await act(async () => {
      render(<SlideRenderer markdownPath="/slides/nonexistent.md" />);
    });

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Should show "No slides found" instead of error message
    expect(screen.getByText(/no slides found/i)).toBeInTheDocument();

    // Verify the error was logged
    expect(consoleSpy).toHaveBeenCalled();

    // Restore console.error
    consoleSpy.mockRestore();
  });

  it("should display slide count indicator", async () => {
    await act(async () => {
      render(<SlideRenderer markdownPath="/slides/test.md" />);
    });

    // Wait for content to load
    await waitFor(() => {
      const contentElement = screen.getByTestId("markdown-content");
      expect(contentElement.textContent).toContain("First slide content");
    });

    // Should show slide count (1/2)
    expect(screen.getByText("1/2")).toBeInTheDocument();

    // Navigate to second slide
    await act(async () => {
      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);
    });

    // Should update slide count (2/2)
    await waitFor(() => {
      expect(screen.getByText("2/2")).toBeInTheDocument();
    });
  });
});
