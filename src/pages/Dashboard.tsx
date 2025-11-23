import React from 'react';
import type { Task, TaskStatus } from '../types/task';
import { Card } from '../components/ui/Card';
import styles from './Dashboard.module.css';

interface DashboardProps {
  tasks: Task[];
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const stats = React.useMemo(() => {
    const total = tasks.length;
    const byStatus = tasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      },
      { Backlog: 0, 'In Progress': 0, Done: 0 } as Record<TaskStatus, number>
    );

    const byPriority = tasks.reduce(
      (acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
      },
      { Low: 0, Medium: 0, High: 0 } as Record<string, number>
    );

    const done = byStatus.Done;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
    const inProgress = byStatus['In Progress'];
    const backlog = byStatus.Backlog;

    // Tasks created this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const tasksThisWeek = tasks.filter(
      task => new Date(task.createdAt) >= weekAgo
    ).length;

    // Tasks completed this week
    const doneTasks = tasks.filter(t => t.status === 'Done');
    const completedThisWeek = doneTasks.filter(
      task => new Date(task.updatedAt) >= weekAgo
    ).length;

    return {
      total,
      byStatus,
      byPriority,
      completionRate,
      done,
      inProgress,
      backlog,
      tasksThisWeek,
      completedThisWeek,
    };
  }, [tasks]);

  const recentTasks = React.useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [tasks]);

  const highPriorityTasks = React.useMemo(() => {
    return tasks
      .filter(task => task.priority === 'High' && task.status !== 'Done')
      .slice(0, 5);
  }, [tasks]);

  // Calculate pie chart angles
  const pieData = React.useMemo(() => {
    const total = stats.total || 1;
    const backlogAngle = (stats.backlog / total) * 360;
    const inProgressAngle = (stats.inProgress / total) * 360;
    const doneAngle = (stats.done / total) * 360;

    let currentAngle = 0;
    return [
      {
        status: 'Backlog',
        count: stats.backlog,
        startAngle: currentAngle,
        endAngle: (currentAngle += backlogAngle),
        percentage: Math.round((stats.backlog / total) * 100),
      },
      {
        status: 'In Progress',
        count: stats.inProgress,
        startAngle: currentAngle,
        endAngle: (currentAngle += inProgressAngle),
        percentage: Math.round((stats.inProgress / total) * 100),
      },
      {
        status: 'Done',
        count: stats.done,
        startAngle: currentAngle,
        endAngle: (currentAngle += doneAngle),
        percentage: Math.round((stats.done / total) * 100),
      },
    ];
  }, [stats]);

  const getPiePath = (startAngle: number, endAngle: number, radius: number) => {
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (endAngle - 90) * (Math.PI / 180);
    const x1 = 50 + radius * Math.cos(start);
    const y1 = 50 + radius * Math.sin(start);
    const x2 = 50 + radius * Math.cos(end);
    const y2 = 50 + radius * Math.sin(end);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Task overview and analytics</p>
      </div>

      <div className={styles.mainLayout}>
        <div className={styles.cardsSection}>
          <div className={styles.statsRow}>
            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <h3 className={styles.statLabel}>Total Tasks</h3>
                <p className={styles.statValue}>{stats.total}</p>
                <div className={styles.statMeta}>
                  <span className={styles.statMetaItem}>
                    Created this week: {stats.tasksThisWeek}
                  </span>
                </div>
              </div>
            </Card>

            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <h3 className={styles.statLabel}>Completed</h3>
                <p className={styles.statValue}>{stats.done}</p>
                <div className={styles.statMeta}>
                  <span className={styles.statMetaItem}>
                    {stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}% of total
                  </span>
                  <span className={styles.statMetaItem}>
                    This week: {stats.completedThisWeek}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className={styles.statsRow}>
            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <h3 className={styles.statLabel}>In Progress</h3>
                <p className={styles.statValue}>{stats.inProgress}</p>
                <div className={styles.statMeta}>
                  <span className={styles.statMetaItem}>
                    {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}% of total
                  </span>
                </div>
              </div>
            </Card>

            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <h3 className={styles.statLabel}>Backlog</h3>
                <p className={styles.statValue}>{stats.backlog}</p>
                <div className={styles.statMeta}>
                  <span className={styles.statMetaItem}>
                    {stats.total > 0 ? Math.round((stats.backlog / stats.total) * 100) : 0}% of total
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Completion Rate</h2>
          <div className={styles.pieChartContainer}>
            <svg viewBox="0 0 100 100" className={styles.pieChart}>
              {pieData.map((segment, index) => {
                const radius = 40;
                const path = getPiePath(segment.startAngle, segment.endAngle, radius);
                const colors = ['var(--color-section-alt)', 'var(--color-primary)', 'var(--color-text)'];
                return (
                  <path
                    key={segment.status}
                    d={path}
                    fill={colors[index]}
                    stroke="var(--color-background)"
                    strokeWidth="2"
                  />
                );
              })}
              <circle cx="50" cy="50" r="25" fill="var(--color-background)" />
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="middle"
                className={styles.pieCenterText}
              >
                {stats.completionRate}%
              </text>
            </svg>
            <div className={styles.pieLegend}>
              {pieData.map((segment, index) => {
                const colors = ['var(--color-section-alt)', 'var(--color-primary)', 'var(--color-text)'];
                return (
                  <div key={segment.status} className={styles.legendItem}>
                    <div
                      className={styles.legendColor}
                      style={{ backgroundColor: colors[index] }}
                    />
                    <span className={styles.legendLabel}>{segment.status}</span>
                    <span className={styles.legendValue}>{segment.count} ({segment.percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      <div className={styles.trackingGrid}>
        <Card className={styles.trackingCard}>
          <h2 className={styles.chartTitle}>Weekly Activity</h2>
          <div className={styles.trackingContent}>
            <div className={styles.trackingItem}>
              <span className={styles.trackingLabel}>Tasks Created</span>
              <span className={styles.trackingValue}>{stats.tasksThisWeek}</span>
            </div>
            <div className={styles.trackingItem}>
              <span className={styles.trackingLabel}>Tasks Completed</span>
              <span className={styles.trackingValue}>{stats.completedThisWeek}</span>
            </div>
            <div className={styles.trackingItem}>
              <span className={styles.trackingLabel}>Completion Rate</span>
              <span className={styles.trackingValue}>{stats.completionRate}%</span>
            </div>
          </div>
        </Card>

        <Card className={styles.trackingCard}>
          <h2 className={styles.chartTitle}>Priority Distribution</h2>
          <div className={styles.priorityChart}>
            <div className={styles.priorityItem}>
              <div className={styles.priorityBar}>
                <div
                  className={styles.priorityFill}
                  style={{ width: `${stats.total > 0 ? (stats.byPriority.High / stats.total) * 100 : 0}%` }}
                />
              </div>
              <div className={styles.priorityInfo}>
                <span className={styles.priorityLabel}>High</span>
                <span className={styles.priorityValue}>{stats.byPriority.High}</span>
              </div>
            </div>
            <div className={styles.priorityItem}>
              <div className={styles.priorityBar}>
                <div
                  className={styles.priorityFill}
                  style={{ width: `${stats.total > 0 ? (stats.byPriority.Medium / stats.total) * 100 : 0}%` }}
                />
              </div>
              <div className={styles.priorityInfo}>
                <span className={styles.priorityLabel}>Medium</span>
                <span className={styles.priorityValue}>{stats.byPriority.Medium}</span>
              </div>
            </div>
            <div className={styles.priorityItem}>
              <div className={styles.priorityBar}>
                <div
                  className={styles.priorityFill}
                  style={{ width: `${stats.total > 0 ? (stats.byPriority.Low / stats.total) * 100 : 0}%` }}
                />
              </div>
              <div className={styles.priorityInfo}>
                <span className={styles.priorityLabel}>Low</span>
                <span className={styles.priorityValue}>{stats.byPriority.Low}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className={styles.tasksGrid}>
        <Card className={styles.recentCard}>
          <h2 className={styles.chartTitle}>Recent Tasks</h2>
          <div className={styles.recentTasks}>
            {recentTasks.length === 0 ? (
              <p className={styles.emptyText}>No tasks yet</p>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className={styles.recentTaskItem}>
                  <div className={styles.recentTaskInfo}>
                    <h4 className={styles.recentTaskTitle}>{task.title}</h4>
                    <p className={styles.recentTaskMeta}>
                      {task.status} • {task.priority} Priority
                    </p>
                  </div>
                  <div className={styles.recentTaskBadge}>
                    <span className={styles.statusBadge}>{task.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className={styles.recentCard}>
          <h2 className={styles.chartTitle}>High Priority Tasks</h2>
          <div className={styles.recentTasks}>
            {highPriorityTasks.length === 0 ? (
              <p className={styles.emptyText}>No high priority tasks</p>
            ) : (
              highPriorityTasks.map((task) => (
                <div key={task.id} className={styles.recentTaskItem}>
                  <div className={styles.recentTaskInfo}>
                    <h4 className={styles.recentTaskTitle}>{task.title}</h4>
                    <p className={styles.recentTaskMeta}>
                      {task.status} • {task.assignee || 'Unassigned'}
                    </p>
                  </div>
                  <div className={styles.recentTaskBadge}>
                    <span className={styles.statusBadge}>{task.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
