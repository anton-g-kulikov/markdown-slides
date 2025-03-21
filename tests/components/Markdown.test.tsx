import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import Markdown from "../../components/Markdown";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

describe("Markdown Component", () => {
  it("renders markdown content correctly", async () => {
    await act(async () => {
      render(<Markdown content="# Hello World" />);
    });

    const heading = await screen.findByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Hello World");
  });

  it("renders code blocks with syntax highlighting", async () => {
    await act(async () => {
      render(
        <Markdown
          content={`\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\``}
        />
      );
    });

    const codeBlock = await screen.findByTestId("code-block");
    expect(codeBlock.textContent).toContain('const hello = "world";');
    // Use regex match on the className to check for "language-javascript"
    expect(codeBlock.className).toMatch(/language-javascript/);
  });

  it("renders GitHub Flavored Markdown features", async () => {
    await act(async () => {
      render(
        <Markdown
          content={`
- [ ] Task 1
- [x] Task 2 (completed)

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
`}
        />
      );
    });

    await waitFor(() => {
      const task1Elements = screen.queryAllByText((_, element) =>
        element?.textContent.replace(/\s+/g, " ").trim().includes("Task 1")
      );
      expect(task1Elements.length).toBeGreaterThan(0);
      const task2Elements = screen.queryAllByText((_, element) =>
        element?.textContent
          .replace(/\s+/g, " ")
          .trim()
          .includes("Task 2 (completed)")
      );
      expect(task2Elements.length).toBeGreaterThan(0);
      expect(screen.getByText("Header 1")).toBeInTheDocument();
      expect(screen.getByText("Cell 1")).toBeInTheDocument();
    });
  });
});
