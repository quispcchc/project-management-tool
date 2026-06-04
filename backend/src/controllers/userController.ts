import { Response } from 'express';
import db from '../db';
import { AuthRequest } from '../middleware/auth';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.query('SELECT id, email, name, role FROM "User"');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getActivityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const queryText = `
      SELECT al.*, 
             json_build_object('name', u.name) as user,
             json_build_object('name', p.name) as project
      FROM "ActivityLog" al
      JOIN "User" u ON al."userId" = u.id
      LEFT JOIN "Project" p ON al."projectId" = p.id
      ORDER BY al."createdAt" DESC
      LIMIT 50
    `;
    const result = await db.query(queryText);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const statsQuery = `
      SELECT
        (SELECT count(*) FROM "Project") as total_projects,
        (SELECT count(*) FROM "Project" WHERE status = 'IN_PROGRESS') as active_projects,
        (SELECT count(*) FROM "Project" WHERE status = 'COMPLETED') as completed_projects,
        (SELECT count(*) FROM "Task" WHERE status != 'DONE') as pending_tasks,
        (SELECT count(*) FROM "Task" WHERE status != 'DONE' AND "dueDate" < NOW()) as overdue_tasks,
        (SELECT count(*) FROM "Task" WHERE status = 'DONE' AND "updatedDate" >= NOW() - INTERVAL '7 days') as completed_this_week
    `;
    const result = await db.query(statsQuery);
    const stats = result.rows[0];

    res.json({
      totalProjects: parseInt(stats.total_projects),
      activeProjects: parseInt(stats.active_projects),
      completedProjects: parseInt(stats.completed_projects),
      pendingTasks: parseInt(stats.pending_tasks),
      overdueTasks: parseInt(stats.overdue_tasks),
      completedThisWeek: parseInt(stats.completed_this_week)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
