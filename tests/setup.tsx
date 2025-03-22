import { vi } from "vitest";
import "@testing-library/jest-dom";

// Make sure global.fetch is available in tests
global.fetch = vi.fn();

// Mock process.cwd for static file path resolution
vi.mock("process", () => ({
  ...vi.importActual("process"),
  cwd: () => "/test/project/root",
}));

// Add any global test setup here
