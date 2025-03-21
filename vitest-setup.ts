import "@testing-library/jest-dom";
import { vi } from "vitest";

// Make sure global.fetch is available in tests
global.fetch = vi.fn();

// Add any other global setup here
