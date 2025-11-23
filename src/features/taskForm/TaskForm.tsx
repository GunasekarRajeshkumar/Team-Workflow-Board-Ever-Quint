import React, { useEffect, useState } from 'react';
import type { Task, TaskFormData, TaskStatus, TaskPriority } from '../../types/task';
import { TextInput } from '../../components/ui/TextInput';
import { TextArea } from '../../components/ui/TextArea';
import { Select } from '../../components/ui/Select';
import type { SelectOption } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { useForm } from '../../hooks/useForm';
import styles from './TaskForm.module.css';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

const statusOptions: SelectOption[] = [
  { value: 'Backlog', label: 'Backlog' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Done', label: 'Done' },
];

const priorityOptions: SelectOption[] = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

const validateForm = (values: TaskFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required';
  }

  return errors;
};

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, onDirtyChange }) => {
  const initialValues: TaskFormData = task
    ? {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        tags: task.tags,
      }
    : {
        title: '',
        description: '',
        status: 'Backlog',
        priority: 'Medium',
        assignee: '',
        tags: [],
      };

  const { values, errors, touched, handleChange, handleBlur, validateForm: validate, setFieldValue, isDirty } =
    useForm(initialValues, validateForm);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    // Focus first input when form opens
    const firstInput = document.querySelector<HTMLInputElement>('input[name="title"]');
    firstInput?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !values.tags.includes(tag)) {
      setFieldValue('tags', [...values.tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFieldValue(
      'tags',
      values.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <TextInput
        name="title"
        label="Title"
        value={values.title}
        onChange={(e) => handleChange('title', e.target.value)}
        onBlur={() => handleBlur('title')}
        error={touched.title ? errors.title : undefined}
        required
      />

      <TextArea
        name="description"
        label="Description"
        value={values.description}
        onChange={(e) => handleChange('description', e.target.value)}
        onBlur={() => handleBlur('description')}
        error={touched.description ? errors.description : undefined}
        required
        rows={4}
      />

      <div className={styles.row}>
        <Select
          name="status"
          label="Status"
          value={values.status}
          onChange={(e) => handleChange('status', e.target.value as TaskStatus)}
          options={statusOptions}
        />

        <Select
          name="priority"
          label="Priority"
          value={values.priority}
          onChange={(e) => handleChange('priority', e.target.value as TaskPriority)}
          options={priorityOptions}
        />
      </div>

      <TextInput
        name="assignee"
        label="Assignee"
        value={values.assignee}
        onChange={(e) => handleChange('assignee', e.target.value)}
        placeholder="Enter assignee name"
      />

      <div className={styles.tagsSection}>
        <label className={styles.label}>Tags</label>
        <div className={styles.tagInput}>
          <TextInput
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Add a tag and press Enter"
          />
          <Button type="button" onClick={handleAddTag} size="sm">
            Add
          </Button>
        </div>
        {values.tags.length > 0 && (
          <div className={styles.tags}>
            {values.tags.map((tag) => (
              <Tag key={tag} onRemove={() => handleRemoveTag(tag)}>
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

