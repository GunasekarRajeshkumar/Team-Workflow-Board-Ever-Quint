# Ever Quint - Team Workflow Board

A modern, feature-rich task management application built with React and TypeScript. This project demonstrates component design, state management, accessibility, and best practices for building maintainable React applications.

## 🚀 Features

### Core Features

- **Kanban Board View**: Drag-and-drop enabled board with columns for Backlog, In Progress, and Done
- **Task Management**: Create, edit, and delete tasks with rich metadata (title, description, status, priority, assignee, tags)
- **Dashboard Analytics**: Comprehensive dashboard with statistics, charts, and task insights
- **Filtering & Sorting**: Filter by status, priority, and search terms; sort by date or priority
- **URL State Management**: Filters and sort preferences are stored in URL query parameters for sharing and bookmarking
- **Data Persistence**: Tasks are stored in localStorage with versioning and migration support
- **Dummy Data**: Automatically generates 20 sample tasks on first load

### UI/UX Features

- **Responsive Design**: Fully responsive layout that works seamlessly on desktop, tablet, and mobile devices
- **Mobile Navigation**: Dedicated mobile navigation bar with Dashboard and Board links
- **Sidebar Navigation**: Fixed sidebar on desktop with task counts and quick navigation
- **Minimal Design**: Clean, professional minimal design with a light color palette
- **Toast Notifications**: User-friendly notifications using react-hot-toast for task operations

### Accessibility

- **WCAG 2.1 Level AA Compliant**: Full keyboard navigation, ARIA labels, and focus management
- **Screen Reader Support**: Proper semantic HTML and ARIA attributes
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus Management**: Proper focus handling in modals and forms

### Performance

- **Optimized Build**: Production-ready build with code splitting and tree shaking
- **Memoization**: Filtered and sorted tasks are memoized to prevent unnecessary recalculations
- **Efficient Renders**: Components use React.memo and useMemo where appropriate
- **Fast Loading**: Optimized bundle size and lazy loading where applicable

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd task-manager
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Running Tests

```bash
npm test
```

For a UI-based test runner:

```bash
npm run test:ui
```

## 🌐 Deployment

### Netlify Deployment

This project is configured for easy deployment to Netlify:

1. **Automatic Deployment**:

   - Connect your GitHub repository to Netlify
   - Netlify will automatically detect the build settings from `netlify.toml`
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Manual Deployment**:

   ```bash
   npm run build
   # Then drag and drop the 'dist' folder to Netlify
   ```

3. **Environment Variables** (if needed):
   - Add any required environment variables in Netlify dashboard
   - Under Site settings → Build & deploy → Environment variables

The `netlify.toml` file includes:

