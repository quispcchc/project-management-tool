import { Response } from 'express';
import db from '../db';
import { AuthRequest } from '../middleware/auth';

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const queryText = `
      SELECT p.*, 
             json_build_object('id', u.id, 'name', u.name) as owner,
             (SELECT count(*) FROM "Task" t WHERE t."projectId" = p.id) as task_count
      FROM "Project" p
      JOIN "User" u ON p."ownerId" = u.id
    `;
    const result = await db.query(queryText);
    
    // Map to match frontend expectations if necessary
    const projects = result.rows.map(row => ({
      ...row,
      _count: { tasks: parseInt(row.task_count) }
    }));
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const projectResult = await db.query(
      'SELECT p.*, json_build_object(\'id\', u.id, \'name\', u.name) as owner FROM "Project" p JOIN "User" u ON p."ownerId" = u.id WHERE p.id = $1',
      [id]
    );
    const project = projectResult.rows[0];
    
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Fetch members
    const membersResult = await db.query(
      'SELECT pm.*, json_build_object(\'id\', u.id, \'name\', u.name, \'email\', u.email) as user FROM "ProjectMember" pm JOIN "User" u ON pm."userId" = u.id WHERE pm."projectId" = $1',
      [id]
    );
    project.members = membersResult.rows;

    // Fetch tasks
    const tasksResult = await db.query(
      'SELECT t.*, json_build_object(\'id\', u.id, \'name\', u.name) as "assignedTo" FROM "Task" t LEFT JOIN "User" u ON t."assignedId" = u.id WHERE t."projectId" = $1',
      [id]
    );
    project.tasks = tasksResult.rows;

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  const { name, description, clientName, startDate, endDate, status, priority, notes } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO "Project" (id, name, description, "clientName", "startDate", "endDate", status, priority, notes, "ownerId", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING *',
      [name, description, clientName, startDate ? new Date(startDate) : null, endDate ? new Date(endDate) : null, status || 'NOT_STARTED', priority || 'MEDIUM', notes, req.user.id]
    );
    const project = result.rows[0];

    await db.query(
      'INSERT INTO "ActivityLog" (id, "projectId", "userId", action, details, "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())',
      [project.id, req.user.id, 'PROJECT_CREATED', `Project "${name}" was created.`]
    );

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const { name, description, clientName, startDate, endDate, status, priority, notes } = req.body;
  try {
    const result = await db.query(
      'UPDATE "Project" SET name = $1, description = $2, "clientName" = $3, "startDate" = $4, "endDate" = $5, status = $6, priority = $7, notes = $8, "updatedAt" = NOW() WHERE id = $9 RETURNING *',
      [name, description, clientName, startDate ? new Date(startDate) : null, endDate ? new Date(endDate) : null, status, priority, notes, id]
    );
    const project = result.rows[0];

    await db.query(
      'INSERT INTO "ActivityLog" (id, "projectId", "userId", action, details, "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())',
      [id, req.user.id, 'PROJECT_UPDATED', `Project "${name}" was updated.`]
    );

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    await db.query('DELETE FROM "Project" WHERE id = $1', [id]);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addProjectMember = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params as { projectId: string };
  const { userId, roleInProject, responsibility, allocation } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO "ProjectMember" (id, "projectId", "userId", "roleInProject", responsibility, allocation) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *',
      [projectId, userId, roleInProject, responsibility, allocation || 100]
    );
    const member = result.rows[0];

    await db.query(
      'INSERT INTO "ActivityLog" (id, "projectId", "userId", action, details, "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())',
      [projectId, req.user.id, 'MEMBER_ADDED', `User added to project with role ${roleInProject}.`]
    );

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const removeProjectMember = async (req: AuthRequest, res: Response) => {
  const { projectId, memberId } = req.params as { projectId: string, memberId: string };
  try {
    await db.query('DELETE FROM "ProjectMember" WHERE id = $1', [memberId]);
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
