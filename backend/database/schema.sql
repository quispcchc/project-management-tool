-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'MANAGER', 'TEAM_MEMBER');
CREATE TYPE "ProjectStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED');
CREATE TYPE "ProjectPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'BLOCKED', 'REVIEW', 'DONE');
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- User Table
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role "UserRole" DEFAULT 'TEAM_MEMBER',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project Table
CREATE TABLE "Project" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    "clientName" TEXT,
    "startDate" TIMESTAMP WITH TIME ZONE,
    "endDate" TIMESTAMP WITH TIME ZONE,
    status "ProjectStatus" DEFAULT 'NOT_STARTED',
    priority "ProjectPriority" DEFAULT 'MEDIUM',
    notes TEXT,
    "ownerId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ProjectMember Table
CREATE TABLE "ProjectMember" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL REFERENCES "Project"(id) ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "roleInProject" TEXT NOT NULL,
    responsibility TEXT,
    allocation INTEGER DEFAULT 100,
    "isActive" BOOLEAN DEFAULT true,
    UNIQUE("projectId", "userId")
);

-- Task Table
CREATE TABLE "Task" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL REFERENCES "Project"(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "assignedId" UUID REFERENCES "User"(id) ON DELETE SET NULL,
    "dueDate" TIMESTAMP WITH TIME ZONE,
    priority "TaskPriority" DEFAULT 'MEDIUM',
    status "TaskStatus" DEFAULT 'TODO',
    "createdDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TaskComment Table
CREATE TABLE "TaskComment" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "taskId" UUID NOT NULL REFERENCES "Task"(id) ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ActivityLog Table
CREATE TABLE "ActivityLog" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" UUID REFERENCES "Project"(id) ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
