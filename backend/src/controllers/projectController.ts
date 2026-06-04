import { Response } from 'express';
import db from '../db';
import { AuthRequest } from '../middleware/auth';

const mapProjectStatus = (status: string) => {
  const map: Record<string, string> = {
    NOT_STARTED: 'Planning',
    IN_PROGRESS: 'In Progress',
    ON_HOLD: 'At Risk',
    COMPLETED: 'Completed'
  };

  return map[status] || 'Planning';
};

const calculateProgress = (
  status: string,
  totalTasks: number,
  completedTasks: number
) => {
  if (status === 'COMPLETED') return 100;
  if (!totalTasks) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.query(`
      SELECT
        p.id,
        p.name,
        p.description,
        p."clientName",
        p."startDate",
        p."endDate",
        p.status,
        p.priority,
        p.notes,
        p.requirements,
        p."createdAt",
        p."updatedAt",
        u.name AS "ownerName",
        COUNT(DISTINCT pm.id) AS "memberCount",
        COUNT(DISTINCT t.id) AS "taskCount",
        COUNT(DISTINCT CASE WHEN t.status = 'DONE' THEN t.id END) AS "completedTaskCount"
      FROM "Project" p
      JOIN "User" u ON p."ownerId" = u.id
      LEFT JOIN "ProjectMember" pm ON pm."projectId" = p.id AND pm."isActive" = true
      LEFT JOIN "Task" t ON t."projectId" = p.id
      GROUP BY p.id, u.name
      ORDER BY p."createdAt" DESC
    `);

    const projects = result.rows.map(row => {
      const taskCount = Number(row.taskCount || 0);
      const completedTaskCount = Number(row.completedTaskCount || 0);

      return {
        id: row.id,
        name: row.name,
        description: row.description,
        clientName: row.clientName,
        status: row.status,
        displayStatus: mapProjectStatus(row.status),
        priority: row.priority,
        owner: row.ownerName,
        members: Number(row.memberCount || 0),
        tasks: taskCount,
        progress: calculateProgress(row.status, taskCount, completedTaskCount),
        requirements: row.requirements,
        dueDate: row.endDate
          ? new Date(row.endDate).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            })
          : null,
        startDate: row.startDate,
        endDate: row.endDate,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      };
    });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const projectResult = await db.query(
      `
      SELECT
        p.*,
        u.name AS "ownerName",
        u.email AS "ownerEmail"
      FROM "Project" p
      JOIN "User" u ON p."ownerId" = u.id
      WHERE p.id = $1
      `,
      [id]
    );

    const project = projectResult.rows[0];

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const membersResult = await db.query(
      `
      SELECT
        pm.id,
        pm."roleInProject",
        pm.responsibility,
        pm.allocation,
        pm."isActive",
        u.id AS "userId",
        u.name,
        u.email,
        u.role
      FROM "ProjectMember" pm
      JOIN "User" u ON pm."userId" = u.id
      WHERE pm."projectId" = $1
      ORDER BY u.name ASC
      `,
      [id]
    );

    const tasksResult = await db.query(
      `
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t."dueDate",
        t."createdDate",
        t."updatedDate",
        u.id AS "assignedUserId",
        u.name AS "assignee"
      FROM "Task" t
      LEFT JOIN "User" u ON t."assignedId" = u.id
      WHERE t."projectId" = $1
      ORDER BY t."createdDate" DESC
      `,
      [id]
    );

    const totalTasks = tasksResult.rows.length;
    const completedTasks = tasksResult.rows.filter(task => task.status === 'DONE').length;

    res.json({
      id: project.id,
      name: project.name,
      description: project.description,
      clientName: project.clientName,
      status: project.status,
      displayStatus: mapProjectStatus(project.status),
      priority: project.priority,
      notes: project.notes,
      owner: project.ownerName,
      ownerEmail: project.ownerEmail,
      startDate: project.startDate,
      endDate: project.endDate,
      dueDate: project.endDate
        ? new Date(project.endDate).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          })
        : null,
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      progress: calculateProgress(project.status, totalTasks, completedTasks),
      requirements: project.requirements,
      members: membersResult.rows,
      tasks: tasksResult.rows
    });
  } catch (error) {
    console.error('Get project by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  const {
    name,
    description,
    clientName,
    startDate,
    endDate,
    status,
    priority,
    notes,
    requirements
  } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  try {
    const result = await db.query(
      `
      INSERT INTO "Project"
      (
        id,
        name,
        description,
        "clientName",
        "startDate",
        "endDate",
        status,
        priority,
        notes,
        requirements,
        "ownerId",
        "createdAt",
        "updatedAt"
      )
      VALUES
      (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        NOW(),
        NOW()
      )
      RETURNING *
      `,
      [
        name.trim(),
        description || null,
        clientName || null,
        startDate || null,
        endDate || null,
        status || 'NOT_STARTED',
        priority || 'MEDIUM',
        notes || null,
        requirements || null,
        req.user.id
      ]
    );

    const project = result.rows[0];

    await db.query(
      `
      INSERT INTO "ActivityLog"
      (
        id,
        "projectId",
        "userId",
        action,
        details,
        "createdAt"
      )
      VALUES
      (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4,
        NOW()
      )
      `,
      [
        project.id,
        req.user.id,
        'PROJECT_CREATED',
        `Project "${project.name}" was created.`
      ]
    );

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    clientName,
    startDate,
    endDate,
    status,
    priority,
    notes,
    requirements
  } = req.body;

  try {
    const result = await db.query(
      `
      UPDATE "Project"
      SET
        name = $1,
        description = $2,
        "clientName" = $3,
        "startDate" = $4,
        "endDate" = $5,
        status = $6,
        priority = $7,
        notes = $8,
        requirements = $9,
        "updatedAt" = NOW()
      WHERE id = $10
      RETURNING *
      `,
      [
        name,
        description || null,
        clientName || null,
        startDate || null,
        endDate || null,
        status,
        priority,
        notes || null,
        requirements || null,
        id
      ]
    );

    const project = result.rows[0];

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await db.query(
      `
      INSERT INTO "ActivityLog"
      (
        id,
        "projectId",
        "userId",
        action,
        details,
        "createdAt"
      )
      VALUES
      (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4,
        NOW()
      )
      `,
      [
        id,
        req.user.id,
        'PROJECT_UPDATED',
        `Project "${project.name}" was updated.`
      ]
    );

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const existing = await db.query(
      'SELECT id, name FROM "Project" WHERE id = $1',
      [id]
    );

    if (!existing.rows[0]) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await db.query('DELETE FROM "Project" WHERE id = $1', [id]);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addProjectMember = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params;
  const { userId, roleInProject, responsibility, allocation } = req.body;

  try {
    const result = await db.query(
      `
      INSERT INTO "ProjectMember"
      (
        id,
        "projectId",
        "userId",
        "roleInProject",
        responsibility,
        allocation
      )
      VALUES
      (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4,
        $5
      )
      ON CONFLICT ("projectId", "userId")
      DO UPDATE
      SET
        "roleInProject" = EXCLUDED."roleInProject",
        responsibility = EXCLUDED.responsibility,
        allocation = EXCLUDED.allocation,
        "isActive" = true
      RETURNING *
      `,
      [
        projectId,
        userId,
        roleInProject,
        responsibility || null,
        allocation || 100
      ]
    );

    await db.query(
      `
      INSERT INTO "ActivityLog"
      (
        id,
        "projectId",
        "userId",
        action,
        details,
        "createdAt"
      )
      VALUES
      (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4,
        NOW()
      )
      `,
      [
        projectId,
        req.user.id,
        'MEMBER_ADDED',
        `User added to project with role ${roleInProject}.`
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add project member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeProjectMember = async (req: AuthRequest, res: Response) => {
  const { projectId, memberId } = req.params;

  try {
    await db.query(
      `
      UPDATE "ProjectMember"
      SET "isActive" = false
      WHERE id = $1 AND "projectId" = $2
      `,
      [memberId, projectId]
    );

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove project member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
