export type Role = 'Admin' | 'Editor' | 'Viewer' | 'Approver';

export interface User {
  id: string;
  name: string;
  email: string;
  systemRole: Role;
  avatarUrl?: string;
}

export type ProjectStatus = 'Active' | 'Completed' | 'Archived';

export interface Project {
  id: string;
  name: string;
  clientName: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export type DocumentStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Released';

export interface Document {
  id: string;
  projectId: string;
  title: string;
  category: string;
  description?: string;
  status: DocumentStatus;
  currentVersionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocVersion {
  id: string;
  docId: string;
  versionNumber: number;
  filePath: string;
  fileName: string;
  textContent: string; // Simplified for prototype: stores the full text content
  createdById: string;
  createdAt: string;
  changeLog?: string;
}

export interface ReviewComment {
  id: string;
  docVersionId: string;
  authorId: string;
  lineNumber?: number;
  content: string;
  resolved: boolean;
  createdAt: string;
}

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Approval {
  id: string;
  docVersionId: string;
  approverId: string;
  status: ApprovalStatus;
  comments?: string;
  decisionDate?: string;
}
