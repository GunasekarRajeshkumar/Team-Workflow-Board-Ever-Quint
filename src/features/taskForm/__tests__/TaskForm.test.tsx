import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../TaskForm';
import type { Task } from '../../../types/task';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'Backlog',
  priority: 'High',
  assignee: 'John Doe',
  tags: ['bug'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('TaskForm', () => {
  it('renders create form when no task provided', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);

    expect(screen.getByText('Create Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('renders edit form when task provided', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<TaskForm task={mockTask} onSubmit={onSubmit} onCancel={onCancel} />);

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);

    await user.type(screen.getByLabelText(/title/i), 'New Task');
    await user.type(screen.getByLabelText(/description/i), 'New Description');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          description: 'New Description',
        })
      );
    });
  });
});

