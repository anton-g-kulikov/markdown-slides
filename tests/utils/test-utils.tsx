import React, { ReactElement } from "react";
import { render, RenderOptions, queries } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as customQueries from "./custom-queries";
// Explicitly import Jest DOM to ensure matchers are available
import "@testing-library/jest-dom";

// Create a wrapper component for testing
const AllProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: AllProviders,
      ...options,
    }),
  };
};

// Mock markdown content for testing
const mockMarkdownContent = `
# Test Presentation

First slide content

---

## Second Slide

- Bullet point 1
- Bullet point 2

---

### Third Slide

\`\`\`javascript
const hello = 'world';
console.log(hello);
\`\`\`
`;

// Re-export everything
export * from "@testing-library/react";

// Add a custom getByTestId that also checks data-cy attributes
const customScreen = {
  getByTestId: (id: string) => {
    try {
      // First try to find by data-testid
      return document.querySelector(`[data-testid="${id}"]`);
    } catch (error) {
      // If not found, try data-cy
      const element = document.querySelector(`[data-cy="${id}"]`);
      if (!element) {
        throw new Error(`Unable to find an element by testid: ${id}`);
      }
      return element;
    }
  },
};

// Override screen for our custom implementation
export { customRender as render, mockMarkdownContent, customScreen as screen };
