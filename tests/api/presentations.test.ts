import "@testing-library/jest-dom/extend-expect";
import fs from "fs";
import path from "path";
import { getPresentations } from "../../utils/presentations";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock the fs and path modules
vi.mock("fs");
vi.mock("path");

describe("Presentations Utility", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    (fs.existsSync as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (path.join as ReturnType<typeof vi.fn>).mockImplementation((...args) =>
      args.join("/")
    );
  });

  it("should return presentations list when files exist", async () => {
    // Mock file content for presentations
    const mockFiles = ["intro-to-react.md", "advanced-typescript.md"];
    (fs.readdirSync as ReturnType<typeof vi.fn>).mockReturnValue(mockFiles);

    // Setup reading the files
    (fs.readFileSync as ReturnType<typeof vi.fn>).mockImplementation(
      (filePath) => {
        if (filePath.includes("intro-to-react.md")) {
          return "# Introduction to React";
        }
        if (filePath.includes("advanced-typescript.md")) {
          return "# Advanced TypeScript";
        }
        return "";
      }
    );

    const presentations = getPresentations();

    expect(presentations).toEqual([
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
    ]);
  });

  it("should return empty list when directory doesn't exist", async () => {
    (fs.existsSync as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const presentations = getPresentations();
    expect(presentations).toEqual([]);
  });

  it("should return empty list when directory is empty", async () => {
    (fs.readdirSync as ReturnType<typeof vi.fn>).mockReturnValue([]);
    const presentations = getPresentations();
    expect(presentations).toEqual([]);
  });

  it("should handle files without titles properly", async () => {
    const mockFiles = ["no-title.md"];
    (fs.readdirSync as ReturnType<typeof vi.fn>).mockReturnValue(mockFiles);
    (fs.readFileSync as ReturnType<typeof vi.fn>).mockReturnValue(
      "Content without a title"
    );

    const presentations = getPresentations();

    expect(presentations).toEqual([
      {
        slug: "no-title",
        title: "no-title",
        path: "/slides/no-title",
      },
    ]);
  });
});
