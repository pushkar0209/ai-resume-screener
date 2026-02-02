"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchCandidate } from '@/lib/api';
import { User, Mail, Phone, MapPin, Calendar, FileText, Briefcase, GraduationCap, ArrowLeft, Download } from 'lucide-react';

export default function CandidateProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [candidate, setCandidate] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCandidate() {
            try {
                if (params.id) {
                    const data = await fetchCandidate(params.id as string);
                    setCandidate(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadCandidate();
    }, [params.id]);

    if (loading) {
        return <div className="text-center py-20 text-gray-500">Loading profile...</div>;
    }

    if (!candidate) {
        return (
            <div className="text-center py-20 space-y-4">
                <p className="text-gray-500">Candidate not found.</p>
                <button onClick={() => router.back()} className="text-blue-400 hover:underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header / Nav */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={18} /> Back to Database
            </button>

            {/* Profile Card */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/20">
                    {candidate.filename?.substring(0, 1).toUpperCase()}
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">{candidate.meta?.entities?.PERSON?.[0] || candidate.filename}</h1>
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                            <Calendar size={14} /> Uploaded on {new Date(candidate.upload_date).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                        {candidate.meta?.entities?.EMAIL?.[0] && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                                <Mail size={14} className="text-blue-400" /> {candidate.meta.entities.EMAIL[0]}
                            </div>
                        )}
                        {/* Phone and Location placeholders as NLP might not extract them perfectly yet */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 opacity-50">
                            <Phone size={14} /> No phone detected
                        </div>
                    </div>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors border border-white/5">
                    <Download size={16} /> Original Resume
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">

                    {/* Experience Section */}
                    <section className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Briefcase className="text-blue-400" size={20} /> Work Experience / Org
                        </h2>
                        {candidate.experience && candidate.experience.length > 0 ? (
                            <div className="space-y-4">
                                {candidate.experience.map((org: string, i: number) => (
                                    <div key={i} className="p-4 bg-black/20 rounded-xl border border-white/5">
                                        <h3 className="font-semibold text-white">{org}</h3>
                                        <p className="text-sm text-gray-500 mt-1">Found in resume text</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No organizations extracted.</p>
                        )}
                    </section>

                    {/* Raw Text Overview */}
                    <section className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <FileText className="text-emerald-400" size={20} /> Resume Overview
                        </h2>
                        <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed p-4 bg-black/20 rounded-xl border border-white/5 max-h-96 overflow-y-auto">
                            {candidate.text_raw}
                        </div>
                    </section>

                </div>

                {/* Sidebar */}
                <div className="space-y-8">

                    {/* Skills */}
                    <section className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <GraduationCap className="text-purple-400" size={20} /> Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {candidate.skills && candidate.skills.map((skill: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full text-sm font-medium">
                                    {skill}
                                </span>
                            ))}
                            {(!candidate.skills || candidate.skills.length === 0) && (
                                <p className="text-gray-500 italic">No skills extracted.</p>
                            )}
                        </div>
                    </section>

                    {/* Education */}
                    <section className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <GraduationCap className="text-yellow-400" size={20} /> Education
                        </h2>
                        {candidate.education && candidate.education.length > 0 ? (
                            <ul className="space-y-3">
                                {candidate.education.map((edu: string, i: number) => (
                                    <li key={i} className="text-gray-300 flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                        <span>{edu}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">No education extracted.</p>
                        )}
                    </section>

                </div>

            </div>
        </div>
    );
}
