"use client";

import React, { useEffect, useState } from 'react';
import { fetchCandidates } from '@/lib/api';
import Link from 'next/link';
import { Search, FileText, Calendar, Filter, Download } from 'lucide-react';

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCandidates();
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setFiltered(candidates);
            return;
        }
        const lower = search.toLowerCase();
        const results = candidates.filter(c =>
            c.filename.toLowerCase().includes(lower) ||
            (c.skills && c.skills.some((s: string) => s.toLowerCase().includes(lower)))
        );
        setFiltered(results);
    }, [search, candidates]);

    async function loadCandidates() {
        try {
            const data = await fetchCandidates();
            setCandidates(data);
            setFiltered(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Candidate Database</h1>
                    <p className="text-gray-400">View and manage all parsed resumes.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Search by name, skill, or keyword..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading database...</div>
            ) : (
                <div className="grid gap-4">
                    {filtered.map((cand) => (
                        <div key={cand._id} className="group p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.07] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-lg font-bold text-white">
                                    {cand.filename.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <Link href={`/dashboard/candidates/${cand._id}`}>
                                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors hover:underline cursor-pointer">{cand.filename}</h3>
                                    </Link>
                                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} /> {new Date(cand.upload_date).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FileText size={14} /> Parsed
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 md:max-w-md md:justify-end">
                                {cand.skills && cand.skills.slice(0, 5).map((skill: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-xs text-gray-300">
                                        {skill}
                                    </span>
                                ))}
                                {cand.skills && cand.skills.length > 5 && (
                                    <span className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-xs text-gray-500">
                                        +{cand.skills.length - 5}
                                    </span>
                                )}
                            </div>

                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="text-center py-20 opacity-50">
                            <p>No candidates found matching your search.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
