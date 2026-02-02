"use client";

import React, { useEffect, useState } from 'react';
import { fetchJobs, createJob } from '@/lib/api';
import { Plus, Briefcase, Search, MoreHorizontal } from 'lucide-react';

export default function JobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // New Job Form State
    const [newJob, setNewJob] = useState({ title: '', description: '', required_skills: '' });

    useEffect(() => {
        loadJobs();
    }, []);

    async function loadJobs() {
        try {
            const data = await fetchJobs();
            setJobs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await createJob({
                ...newJob,
                required_skills: newJob.required_skills.split(',').map(s => s.trim())
            });
            setIsModalOpen(false);
            setNewJob({ title: '', description: '', required_skills: '' });
            loadJobs(); // Refresh
        } catch (error) {
            alert("Failed to create job");
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Job Listings</h1>
                    <p className="text-gray-400">Manage your open positions and requirements.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
                >
                    <Plus size={18} />
                    Post New Job
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading active positions...</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job) => (
                        <div key={job._id} className="group p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                                    <p className="text-gray-400 mb-4 line-clamp-2 max-w-2xl">{job.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {job.required_skills && job.required_skills.map((skill: string, i: number) => (
                                            <span key={i} className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {jobs.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
                            <Briefcase size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium text-gray-300">No jobs posted yet</h3>
                            <p className="text-gray-500 mb-6">Create your first job posting to start matching candidates.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                            >
                                Create Job Now
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Create Job Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Create New Position</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Job Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newJob.title}
                                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    placeholder="e.g. Senior Frontend Engineer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    required
                                    value={newJob.description}
                                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors h-32 resize-none"
                                    placeholder="Describe the role and responsibilities..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Required Skills (comma separated)</label>
                                <input
                                    type="text"
                                    value={newJob.required_skills}
                                    onChange={(e) => setNewJob({ ...newJob, required_skills: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    placeholder="e.g. React, Node.js, TypeScript"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 text-gray-300 font-medium rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-500 transition-colors"
                                >
                                    Create Position
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
