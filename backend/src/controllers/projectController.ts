import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        owner: { select: { id: true, name: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        _count: { select: { tasks: true } }
      }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        tasks: { include: { assignedTo: { select: { id: true, name: true } } } }
      }
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  const { name, description, clientName, startDate, endDate, status, priority, notes } = req.body;
  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        clientName,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status,
        priority,
        notes,
        ownerId: req.user.id
      }
    });

    await prisma.activityLog.create({
      data: {
        projectId: project.id,
        userId: req.user.id,
        action: 'PROJECT_CREATED',
        details: `Project "${name}" was created.`
      }
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, clientName, startDate, endDate, status, priority, notes } = req.body;
  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        clientName,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status,
        priority,
        notes
      }
    });

    await prisma.activityLog.create({
      data: {
        projectId: id,
        userId: req.user.id,
        action: 'PROJECT_UPDATED',
        details: `Project "${name}" was updated.`
      }
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.project.delete({ where: { id } });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addProjectMember = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params;
  const { userId, roleInProject, responsibility, allocation } = req.body;
  try {
    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        roleInProject,
        responsibility,
        allocation: allocation || 100
      }
    });

    await prisma.activityLog.create({
      data: {
        projectId,
        userId: req.user.id,
        action: 'MEMBER_ADDED',
        details: `User added to project with role ${roleInProject}.`
      }
    });

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const removeProjectMember = async (req: AuthRequest, res: Response) => {
  const { projectId, memberId } = req.params;
  try {
    await prisma.projectMember.delete({ where: { id: memberId } });
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
