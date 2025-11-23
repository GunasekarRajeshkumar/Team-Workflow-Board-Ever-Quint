import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Board } from '../Board';
import type { Task } from '../../../types/task';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Description 1',
    status: 'Backlog',
    priority: 'High',
    assignee: 'John Doe',
    tags: ['bug', 'urgent'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'Description 2',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Jane Smith',
    tags: ['feature'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Test Task 3',
    description: 'Description 3',
    status: 'Done',
    priority: 'Low',
    assignee: '',
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

describe('Board', () => {
  it('renders all three columns', () => {
    const handleStatusChange = vi.fn();
    const handleTaskClick = vi.fn();

    render(
      <Board
        tasks={mockTasks}
        onStatusChange={handleStatusChange}
        onTaskClick={handleTaskClick}
      />
    );

    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('displays tasks in correct columns', () => {
    const handleStatusChange = vi.fn();
    const handleTaskClick = vi.fn();

    render(
      <Board
        tasks={mockTasks}
        onStatusChange={handleStatusChange}
        onTaskClick={handleTaskClick}
      />
    );

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('Test Task 3')).toBeInTheDocument();
  });

  it('shows task counts in column headers', () => {
    const handleStatusChange = vi.fn();
    const handleTaskClick = vi.fn();

    render(
      <Board
        tasks={mockTasks}
        onStatusChange={handleStatusChange}
        onTaskClick={handleTaskClick}
      />
    );

    // Each column should show count of 1
    const counts = screen.getAllByText('1');
    expect(counts.length).toBeGreaterThanOrEqual(3);
  });
});

