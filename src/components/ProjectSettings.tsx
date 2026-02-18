'use client';

import { useState, useEffect } from 'react';
import { getAllUsers, addProjectMember, removeProjectMember, getProjectMembers } from '@/app/admin-actions';
import { User } from '@/lib/types';

interface ProjectSettingsProps {
    projectId: string;
}

interface Member {
    id: string;
    userId: string;
    role: string;
    user: Partial<User>;
}

export default function ProjectSettings({ projectId }: ProjectSettingsProps) {
    const [members, setMembers] = useState<Member[]>([]);
    const [allUsers, setAllUsers] = useState<Partial<User>[]>([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedRole, setSelectedRole] = useState('Viewer');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [projectId]);

    async function loadData() {
        setLoading(true);
        const [membersRes, usersRes] = await Promise.all([
            getProjectMembers(projectId),
            getAllUsers()
        ]);

        if (membersRes.success && membersRes.members) {
            // @ts-ignore
            setMembers(membersRes.members);
        }
        if (usersRes.success && usersRes.users) {
            // @ts-ignore
            setAllUsers(usersRes.users);
        }
        setLoading(false);
    }

    async function handleAddMember(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedUserId) return;

        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('userId', selectedUserId);
        formData.append('role', selectedRole);

        const res = await addProjectMember(formData);
        if (res.success) {
            loadData();
            setSelectedUserId('');
        } else {
            alert(res.error);
        }
    }

    async function handleRemoveMember(memberId: string) {
        if (!confirm('Are you sure?')) return;
        const res = await removeProjectMember(memberId, projectId);
        if (res.success) {
            loadData();
        } else {
            alert(res.error);
        }
    }

    if (loading) return <div>Loading settings...</div>;

    // Filter out users who are already members
    const availableUsers = allUsers.filter(u => !members.find(m => m.userId === u.id));

    return (
        <div className="bg-white p-6 rounded-lg shadow mt-8">
            <h2 className="text-xl font-bold mb-4">Project Members (Access Control)</h2>

            {/* Add Member Form */}
            <form onSubmit={handleAddMember} className="flex gap-4 mb-6 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">User</label>
                    <select
                        className="w-full border rounded p-2"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        required
                    >
                        <option value="">Select User...</option>
                        {availableUsers.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-48">
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                        className="w-full border rounded p-2"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value="Viewer">Viewer</option>
                        <option value="Reviewer">Reviewer (Can Approve)</option>
                        <option value="Creator">Creator (Can Upload)</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Add Member
                </button>
            </form>

            {/* Members List */}
            <div className="border rounded overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project Role</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {members.map(member => (
                            <tr key={member.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{member.user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{member.user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${member.role === 'Reviewer' ? 'bg-purple-100 text-purple-800' :
                                            member.role === 'Creator' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {member.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {members.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                    No members assigned. Only Admis can see this project.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
