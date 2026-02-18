import { User, Project, Document, DocVersion, ReviewComment, Approval } from './types';

// Mock Users
export const users: User[] = [
    { id: 'u1', name: 'Alice Admin', email: 'alice@dms.com', role: 'Admin' },
    { id: 'u2', name: 'Bob Editor', email: 'bob@dms.com', role: 'Editor' },
    { id: 'u3', name: 'Charlie Viewer', email: 'charlie@dms.com', role: 'Viewer' },
    { id: 'u4', name: 'Dave Approver', email: 'dave@dms.com', role: 'Approver' },
];

export const currentUser = users[1]; // Simulate logged-in as Editor by default

// Mock Projects
export const projects: Project[] = [
    { id: 'p1', name: 'Website Redesign', clientName: 'Acme Corp', status: 'Active', createdAt: '2023-10-01T10:00:00Z', updatedAt: '2023-10-05T14:00:00Z' },
    { id: 'p2', name: 'Mobile App API', clientName: 'Globex Inc', status: 'Active', createdAt: '2023-11-15T09:00:00Z', updatedAt: '2023-11-20T11:00:00Z' },
    { id: 'p3', name: 'Cloud Migration', clientName: 'Soylent Corp', status: 'Completed', createdAt: '2023-08-01T08:00:00Z', updatedAt: '2023-09-30T17:00:00Z' },
];

// Mock Documents
export const documents: Document[] = [
    { id: 'd1', projectId: 'p1', title: 'System Architecture', category: 'Technical', description: 'High-level design of the system.', status: 'Draft', currentVersionId: 'v1-2', createdAt: '2023-10-02T10:00:00Z', updatedAt: '2023-10-05T15:00:00Z' },
    { id: 'd2', projectId: 'p1', title: 'API Specification', category: 'API', description: 'OpenAPI 3.0 specs.', status: 'Released', currentVersionId: 'v2-1', createdAt: '2023-10-03T11:00:00Z', updatedAt: '2023-10-03T11:00:00Z' },
];

// Mock Versions
export const docVersions: DocVersion[] = [
    {
        id: 'v1-1',
        docId: 'd1',
        versionNumber: 1,
        filePath: '/files/arch-v1.md',
        fileName: 'architecture.md',
        textContent: '# System Architecture\n\nThe system consists of a Frontend and a Backend.\n\n## Backend\n- Node.js\n- Express',
        createdById: 'u2',
        createdAt: '2023-10-02T10:00:00Z',
        changeLog: 'Initial draft'
    },
    {
        id: 'v1-2',
        docId: 'd1',
        versionNumber: 2,
        filePath: '/files/arch-v2.md',
        fileName: 'architecture.md',
        textContent: '# System Architecture\n\nThe system consists of a Frontend, a Backend, and a Database.\n\n## Backend\n- Node.js\n- NestJS (Migrated from Express)\n\n## Database\n- PostgreSQL',
        createdById: 'u2',
        createdAt: '2023-10-05T15:00:00Z',
        changeLog: 'Added database section and updated backend framework'
    },
    {
        id: 'v2-1',
        docId: 'd2',
        versionNumber: 1,
        filePath: '/files/api-v1.json',
        fileName: 'api-spec.json',
        textContent: '{\n  "openapi": "3.0.0",\n  "info": {\n    "title": "Sample API",\n    "version": "1.0.0"\n  }\n}',
        createdById: 'u2',
        createdAt: '2023-10-03T11:00:00Z',
        changeLog: 'Initial release'
    }
];

// Mock Review Comments
export const reviewComments: ReviewComment[] = [
    { id: 'c1', docVersionId: 'v1-2', authorId: 'u4', lineNumber: 6, content: 'Great choice on NestJS!', resolved: false, createdAt: '2023-10-06T09:00:00Z' }
];

// Mock Approvals
export const approvals: Approval[] = [
    { id: 'a1', docVersionId: 'v1-2', approverId: 'u4', status: 'Pending', decisionDate: undefined }
];

// Helper functions to simulate API calls
export const getProjects = async () => projects;
export const getProjectById = async (id: string) => projects.find(p => p.id === id);
export const getDocumentsByProject = async (projectId: string) => documents.filter(d => d.projectId === projectId);
export const getDocumentById = async (id: string) => documents.find(d => d.id === id);
export const getDocVersions = async (docId: string) => docVersions.filter(v => v.docId === docId).sort((a, b) => b.versionNumber - a.versionNumber);
export const getDocVersionById = async (id: string) => docVersions.find(v => v.id === id);
export const getCommentsByVersion = async (versionId: string) => reviewComments.filter(c => c.docVersionId === versionId);
