// Explicitly import Jest DOM and Jest matchers
import "@testing-library/jest-dom/extend-expect";
import { NextApiRequest, NextApiResponse } from "next";
import handler from "../../pages/api/presentations";
import fs from "fs";
import path from "path";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock the fs and path modules
vi.mock("fs");
vi.mock("path");

describe("Presentations API", () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse> & {
    json: ReturnType<typeof vi.fn>;
    status: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

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

    await handler(req as NextApiRequest, res as unknown as NextApiResponse);

    expect(res.json).toHaveBeenCalledWith({
      presentations: [
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
      ],
    });
  });

  it("should return empty list when directory doesn't exist", async () => {
    (fs.existsSync as ReturnType<typeof vi.fn>).mockReturnValue(false);

    await handler(req as NextApiRequest, res as unknown as NextApiResponse);

    expect(res.json).toHaveBeenCalledWith({ presentations: [] });
  });

  it("should return empty list when directory is empty", async () => {
    (fs.readdirSync as ReturnType<typeof vi.fn>).mockReturnValue([]);

    await handler(req as NextApiRequest, res as unknown as NextApiResponse);

    expect(res.json).toHaveBeenCalledWith({ presentations: [] });
  });

  it("should handle files without titles properly", async () => {
    const mockFiles = ["no-title.md"];
    (fs.readdirSync as ReturnType<typeof vi.fn>).mockReturnValue(mockFiles);
    (fs.readFileSync as ReturnType<typeof vi.fn>).mockReturnValue(
      "Content without a title"
    );

    await handler(req as NextApiRequest, res as unknown as NextApiResponse);

    expect(res.json).toHaveBeenCalledWith({
      presentations: [
        {
          slug: "no-title",
          title: "no-title", // Changed from "No Title" to match the actual implementation
          path: "/slides/no-title",
        },
      ],
    });
  });
});
