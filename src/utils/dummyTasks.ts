import type { Task, TaskStatus, TaskPriority } from '../types/task';

const dummyTitles = [
  'Implement user authentication',
  'Design landing page mockup',
  'Fix login bug on mobile',
  'Add dark mode support',
  'Optimize database queries',
  'Write API documentation',
  'Create user dashboard',
  'Fix responsive layout issues',
  'Add email notifications',
  'Implement search functionality',
  'Refactor authentication service',
  'Add unit tests for utils',
  'Design new logo',
  'Update dependencies',
  'Fix memory leak in component',
  'Add error boundary',
  'Create onboarding flow',
  'Implement file upload',
  'Add analytics tracking',
  'Optimize bundle size',
];

const dummyDescriptions = [
  'Implement secure user authentication with JWT tokens and refresh token mechanism.',
  'Create a modern and responsive landing page design with animations.',
  'Fix the login form bug that occurs on mobile devices when keyboard appears.',
  'Add dark mode toggle with system preference detection and manual override.',
  'Optimize slow database queries by adding proper indexes and query optimization.',
  'Write comprehensive API documentation with examples and code snippets.',
  'Build a user dashboard with widgets, charts, and activity feed.',
  'Fix responsive layout issues on tablet devices and improve mobile experience.',
  'Implement email notification system for important user actions.',
  'Add full-text search functionality with filters and sorting options.',
  'Refactor authentication service to improve code quality and maintainability.',
  'Add comprehensive unit tests for utility functions and helpers.',
  'Design a new logo that reflects the brand identity and values.',
  'Update all project dependencies to latest stable versions.',
  'Fix memory leak in React component that causes performance degradation.',
  'Add error boundary components to catch and handle React errors gracefully.',
  'Create an engaging onboarding flow for new users.',
  'Implement secure file upload with progress tracking and validation.',
  'Add analytics tracking for user behavior and feature usage.',
  'Optimize bundle size by code splitting and lazy loading components.',
];

const dummyAssignees = [
  'John Doe',
  'Jane Smith',
  'Mike Johnson',
  'Sarah Williams',
  'David Brown',
  'Emily Davis',
  'Chris Wilson',
  'Amy Martinez',
];

const dummyTags = [
  'frontend',
  'backend',
  'bug',
  'feature',
  'urgent',
  'design',
  'testing',
  'documentation',
  'refactor',
  'performance',
];

const statuses: TaskStatus[] = ['Backlog', 'In Progress', 'Done'];
const priorities: TaskPriority[] = ['Low', 'Medium', 'High'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

function getRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date.toISOString();
}

export function generateDummyTasks(): Task[] {
  const tasks: Task[] = [];
  const now = Date.now();

  for (let i = 0; i < 20; i++) {
    const createdAt = getRandomDate(Math.floor(Math.random() * 30));
    const updatedAt = getRandomDate(Math.floor(Math.random() * 7));
    
    tasks.push({
      id: `dummy-${now}-${i}`,
      title: dummyTitles[i],
      description: dummyDescriptions[i],
      status: getRandomElement(statuses),
      priority: getRandomElement(priorities),
      assignee: Math.random() > 0.3 ? getRandomElement(dummyAssignees) : '',
      tags: getRandomElements(dummyTags, Math.floor(Math.random() * 3) + 1),
      createdAt,
      updatedAt,
    });
  }

  return tasks;
}


