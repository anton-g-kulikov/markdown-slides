import fs from "fs";
import path from "path";

export interface Presentation {
  slug: string;
  title: string;
  path: string;
}

export function getPresentations(): Presentation[] {
  const slidesDirectory = path.join(process.cwd(), "public/slides");

  if (!fs.existsSync(slidesDirectory)) {
    return [];
  }

  try {
    const fileNames = fs.readdirSync(slidesDirectory);

    const presentations = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(slidesDirectory, fileName);

        // Read markdown file
        const fileContents = fs.readFileSync(fullPath, "utf8");

        // Extract title from markdown content
        const titleMatch = fileContents.match(/^#\s+(.+)/m);
        const title = titleMatch ? titleMatch[1] : slug;

        return {
          slug,
          title,
          path: `/slides/${slug}`,
        };
      });

    return presentations;
  } catch (error) {
    console.error("Error reading slides directory:", error);
    return [];
  }
}
