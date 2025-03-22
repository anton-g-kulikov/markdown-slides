# Markdown Slides

A modern slide presentation platform built with Next.js, designed for creating and sharing interactive coding presentations.

## Overview

Markdown Slides allows developers and educators to create engaging slide presentations that can include live code examples, interactive elements, and seamless navigation. Built with modern web technologies for optimal performance and user experience.

## Features

- Interactive presentation creation
- Real-time collaboration via Firebase
- Responsive design for multiple devices
- Code syntax highlighting
- Custom themes and styling options

## Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/) 14.1.0
- **UI Library**: [React](https://react.dev/) 18.2.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 3.3.0 with [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
- **Markdown Processing**: [react-markdown](https://github.com/remarkjs/react-markdown) with remark-gfm and rehype-sanitize
- **Code Highlighting**: [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- **Backend/Database**: [Firebase](https://firebase.google.com/) 10.7.0 for hosting and real-time database
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.0.4
- **Testing**: [Cypress](https://www.cypress.io/) for end-to-end testing

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
  - Handles error states for failed fetches
- **Functionality**:
  - Asynchronously fetches markdown from the provided path with fetch API
  - Parses content by splitting at horizontal rules (`---`)
  - Auto-extracts title from the first slide's H1 heading if not provided
  - Implements keyboard navigation (arrow keys, spacebar, Escape)
  - Maintains current slide position in URL hash for shareable links
- **User Experience**:
  - Provides smooth transitions between slides
  - Shows appropriate loading and error states
  - Responsive design for different screen sizes

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

- **Props**:
  - `content`: Raw markdown string to render
  - `className` (optional): Additional CSS classes for styling
- **Features**:
  - Uses `react-markdown` with plugin architecture
  - Implements GitHub Flavored Markdown via `remark-gfm`
  - Renders code blocks with syntax highlighting for 180+ languages
  - Sanitizes HTML content to prevent XSS via `rehype-sanitize`
  - Supports math equations using KaTeX (optional plugin)
- **Styling**:
  - Leverages Tailwind's typography plugin for consistent text formatting
  - Customizable theme for code blocks (dark/light modes)
  - Responsive images and tables

#### API: Presentations Handler (`/pages/api/presentations.ts`)

Backend API endpoint that provides presentation metadata:

- **Implementation**:
  - Uses Node.js file system API to scan the slides directory
  - Caches results for improved performance
  - Implements serverless function architecture
- **Response Format**:
  - Returns JSON array of presentation objects
  - Each object contains: `slug`, `title`, `path`, and optional `description`
  - Sorts presentations by file creation/modification date
- **Error Handling**:
  - Returns appropriate HTTP status codes for different error scenarios
  - Provides detailed error messages in development mode
  - Gracefully handles missing directories and malformed markdown files

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
  - Uses React's `useEffect` with dependency tracking for efficient re-rendering
  - Implements error boundaries for robust error handling
- **UI Structure**:
  - Displays project title and introduction with configurable welcome message
  - Shows responsive cards for each presentation in a grid layout
  - Implements skeleton loading states for better perceived performance
  - Provides visual feedback for interactive elements (hover, focus states)
- **Accessibility**:
  - Ensures proper keyboard navigation support
  - Implements ARIA attributes for screen readers
  - Maintains sufficient color contrast for readability
- **Performance Optimization**:
  - Implements image optimization with Next.js Image component
  - Uses code splitting and lazy loading for better initial load time
  - Applies memoization for expensive computations

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
4. Run tests with `npm run test` to ensure functionality
5. Deploy to Firebase with `npm run deploy` after building
6. Update styles to customize the look and feel
