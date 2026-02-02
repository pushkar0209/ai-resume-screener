"use client";

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Briefcase, Settings, LogOut, FileText } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const links = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/jobs', label: 'Jobs', icon: Briefcase },
        { href: '/dashboard/candidates', label: 'Candidates', icon: Users },
        { href: '/dashboard/resume-upload', label: 'Upload Resume', icon: FileText },
        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-[#0a0a0a]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-white">R</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">RecruitAI</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon size={18} className={cn(isActive ? "text-blue-400" : "text-gray-500 group-hover:text-white")} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-w-0">
                <div className="h-full p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
