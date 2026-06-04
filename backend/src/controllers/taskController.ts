import { Response } from 'express';
import db from '../db';
import { AuthRequest } from '../middleware/auth';

export const getTasks = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.query;
  try {
    let queryText = `
      SELECT t.*, 
             json_build_object('id', u.id, 'name', u.name) as "assignedTo",
             json_build_object('id', p.id, 'name', p.name) as project
      FROM "Task" t
      LEFT JOIN "User" u ON t."assignedId" = u.id
      JOIN "Project" p ON t."projectId" = p.id
    `;
    const params: any[] = [];
    
    if (projectId) {
      queryText += ' WHERE t."projectId" = $1';
      params.push(projectId);
    }

    const result = await db.query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const { projectId, title, description, assignedId, dueDate, priority, status } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO "Task" (id, "projectId", title, description, "assignedId", "dueDate", priority, status, "createdDate", "updatedDate") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *',
      [projectId, title, description, assignedId, dueDate ? new Date(dueDate) : null, priority || 'MEDIUM', status || 'TODO']
    );
    const task = result.rows[0];

    await db.query(
      'INSERT INTO "ActivityLog" (id, "projectId", "userId", action, details, "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())',
      [projectId, req.user.id, 'TASK_CREATED', `Task "${title}" was created.`]
    );

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const { title, description, assignedId, dueDate, priority, status } = req.body;
  try {
    const result = await db.query(
      'UPDATE "Task" SET title = $1, description = $2, "assignedId" = $3, "dueDate" = $4, priority = $5, status = $6, "updatedDate" = NOW() WHERE id = $7 RETURNING *',
      [title, description, assignedId, dueDate ? new Date(dueDate) : null, priority, status, id]
    );
    const task = result.rows[0];

    await db.query(
      'INSERT INTO "ActivityLog" (id, "projectId", "userId", action, details, "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())',
      [task.projectId, req.user.id, 'TASK_UPDATED', `Task "${title}" was updated/moved to ${status}.`]
    );

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    await db.query('DELETE FROM "Task" WHERE id = $1', [id]);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params as { taskId: string };
  const { content } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO "TaskComment" (id, "taskId", "userId", content, "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW()) RETURNING *',
      [taskId, req.user.id, content]
    );
    const comment = result.rows[0];
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
