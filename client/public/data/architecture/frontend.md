# Frontend Architecture

Archer's frontend is built with Next.js 16 (App Router) and React 19, delivering high performance and responsive client-side state management.

## Key Technologies

- **Next.js 16 (App Router)**: Utilizing server components for initial page rendering and client components for interactive editors.
- **Tailwind CSS v4 & Typography**: Streamlined design tokens, dark mode classes, and typography styling for markdown documentation.
- **Framer Motion**: Smooth page transitions, collapsible accordions, and dialog animations.
- **React Flow / XYFlow**: Dynamic rendering of interactive node-based architecture diagrams.
- **Matter.js**: Physics-based interactive canvas elements for visual flair.
- **Lucide React**: Consistent and lightweight icon library.

## Component Structure

- `components/Header/Navbar.tsx`: Responsive navigation bar with scroll detection, route links, and theme toggle.
- `components/Docs/`:
  - `Document.tsx`: Main markdown document viewer with dynamic fetch and hash sync.
  - `DocsSidebar.tsx`: Multi-level collapsible documentation navigation tree.
- `components/Projects/`: Modals, cards, and list views for user projects.
- `components/Tasks/`: Task boards with status toggling and priority chips.
- `components/TechStack/`: Interactive tech stack category cards and management dialogs.
