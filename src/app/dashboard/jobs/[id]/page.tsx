"use client";

import React, { useEffect, useState } from 'react';
import { getJobMatches } from '@/lib/api';
import { Check, X, ChevronDown, ChevronUp, User, Brain, Target, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function JobDetailsPage() {
    const { id } = useParams() as { id: string };
    const [data, setData] = useState<{ job_title: string; candidates: any[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await getJobMatches(id);
                setData(res);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    if (loading) {
        return <div className="p-12 text-center text-gray-500">Loading analysis data...</div>;
    }

    if (!data) {
        return <div className="p-12 text-center text-red-400">Failed to load job data.</div>;
    }

    const toggleExpand = (candId: string) => {
        setExpandedId(expandedId === candId ? null : candId);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/jobs" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-gray-400" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{data.job_title}</h1>
                    <p className="text-gray-400">Found {data.candidates.length} potential matches for this role.</p>
                </div>
            </div>

            <div className="space-y-4">
                {data.candidates.map((cand, index) => {
                    const isExpanded = expandedId === cand.candidate_id;
                    const score = Math.round(cand.match_score * 100);

                    // Data for charts
                    const pieData = [
                        { name: 'Semantic Match', value: cand.details.semantic_score * 100 },
                        { name: 'Skill Match', value: cand.details.skill_score * 100 },
                    ];

                    return (
                        <div key={cand.candidate_id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden transition-all hover:bg-white/[0.07]">

                            {/* Header Row */}
                            <div
                                onClick={() => toggleExpand(cand.candidate_id)}
                                className="p-6 cursor-pointer flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{cand.filename}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Brain size={14} /> AI Score:
                                            </span>
                                            <span className={cn("font-bold", score > 70 ? "text-emerald-400" : score > 50 ? "text-yellow-400" : "text-red-400")}>
                                                {score}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="hidden md:flex flex-col items-end">
                                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Match Quality</span>
                                        <div className="w-32 h-2 bg-white/10 rounded-full mt-1 overflow-hidden">
                                            <div className={cn("h-full rounded-full", score > 70 ? "bg-emerald-500" : "bg-yellow-500")} style={{ width: `${score}%` }} />
                                        </div>
                                    </div>
                                    {isExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="px-6 pb-6 pt-0 border-t border-white/5 bg-black/20">
                                    <div className="grid md:grid-cols-2 gap-8 mt-6">

                                        {/* Full Width Summary */}
                                        <div className="col-span-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                            <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                                                <Brain size={16} /> AI Smart Summary
                                            </h4>
                                            <p className="text-gray-300 leading-relaxed">
                                                {cand.summary || "No summary available."}
                                            </p>
                                        </div>

                                        {/* Left: Scores */}
                                        <div className="space-y-6">
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                <Target size={16} /> Scoring Breakdown
                                            </h4>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                                    <div className="text-2xl font-bold text-blue-400 mb-1">
                                                        {Math.round(cand.details.semantic_score * 100)}%
                                                    </div>
                                                    <div className="text-xs text-gray-500">Contextual Match</div>
                                                    <p className="text-xs text-gray-600 mt-2">
                                                        How well the resume content conceptually matches the job description.
                                                    </p>
                                                </div>
                                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                                    <div className="text-2xl font-bold text-purple-400 mb-1">
                                                        {Math.round(cand.details.skill_score * 100)}%
                                                    </div>
                                                    <div className="text-xs text-gray-500">Keyword Match</div>
                                                    <p className="text-xs text-gray-600 mt-2">
                                                        Based on exact skill keyword overlap.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Skills */}
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                                                <Brain size={16} /> Detected Skills
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {cand.details.matched_skills && cand.details.matched_skills.length > 0 ? (
                                                    cand.details.matched_skills.map((skill: string) => (
                                                        <span key={skill} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-sm font-medium flex items-center gap-1">
                                                            <Check size={12} /> {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-sm italic">No specific skill keywords matched.</span>
                                                )}
                                                {/* We could list all skills if we had them, distinguishing matched vs others */}
                                                {cand.skills && cand.skills.filter((s: string) => !cand.details.matched_skills.includes(s.toLowerCase())).map((skill: string) => (
                                                    <span key={skill} className="px-3 py-1 bg-white/5 text-gray-400 border border-white/5 rounded-full text-sm">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>
        </div>
    );
}
