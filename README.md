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

Example presentation file:

```markdown
# Introduction to React Hooks

## What are React Hooks?

React Hooks are functions that let you "hook into" React state and lifecycle features from function components.

---

## useState Hook

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

---

## useEffect Hook

For side effects in your components:

```jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run if count changes
```
```

### Markdown Features

Your slides support:

- **Headings**: Use `#` for various heading levels
- **Lists**: Ordered and unordered lists
- **Emphasis**: *italics* and **bold** text
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