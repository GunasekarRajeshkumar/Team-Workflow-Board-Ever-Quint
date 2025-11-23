# Architecture Documentation

## Component Hierarchy

```
App
├── Header
│   └── Button (Create Task)
├── ErrorBanner (if storage error)
├── Filters
│   ├── TextInput (Search)
│   ├── CheckboxGroup (Status filters)
│   ├── Select (Priority filter)
│   ├── Select (Sort field)
│   └── Select (Sort direction)
├── Board
│   ├── BoardColumn (Backlog)
│   │   └── TaskCard[]
│   ├── BoardColumn (In Progress)
│   │   └── TaskCard[]
│   └── BoardColumn (Done)
│       └── TaskCard[]
└── Modal
    └── TaskForm
        ├── TextInput (Title)
        ├── TextArea (Description)
        ├── Select (Status)
        ├── Select (Priority)
        ├── TextInput (Assignee)
        └── TagInput (Tags)
```

## Data Flow

### Task Management Flow

1. **User creates/edits task** → `TaskForm` component
2. **Form submission** → `App.handleSubmitTask`
3. **Task added/updated** → `useStorage.addTask` or `useStorage.updateTask`
4. **Storage updated** → `localStorage` via `saveTasks`
5. **State updated** → React re-renders with new task list
6. **Board updates** → Tasks filtered and sorted, then displayed

### Filter/Sort Flow

1. **User changes filter** → `Filters` component
2. **Filter state updated** → `useFilters.updateFilters`
3. **URL updated** → Query parameters synced via `buildUrlParams`
4. **Tasks filtered** → `filterTasks` utility
5. **Tasks sorted** → `sortTasks` utility
6. **Board re-renders** → With filtered/sorted tasks

## Storage Versioning & Migrations

### Schema Evolution

The storage system uses versioned schemas to handle data migrations:

```typescript
interface StorageData {
  schemaVersion: number;
  tasks: Task[];
}
```

### Migration Process

1. **Load data** from localStorage
2. **Check schema version** against `CURRENT_SCHEMA_VERSION`
3. **If outdated**, run migration function
4. **Save migrated data** with new schema version
5. **Show notification** to user if migration occurred

### Example Migration

**Version 1 → Version 2:**
- **Problem**: Some tasks might be missing `createdAt` or `updatedAt` timestamps
- **Solution**: Migration ensures all tasks have valid timestamps, defaulting to current time if missing

```typescript
function migrateV1ToV2(data: LegacyStorageData): StorageData {
  const now = new Date().toISOString();
  return {
    schemaVersion: 2,
    tasks: data.tasks.map((task) => ({
      ...task,
      createdAt: task.createdAt || now,
      updatedAt: task.updatedAt || now,
    })),
  };
}
```

### Adding New Migrations

To add a new migration:

1. Increment `CURRENT_SCHEMA_VERSION` in `src/types/storage.ts`
2. Add migration function in `src/utils/storage.ts`
3. Update migration logic to handle new version

## Custom Hooks

### useStorage

Manages task persistence and provides CRUD operations:

```typescript
const {
  tasks,        // Current task list
  isLoading,    // Loading state
  error,        // Storage error message
  migrated,    // Whether migration occurred
  addTask,      // Add new task
  updateTask,   // Update existing task
  deleteTask,   // Delete task
} = useStorage();
```

**Responsibilities:**
- Loading tasks on mount
- Saving tasks to localStorage
- Handling storage errors
- Tracking migration state

### useFilters

Manages filter and sort state with URL synchronization:

```typescript
const {
  filters,       // Current filter state
  sort,          // Current sort state
  updateFilters, // Update filters
  updateSort,    // Update sort
  clearFilters,  // Reset all filters
} = useFilters();
```

**Responsibilities:**
- Syncing state with URL query parameters
- Parsing URL on mount
- Updating URL when filters change

### useForm

Generic form state management with validation:

```typescript
const {
  values,        // Form field values
  errors,        // Validation errors
  touched,       // Touched fields
  isDirty,       // Whether form has unsaved changes
  handleChange,  // Handle field changes
  handleBlur,    // Handle field blur
  validateForm,  // Validate all fields
  reset,         // Reset form to initial values
} = useForm(initialValues, validate);
```

**Responsibilities:**
- Managing form state
- Tracking touched fields
- Validating on submit
- Tracking dirty state

## URL State Management

### Query Parameter Structure

```
?status=Backlog,In%20Progress&priority=High&search=bug&sortField=updatedAt&sortDirection=desc
```

