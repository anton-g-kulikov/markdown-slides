# VibeCoding Slides

A modern slide presentation platform built with Next.js, designed for creating and sharing interactive coding presentations.

## Overview

VibeCoding Slides allows developers and educators to create engaging slide presentations that can include live code examples, interactive elements, and seamless navigation. Built with modern web technologies for optimal performance and user experience.

## Features

- Interactive presentation creation
- Real-time collaboration via Firebase
- Responsive design for multiple devices
- Code syntax highlighting
- Custom themes and styling options

## Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/) 15.2.3
- **UI Library**: [React](https://react.dev/) 18.2.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 3.0.0
- **Backend/Database**: [Firebase](https://firebase.google.com/) 11.4.0
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.8.2

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/vibecoding-slides.git
   cd vibecoding-slides
   ```

2. Install dependencies:

   ```
   npm install
   # or
   yarn install
   ```

3. Set up Firebase:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
   - Configure your Firebase credentials in the project

### Development

To start the development server:

```
npm run dev
# or
yarn dev
```

## Creating Presentations

### File Structure

Place your presentation files in the `/public/slides` directory as Markdown (`.md`) files:

```
public/
  └── slides/
      ├── intro-to-react.md
      ├── advanced-typescript.md
      └── your-presentation.md
```

### Presentation Format

Each markdown file follows this structure:

1. **First line**: Use a level-1 heading for the presentation title
2. **Slides**: Separate individual slides using horizontal rules (`---`)

### Markdown Features

Your slides support:

- **Headings**: Use `#` for various heading levels
- **Lists**: Ordered and unordered lists
- **Emphasis**: _italics_ and **bold** text
- **Links**: [link text](url)
- **Images**: ![alt text](image-url)
- **Code blocks**: With syntax highlighting for multiple languages
  ```javascript
  // Your code here
  ```
- **Tables**: Standard markdown tables
- **HTML**: Raw HTML is supported for advanced formatting

### Viewing Presentations

Once your markdown files are in place, they will automatically appear on the homepage. Click on any presentation to view it in slide mode.

### Navigation

When viewing a presentation:

- Use the "Next" and "Previous" buttons to navigate between slides
- The current slide position is displayed (e.g., "2 / 10")
- Use keyboard shortcuts: Right Arrow/Space (next slide) and Left Arrow (previous slide)

## Codebase Structure

### Key Components

#### SlideRenderer (`/components/SlideRenderer.tsx`)

Core component that powers the presentation experience:

- **Props**:
  - `markdownPath`: Path to the markdown file to render
  - `title` (optional): Presentation title override
- **State Management**:
  - Manages slide content array and current slide index
  - Tracks loading state and presentation title
- **Functionality**:
  - Asynchronously fetches markdown from the provided path
  - Parses content by splitting at horizontal rules (`---`)
  - Auto-extracts title from the first slide's H1 heading if not provided
  - Provides navigation methods (next/previous slide)
  - Implements keyboard navigation (arrow keys, spacebar)
- **UI Structure**:
  - Renders a fixed title bar at the top
  - Displays current slide content in the center area
  - Shows navigation controls at the bottom
  - Provides loading and error states

#### SlideNavigation (`/components/SlideNavigation.tsx`)

Navigation controls component for presentations:

- **Props**:
  - `currentSlideIndex`: Current slide number
  - `totalSlides`: Total slides in the presentation
  - `goToPreviousSlide`: Function to navigate to previous slide
  - `goToNextSlide`: Function to navigate to next slide
- **Functionality**:
  - Renders navigation buttons (Previous/Next)
  - Shows current slide position (e.g., "2 / 10")
  - Includes a "Home" button to return to the main page
  - Handles Escape key press to return to homepage
- **UI Structure**:
  - Fixed position bar at the bottom of the screen
  - Contains navigation buttons and slide counter

#### Markdown Renderer (`/components/Markdown.tsx`)

Transforms markdown content into styled HTML:

- Uses `react-markdown` to parse markdown syntax
- Applies syntax highlighting to code blocks via `react-syntax-highlighter`
- Supports GitHub Flavored Markdown features via `remark-gfm`
- Handles HTML content with appropriate sanitization using `rehype-sanitize`
- Provides custom styling for different markdown elements

#### API: Presentations Handler (`/pages/api/presentations.ts`)

Backend API endpoint that provides presentation metadata:

- **Functionality**:
  - Scans the `/public/slides` directory for markdown files
  - Extracts metadata from each presentation:
    - `slug`: Filename without extension
    - `title`: Extracted from first H1 heading in the file
    - `path`: Path to the markdown file
  - Returns the presentation list as JSON
- **Error Handling**:
  - Gracefully handles missing directories
  - Provides empty array if no presentations exist

#### Dynamic Slide Routes (`/pages/slides/[slug].tsx`)

Handles dynamic routing for presentations:

- **Functionality**:
  - Extracts the `slug` parameter from the URL
  - Constructs the path to the corresponding markdown file (`/slides/${slug}.md`)
  - Passes the path to the SlideRenderer component
  - Handles loading state when slug is not yet available
- **Implementation**:
  - Uses Next.js dynamic routing with `useRouter`
  - Simple wrapper around the SlideRenderer with path construction

#### Homepage (`/pages/index.tsx`)

Lists all available presentations:

- **Data Fetching**:
  - Makes API call to `/api/presentations` endpoint
  - Retrieves list of available presentations with metadata
- **UI Structure**:
  - Displays page title and introduction
  - Shows clickable cards for each presentation
  - Links each card to its dynamic route (`/slides/[slug]`)
- **Styling**:
  - Responsive grid layout for presentation cards
  - Visual feedback for interactive elements

#### Example Presentation (`/pages/test-presentation.tsx`)

A sample implementation showcasing how to:

- Create a presentation page with specific markdown content
- Set custom page metadata (title, description)
- Apply presentation styling and layout

### Directory Structure

```
├── components/           # Reusable React components
│   ├── Markdown.tsx      # Markdown rendering with syntax highlighting
│   ├── SlideRenderer.tsx # Core presentation functionality
│   ├── SlideNavigation.tsx # Navigation controls for presentations
│   └── ...
├── pages/                # Next.js pages and routes
│   ├── index.tsx         # Homepage with presentation listing
│   ├── slides/[slug].tsx # Dynamic route for presentations
│   ├── api/presentations.ts # API endpoint for presentation metadata
│   └── ...
├── public/               # Static assets
│   ├── slides/           # Markdown presentation files
│   └── ...
└── styles/               # CSS and styling files
```

### Development Workflow

1. Create new presentations as markdown files in `/public/slides/`
2. Access them via the homepage or directly at `/slides/[filename]`
3. Extend components in the codebase to add new features
4. Update styles to customize the look and feel
