-- Initial Users (Password is 'password123' hashed with bcrypt)
INSERT INTO "User" (id, email, password, name, role) VALUES 
('d1111111-1111-1111-1111-111111111111', 'admin@example.com', '$2a$10$vI8meZl1p9tJ04T/N8iH/.v.Dk9VjR.2RzI6mX0XyG8oK.y.E.y.e', 'System Admin', 'SUPER_ADMIN'),
('d2222222-2222-2222-2222-222222222222', 'manager@example.com', '$2a$10$vI8meZl1p9tJ04T/N8iH/.v.Dk9VjR.2RzI6mX0XyG8oK.y.E.y.e', 'Project Manager', 'MANAGER'),
('d3333333-3333-3333-3333-333333333333', 'dev@example.com', '$2a$10$vI8meZl1p9tJ04T/N8iH/.v.Dk9VjR.2RzI6mX0XyG8oK.y.E.y.e', 'Lead Developer', 'TEAM_MEMBER');

-- Initial Project
INSERT INTO "Project" (id, name, description, "clientName", status, priority, "ownerId") VALUES
('p1111111-1111-1111-1111-111111111111', 'Project Alpha', 'A high-priority internal project.', 'Internal', 'IN_PROGRESS', 'HIGH', 'd2222222-2222-2222-2222-222222222222');

-- Project Member
INSERT INTO "ProjectMember" (id, "projectId", "userId", "roleInProject", responsibility) VALUES
(gen_random_uuid(), 'p1111111-1111-1111-1111-111111111111', 'd3333333-3333-3333-3333-333333333333', 'Developer', 'Backend API development');

-- Initial Task
INSERT INTO "Task" (id, "projectId", title, description, "assignedId", status, priority) VALUES
(gen_random_uuid(), 'p1111111-1111-1111-1111-111111111111', 'Setup Database', 'Design and implement the SQL schema.', 'd3333333-3333-3333-3333-333333333333', 'TODO', 'CRITICAL');
