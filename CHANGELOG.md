# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- **User & Role Management**:
    - **Project-Based RBAC**: Implemented role-based access control (Admin, Reviewer, Creator).
    - **Permission Enforcement**: Restricted "New Document" to Creators and "Approve/Reject" to Reviewers.
    - **Secure Downloads**: Restricted file downloads for unapproved documents to authorized users only.
    - **Admin UI**: Added Project Member management interface.

## [0.2.0] - 2026-02-18
### Added
- **Interactive Document Review**:
    - `DocumentReviewer` component for unified view/comment interface.
    - `html-react-parser` integration to make paragraphs clickable.
    - **Per-Line Comments**: Comments are now linked to specific lines in the document.
- **Threaded Replies**:
    - Nested comments support in database and UI.
    - "Reply" button on comments.
- **Navigation**:
    - "Go to Line" feature to smooth-scroll to commented paragraphs.

## [0.1.0] - 2026-02-17
### Added
- Initial project structure (Next.js 14, Prisma, SQLite, Tailwind).
- **DOCX Support**:
    - `mammoth.js` integration for DOCX to HTML conversion.
    - File upload and version management.
- **Diff Viewer**: Text-based comparison between versions.
- **Basic Workflow**: Draft -> Pending -> Approved/Rejected status flow.
