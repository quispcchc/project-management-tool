import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getActivityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await prisma.activityLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        project: { select: { name: true } }
      }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalProjects = await prisma.project.count();
    const activeProjects = await prisma.project.count({ where: { status: 'IN_PROGRESS' } });
    const completedProjects = await prisma.project.count({ where: { status: 'COMPLETED' } });
    const pendingTasks = await prisma.task.count({ where: { status: { not: 'DONE' } } });
    
    // Overdue tasks (due date before now and not done)
    const overdueTasks = await prisma.task.count({
      where: {
        status: { not: 'DONE' },
        dueDate: { lt: new Date() }
      }
    });

    // Tasks completed this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const completedThisWeek = await prisma.task.count({
      where: {
        status: 'DONE',
        updatedDate: { gte: oneWeekAgo }
      }
    });

    res.json({
      totalProjects,
      activeProjects,
      completedProjects,
      pendingTasks,
      overdueTasks,
      completedThisWeek
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