**Parameters:**
- `status`: Comma-separated list of statuses
- `priority`: Single priority value
- `search`: Search term
- `sortField`: Field to sort by
- `sortDirection`: Sort direction (asc/desc)

### Implementation

1. **On mount**: Parse URL params and set initial state
2. **On change**: Update URL when filters/sort change
3. **On navigation**: Update state when URL changes (browser back/forward)

This ensures:
- Shareable links with filters applied
- Browser history works correctly
- Filters persist on refresh

## Component Design Patterns

### Composition Over Configuration

Components are designed to be composed rather than configured with many props:

```typescript
// Good: Composable
<Modal>
  <TaskForm />
</Modal>

// Bad: Prop explosion
<TaskFormModal
  isOpen={true}
  onClose={handleClose}
  task={task}
  onSubmit={handleSubmit}
  validate={validate}
  // ... many more props
/>
```

### Presentational vs Container

- **Presentational**: `TaskCard`, `BoardColumn` - Display data, call callbacks
- **Container**: `App`, `Board` - Manage state, handle business logic

### Controlled Components

All form inputs are controlled components for predictable state:

```typescript
<TextInput
  value={values.title}
  onChange={(e) => handleChange('title', e.target.value)}
/>
```

## Performance Optimizations

### Memoization

Filtered and sorted tasks are memoized:

```typescript
const filteredAndSortedTasks = React.useMemo(() => {
  const filtered = filterTasks(tasks, filters);
  return sortTasks(filtered, sort);
}, [tasks, filters, sort]);
```

This prevents unnecessary recalculations when unrelated state changes.

### Component Memoization

Components that receive stable props can be memoized:

```typescript
export const TaskCard = React.memo<TaskCardProps>(({ task, ... }) => {
  // ...
});
```

## Error Handling

### Storage Errors

- **Detection**: `isStorageAvailable()` checks localStorage availability
- **Display**: Error banner shown at top of app
- **Graceful Degradation**: App continues to work, but data isn't persisted

### Validation Errors

- **Client-side**: Form validation before submission
- **Display**: Inline error messages below fields
- **Accessibility**: ARIA attributes for screen readers

### Migration Errors

- **Handling**: Try-catch around migration logic
- **Fallback**: Use empty array if migration fails
- **Notification**: Toast notification if migration succeeds

## Accessibility Features

### Keyboard Navigation

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and cards
- **Escape**: Close modals
- **Arrow keys**: Navigate within components (where applicable)

### ARIA Attributes

- **aria-label**: Descriptive labels for icon buttons
- **aria-invalid**: Form field validation state
- **aria-describedby**: Link errors to inputs
- **aria-modal**: Modal dialogs
- **role**: Semantic roles (button, dialog, alert)

### Focus Management

- **Modal focus**: First focusable element focused on open
- **Focus trap**: Focus stays within modal
- **Focus restoration**: Previous focus restored on close

## Testing Strategy

### Unit Tests

Test pure functions and utilities:
- `filterTasks`: Filter logic
- `sortTasks`: Sort logic
- `parseUrlParams`: URL parsing

### Component Tests

Test component behavior:
- Rendering with different props
- User interactions
- Form validation
- Error states

### Integration Tests

Test complete workflows:
- Creating a task and seeing it on the board
- Filtering tasks and verifying results
- Changing task status

## Refactoring Example

### Before: Inline Filter Logic

```typescript
// In App.tsx
const filteredTasks = tasks.filter((task) => {
  if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
    return false;
  }
  // ... more filter logic
});
```

### After: Extracted Utility Function

```typescript
// In utils/filters.ts
export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  // ... filter logic
}

// In App.tsx
const filteredTasks = filterTasks(tasks, filters);
```

**Benefits:**
- Reusable across components
- Easier to test
- Clearer separation of concerns
- Better maintainability

## Future Architecture Considerations

### If Adding Backend

1. **API Layer**: Create `src/api/` with service functions
2. **State Management**: Consider Zustand or React Query for server state
3. **Optimistic Updates**: Update UI before server confirmation
4. **Error Boundaries**: Catch and handle API errors gracefully

### If Adding Real-time Updates

1. **WebSocket Client**: Add to `src/utils/websocket.ts`
2. **Event System**: Broadcast task changes to all clients
3. **Conflict Resolution**: Handle simultaneous edits

### If Scaling Component Library

1. **Storybook**: Document components
2. **Design Tokens**: Extract to separate package
3. **Theming**: Support multiple themes
4. **Component Variants**: Expand component APIs


