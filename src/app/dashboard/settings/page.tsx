"use client";

import React, { useEffect, useState } from 'react';
import { Save, RefreshCw, Moon, Sun, Monitor } from 'lucide-react';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        theme: 'dark',
        matchWeightSimilarity: 70,
        matchWeightSkills: 30,
        autoAnalyze: true,
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('recruitai_settings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('recruitai_settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Platform Settings</h1>
                <p className="text-gray-400">Configure your system preferences and matching algorithms.</p>
            </div>

            <div className="space-y-6">

                {/* Appearance */}
                <section className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Monitor size={20} /> Appearance
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        {['dark', 'light', 'system'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setSettings({ ...settings, theme: mode })}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${settings.theme === mode
                                        ? 'bg-blue-600/10 border-blue-600 text-blue-400'
                                        : 'bg-black/20 border-white/5 text-gray-400 hover:bg-white/5'
                                    }`}
                            >
                                {mode === 'dark' ? <Moon size={24} /> : mode === 'light' ? <Sun size={24} /> : <Monitor size={24} />}
                                <span className="capitalize font-medium">{mode} Mode</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* AI Configuration */}
                <section className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <RefreshCw size={20} /> Matching Algorithm
                        </h2>
                        <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-xs border border-yellow-500/20">Advanced</span>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-gray-300 font-medium">Semantic Similarity Weight</label>
                                <span className="text-blue-400 font-bold">{settings.matchWeightSimilarity}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.matchWeightSimilarity}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    matchWeightSimilarity: parseInt(e.target.value),
                                    matchWeightSkills: 100 - parseInt(e.target.value)
                                })}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Higher values prioritize conceptual understanding over exact keyword matches.
                            </p>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-gray-300 font-medium">Exact Skill Match Weight</label>
                                <span className="text-purple-400 font-bold">{settings.matchWeightSkills}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-600 transition-all"
                                    style={{ width: `${settings.matchWeightSkills}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Calculated automatically based on similarity weight (Total = 100%).
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div>
                                <div className="text-gray-200 font-medium">Auto-Analyze Uploads</div>
                                <div className="text-xs text-gray-500">Automatically run matching engine on file upload.</div>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, autoAnalyze: !settings.autoAnalyze })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoAnalyze ? 'bg-blue-600' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.autoAnalyze ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
                    >
                        {saved ? 'Settings Saved!' : 'Save Changes'}
                        {!saved && <Save size={18} />}
                    </button>
                </div>

            </div>
        </div>
    );
}
