import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const getTasks = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.query;
  try {
    const where = projectId ? { projectId: String(projectId) } : {};
    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } }
      }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const { projectId, title, description, assignedId, dueDate, priority, status } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description,
        assignedId,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        status
      }
    });

    await prisma.activityLog.create({
      data: {
        projectId,
        userId: req.user.id,
        action: 'TASK_CREATED',
        details: `Task "${title}" was created.`
      }
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, assignedId, dueDate, priority, status } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        assignedId,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        status
      }
    });

    await prisma.activityLog.create({
      data: {
        projectId: task.projectId,
        userId: req.user.id,
        action: 'TASK_UPDATED',
        details: `Task "${title}" was updated/moved to ${status}.`
      }
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.delete({ where: { id } });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;
  const { content } = req.body;
  try {
    const comment = await prisma.taskComment.create({
      data: {
        taskId,
        userId: req.user.id,
        content
      }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
