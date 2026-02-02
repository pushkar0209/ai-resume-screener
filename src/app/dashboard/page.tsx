"use client";

import React, { useEffect, useState } from "react";
import { fetchJobs, fetchCandidates, fetchAnalytics } from "@/lib/api";
import { ArrowUpRight, TrendingUp, Users, Briefcase, FileText, BarChart3 } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function DashboardPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [jobsData, candidatesData, analyticsData] = await Promise.all([
                    fetchJobs().catch(() => []),
                    fetchCandidates().catch(() => []),
                    fetchAnalytics().catch(() => null)
                ]);
                setJobs(jobsData);
                setCandidates(candidatesData);
                setAnalytics(analyticsData);
            } catch (e) {
                console.error("Failed to load dashboard data", e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard
                    title="Active Jobs"
                    value={analytics?.total_jobs || jobs.length}
                    icon={<Briefcase size={20} className="text-blue-400" />}
                    trend="Active Roles"
                />
                <StatsCard
                    title="Total Candidates"
                    value={analytics?.total_candidates || candidates.length}
                    icon={<Users size={20} className="text-purple-400" />}
                    trend="Total Database"
                />
                <StatsCard
                    title="Top Skill"
                    value={analytics?.skill_distribution?.[0]?.name || "N/A"}
                    icon={<TrendingUp size={20} className="text-orange-400" />}
                    trend="Most Demand"
                />
                <StatsCard
                    title="Efficiency"
                    value="High"
                    icon={<BarChart3 size={20} className="text-emerald-400" />}
                    trend="AI Performance"
                />
            </div>

            {/* Analytics & Recent Activity Split */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Main Column: Analytics + Jobs */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Skill Char */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Skill Distribution</h2>
                        <div className="h-64 w-full">
                            {analytics?.skill_distribution ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analytics.skill_distribution}>
                                        <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                            cursor={{ fill: '#ffffff10' }}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {analytics.skill_distribution.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][index % 4]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-500">
                                    Not enough data to display analytics
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Jobs */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Recent Jobs</h2>
                            <Link href="/dashboard/jobs" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                View All <ArrowUpRight size={14} />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {loading ? (
                                <p className="text-gray-500">Loading jobs...</p>
                            ) : jobs.length === 0 ? (
                                <p className="text-gray-500">No active jobs found.</p>
                            ) : (
                                jobs.slice(0, 3).map((job: any, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div>
                                            <h3 className="font-medium text-white">{job.title}</h3>
                                            <p className="text-sm text-gray-400 line-clamp-1">{job.description}</p>
                                        </div>
                                        <Link href={`/dashboard/jobs/${job._id}`} className="px-3 py-1.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600 text-xs font-bold rounded-lg transition-colors hover:text-white">
                                            View Matches
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column: Recent Candidates */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 h-fit">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Latest Uploads</h2>
                        <Link href="/dashboard/resume-upload" className="text-sm text-blue-400 hover:text-blue-300">
                            + Upload
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-gray-500">Loading candidates...</p>
                        ) : candidates.length === 0 ? (
                            <p className="text-gray-500">No candidates found.</p>
                        ) : (
                            candidates.slice(0, 6).map((cand: any, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                                        {cand.filename?.substring(0, 1).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-medium text-white text-sm truncate">{cand.filename}</h3>
                                        <p className="text-xs text-gray-400">{new Date(cand.upload_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, trend }: { title: string, value: string | number, icon: any, trend: string }) {
    return (
        <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    {icon}
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <TrendingUp size={12} />
                    {trend}
                </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-gray-400">{title}</div>
        </div>
    );
}
