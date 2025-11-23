import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import type { Task, TaskFormData, TaskStatus } from './types/task';
import { useStorage } from './hooks/useStorage';
import { useFilters } from './hooks/useFilters';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { BoardPage } from './pages/BoardPage';
import { TaskForm } from './features/taskForm';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import toast from 'react-hot-toast';
import styles from './App.module.css';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function App() {
  const { tasks, isLoading, error: storageError, migrated, addTask, updateTask } =
    useStorage();
  const { filters, sort, updateFilters, updateSort, clearFilters } = useFilters();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Show migration toast
  useEffect(() => {
    if (migrated) {
      toast.success('Data migrated successfully to the latest version.');
    }
  }, [migrated]);

  // Handle browser navigation warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleCreateTask = useCallback(() => {
    setSelectedTask(null);
    setIsModalOpen(true);
    setIsDirty(false);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    setIsDirty(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to close?'
      );
      if (!confirmed) return;
    }
    setIsModalOpen(false);
    setSelectedTask(null);
    setIsDirty(false);
  }, [isDirty]);

  const handleSubmitTask = useCallback(
    (formData: TaskFormData) => {
      if (selectedTask) {
        updateTask(selectedTask.id, formData);
        toast.success('Task updated successfully!');
      } else {
        const newTask: Task = {
          ...formData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addTask(newTask);
        toast.success('Task created successfully!');
      }
      setIsModalOpen(false);
      setSelectedTask(null);
      setIsDirty(false);
    },
    [selectedTask, addTask, updateTask]
  );

  const handleStatusChange = useCallback(
    (id: string, status: TaskStatus) => {
      updateTask(id, { status });
      toast.success('Task status updated!');
    },
    [updateTask]
  );

  if (isLoading) {
    return (
      <div className={styles.app}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      {storageError && (
        <div className={styles.errorBanner} role="alert">
          {storageError}
        </div>
      )}

      <Routes>
        <Route path="/" element={<Layout tasks={tasks} onCreateTask={handleCreateTask} />}>
          <Route
            index
            element={<Navigate to="/board" replace />}
          />
          <Route
            path="dashboard"
            element={<Dashboard tasks={tasks} />}
          />
          <Route
            path="board"
            element={
              <BoardPage
                tasks={tasks}
                filters={filters}
                sort={sort}
                onFiltersChange={updateFilters}
                onSortChange={updateSort}
                onClearFilters={clearFilters}
                onStatusChange={handleStatusChange}
                onTaskClick={handleEditTask}
              />
            }
          />
        </Route>
      </Routes>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedTask ? 'Edit Task' : 'Create Task'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
          </>
        }
      >
        <TaskForm
          task={selectedTask || undefined}
          onSubmit={handleSubmitTask}
          onCancel={handleCloseModal}
          onDirtyChange={setIsDirty}
        />
      </Modal>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#2C3A50',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(30, 42, 79, 0.1), 0 2px 4px -1px rgba(30, 42, 79, 0.06)',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#28C76F',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EA5455',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
