"use client";

import React, { useState } from 'react';
import { uploadResume } from '@/lib/api';
import { UploadCloud, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setUploadStatus('idle');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setUploadStatus('idle');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        try {
            const res = await uploadResume(file);
            setUploadStatus('success');
            // Redirect to candidates after short delay
            setTimeout(() => router.push('/dashboard/candidates'), 1500);
        } catch (error) {
            console.error(error);
            setUploadStatus('error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Upload Candidate Resume</h1>
                <p className="text-gray-400">Our AI engine will parse the document and extract key insights.</p>
            </div>

            <div
                className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all group ${isDragging
                    ? 'bg-blue-600/20 border-blue-500 scale-105'
                    : 'bg-white/5 border-white/10 hover:bg-white/[0.07] hover:border-blue-500/30'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                />
                <label htmlFor="resume-upload" className="cursor-pointer block w-full h-full">
                    <div className="w-20 h-20 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <UploadCloud size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {file ? file.name : "Click to upload or drag and drop"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-8">
                        {file ? "Ready to analyze" : "Supported formats: PDF, DOCX (Max 5MB)"}
                    </p>

                    {!file && (
                        <span className="px-6 py-3 bg-white/5 rounded-full text-sm font-medium text-gray-300 group-hover:bg-white/10 transition-colors">
                            Select File
                        </span>
                    )}
                </label>
            </div>

            {file && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    {uploadStatus === 'success' ? (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400">
                            <CheckCircle size={20} />
                            <span>Resume uploaded and parsed successfully!</span>
                        </div>
                    ) : uploadStatus === 'error' ? (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                            <XCircle size={20} />
                            <span>Failed to upload resume. Please try again.</span>
                        </div>
                    ) : (
                        <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <FileText size={20} />
                                    Start AI Analysis
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
