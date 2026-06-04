INSERT INTO "Project" (id, name, description, "clientName", status, priority, "ownerId") VALUES
('11111111-1111-1111-1111-111111111111', 'Project Alpha', 'A high-priority internal project.', 'Internal', 'IN_PROGRESS', 'HIGH', 'd2222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "ProjectMember" (id, "projectId", "userId", "roleInProject", responsibility) VALUES
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'd3333333-3333-3333-3333-333333333333', 'Developer', 'Backend API development')
ON CONFLICT ("projectId", "userId") DO NOTHING;

INSERT INTO "Task" (id, "projectId", title, description, "assignedId", status, priority) VALUES
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Setup Database', 'Design and implement the SQL schema.', 'd3333333-3333-3333-3333-333333333333', 'TODO', 'CRITICAL');