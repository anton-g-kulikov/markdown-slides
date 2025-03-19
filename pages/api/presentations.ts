import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

interface Presentation {
  slug: string;
  title: string;
  path: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Path to slides directory
    const slidesDirectory = path.join(process.cwd(), "public", "slides");

    // Check if directory exists
    if (!fs.existsSync(slidesDirectory)) {
      return res.status(200).json({ presentations: [] });
    }

    // Get all markdown files
    const files = fs
      .readdirSync(slidesDirectory)
      .filter((file) => file.endsWith(".md"));

    const presentations: Presentation[] = files.map((file) => {
      const slug = file.replace(/\.md$/, "");

      // Read the first line of the file to extract title
      const filePath = path.join(slidesDirectory, file);
      const content = fs.readFileSync(filePath, "utf8");
      const firstLine = content.split("\n")[0];

      // Extract title from markdown heading or use slug as fallback
      let title = slug;
      if (firstLine.startsWith("# ")) {
        title = firstLine.substring(2).trim();
      }

      return {
        slug,
        title,
        path: `/slides/${slug}`,
      };
    });

    res.status(200).json({ presentations });
  } catch (error) {
    console.error("Error fetching presentations:", error);
    res.status(500).json({ error: "Failed to fetch presentations" });
  }
}