- Build configuration
- Redirect rules for SPA routing
- Node.js version specification

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Component library (Button, Input, Modal, Card, Tag, etc.)
│   ├── Layout/         # Layout components (Sidebar, MobileNav, Layout)
│   └── EmptyState.tsx  # Empty state component
├── features/           # Feature-based modules
│   ├── board/          # Board view and task cards with drag-and-drop
│   ├── taskForm/       # Task creation/editing form
│   └── filters/        # Filtering and sorting UI
├── hooks/              # Custom React hooks
│   ├── useStorage.ts   # Storage management hook with migrations
│   ├── useFilters.ts   # Filter state management with URL sync
│   └── useForm.ts      # Form state and validation
├── pages/              # Page components
│   ├── Dashboard.tsx  # Analytics dashboard
│   └── BoardPage.tsx   # Board view page
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── storage.ts      # localStorage operations and migrations
│   ├── filters.ts      # Filtering and sorting logic
│   ├── date.ts         # Date formatting utilities
│   ├── urlParams.ts    # URL query parameter handling
│   └── dummyTasks.ts   # Dummy task generator
├── styles/             # Global styles and design tokens
└── test/               # Test setup files
```

## 🏗️ Architecture Overview

### Component Design

The application follows a component composition pattern with a clear separation between:

- **UI Components** (`src/components/ui/`): Reusable, styled components with no business logic
- **Feature Components** (`src/features/`): Domain-specific components that compose UI components
- **Layout Components** (`src/components/Layout/`): Higher-level layout and container components
- **Page Components** (`src/pages/`): Top-level page components

### State Management

State is managed using React hooks and custom hooks:

- **useStorage**: Manages task persistence in localStorage with migration support
- **useFilters**: Manages filter and sort state, syncing with URL query parameters
- **useForm**: Handles form state, validation, and dirty state tracking

No external state management library is used, keeping the application lightweight and maintainable.

### Data Layer

Tasks are persisted in localStorage with a versioned schema:

- **Schema Versioning**: Each storage entry includes a `schemaVersion` field
- **Migrations**: When an older schema is detected, data is automatically migrated
- **Error Handling**: Graceful fallbacks when storage is unavailable
- **Dummy Data**: Automatically generates 20 sample tasks on first load

### URL State Management

Filters and sort preferences are stored in URL query parameters:

- Shareable links: Users can share filtered/sorted views
- Browser navigation: Back/forward buttons work with filter changes
- Refresh persistence: Filters are restored on page refresh

### Routing

The application uses React Router for navigation:

- `/` or `/board` - Board view (default)
- `/dashboard` - Analytics dashboard

## 🎨 Design System

### Color Palette

The application uses a minimal, professional color scheme:

- **Card Background**: `rgb(227, 245, 255)` - Light blue
- **Page Background**: `rgb(255, 255, 255)` - White
- **Section Background**: `rgb(247, 249, 251)` - Light gray
- **Alt Section**: `rgb(229, 236, 246)` - Light blue-gray
- **Text**: Black with varying opacity for hierarchy
- **Borders**: Subtle borders with low opacity

### Typography

- **Font Family**: System font stack for optimal performance
- **Font Sizes**: Responsive typography scale
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing

Consistent spacing scale using CSS variables:

- `--spacing-xs`: 0.25rem
- `--spacing-sm`: 0.5rem
- `--spacing-md`: 1rem
- `--spacing-lg`: 1.5rem
- `--spacing-xl`: 2rem

## 📱 Responsive Design

### Desktop (769px+)

- Fixed sidebar on the left (280px width)
- Main content area with margin for sidebar
- Full dashboard and board views

### Mobile (≤768px)

- Hidden sidebar (replaced by mobile navigation)
- Top navigation bar with:
  - "Ever Quint" logo
  - "Create Task" button
  - Dashboard and Board links
- Optimized spacing and touch targets
- Full-width board columns

## 🧪 Testing Strategy

Tests are written using Vitest and React Testing Library:

- **Unit Tests**: Test utility functions (filters, sorting, storage)
- **Component Tests**: Test component behavior and user interactions
- **Integration Tests**: Test complete workflows (e.g., creating a task)

See `src/features/board/__tests__/` and `src/utils/__tests__/` for examples.

## ♿ Accessibility

The application follows WCAG 2.1 Level AA guidelines:

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **ARIA Labels**: Proper labels for screen readers
- **Focus Management**: Focus is managed in modals and forms
- **Semantic HTML**: Proper use of headings, labels, and landmarks
- **Color Contrast**: All text meets WCAG AA contrast requirements
- **Screen Reader Support**: Full support for assistive technologies

## ⚡ Performance Considerations

- **Memoization**: Filtered and sorted tasks are memoized to prevent unnecessary recalculations
- **Code Splitting**: Route-based code splitting ready for implementation
- **Optimized Renders**: Components use React.memo where appropriate
- **Bundle Size**: Optimized production build with tree shaking
- **Lazy Loading**: Ready for component lazy loading if needed
- **Console Cleanup**: Console errors only shown in development mode

## 🚀 Best Practices

### Code Quality

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting for consistency
- **Component Composition**: Reusable, composable components
- **Error Handling**: Graceful error handling with user-friendly messages
- **Code Organization**: Clear separation of concerns

### Performance

- **Production Build**: Optimized for production with minification
- **No Console Errors**: Console errors only in development
- **Efficient State Management**: Minimal re-renders
- **Optimized Images**: Ready for image optimization if needed

### Security

- **Input Validation**: Client-side validation for all forms
- **XSS Protection**: React's built-in XSS protection
- **Safe Storage**: localStorage with error handling

## 📊 Dashboard Features

The dashboard provides comprehensive analytics:

- **Statistics Cards**: Total tasks, completed, in progress, and backlog counts
- **Completion Rate Chart**: Visual pie chart showing task completion percentage
- **Weekly Activity**: Tasks created and completed this week
- **Priority Distribution**: Visual representation of task priorities
- **Recent Tasks**: List of recently updated tasks
- **High Priority Tasks**: List of high-priority pending tasks

## 🔧 Key Design Decisions

### Why No External State Management?

The application's state needs are relatively simple:

- Task list (managed by `useStorage`)
- Filter/sort state (managed by `useFilters`)
- Form state (managed by `useForm`)

Using React's built-in state management keeps the codebase simpler and easier to understand. If the application grows significantly, we could easily migrate to Zustand or Redux.

### CSS Modules vs Other Solutions

CSS Modules were chosen for:

- **Scoped styles**: No style conflicts between components
- **Type safety**: TypeScript support for class names
- **Performance**: No runtime CSS-in-JS overhead
- **Simplicity**: Standard CSS with minimal tooling

### Component Library Structure

Each UI component follows a consistent structure:

```
ComponentName/
├── ComponentName.tsx      # Component implementation
├── ComponentName.module.css # Component styles
└── index.ts              # Public API exports
```

This makes components easy to find, test, and maintain.

## 📝 Known Limitations

1. **No Backend**: All data is stored in localStorage. Data is not synced across devices.
2. **No Real-time Updates**: Changes are only visible after refresh or manual update.
3. **Limited Search**: Search only matches title and description, not tags or assignees.
4. **Browser Storage**: Data is limited by browser storage quotas.

## 🔮 Future Enhancements

If given more time, I would:

1. Add drag-and-drop for moving tasks between columns (partially implemented with @dnd-kit)
2. Implement task comments and activity history
3. Add user authentication and multi-user support
4. Add task templates and bulk operations
5. Implement keyboard shortcuts for common actions
6. Add export/import functionality for tasks
7. Implement undo/redo functionality
8. Add dark mode support
9. Implement task due dates and reminders
10. Add task attachments and file uploads

## 🛠️ Development Notes

### Build Process

The application uses Vite for fast development and optimized production builds:

- **Development**: Fast HMR (Hot Module Replacement) for instant updates
- **Production**: Optimized bundle with code splitting and tree shaking
- **Type Checking**: TypeScript compilation before build

### Console Errors

All console errors are wrapped in development checks:

- Console errors only appear in development mode
- Production builds have no console errors
- Proper error handling with user-friendly messages

### Netlify Configuration

The project includes `netlify.toml` for easy deployment:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect rules for client-side routing
- Node.js version: 18

## 📄 License

This project is created as a coding assessment.

## 🙏 Acknowledgments

- Built with React, TypeScript, and Vite
- UI components designed from scratch
- Icons and styling use minimal, professional design
- Testing with Vitest and React Testing Library
- Toast notifications with react-hot-toast
- Drag-and-drop with @dnd-kit
