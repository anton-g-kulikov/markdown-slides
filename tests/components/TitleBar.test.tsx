import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TitleBar from "../../components/TitleBar";
import { useRouter } from "next/router";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

// Mock useRouter
vi.mock("next/router", () => ({
  useRouter: vi.fn(),
}));

describe("TitleBar", () => {
  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockRouter
    );
  });

  it("renders the title correctly", async () => {
    await act(async () => {
      render(<TitleBar title="Test Title" />);
    });
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("navigates to home when the home button is clicked", async () => {
    await act(async () => {
      render(<TitleBar title="Test Title" />);
    });

    // Use data-cy attribute instead of role with name
    const homeButton = screen.getByTestId("home-button");

    await act(async () => {
      fireEvent.click(homeButton);
    });

    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  it("applies the correct styling and attributes", async () => {
    let container;
    await act(async () => {
      const renderResult = render(<TitleBar title="Test Title" />);
      container = renderResult.container;
    });

    const titleBar = container.querySelector('[data-cy="slide-title-bar"]');
    expect(titleBar).toHaveClass("slide-title");
    expect(titleBar).toHaveAttribute("data-cy", "slide-title-bar");
  });
});
