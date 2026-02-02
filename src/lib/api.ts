const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchJobs() {
    const res = await fetch(`${API_URL}/jobs`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
}

export async function fetchCandidates() {
    const res = await fetch(`${API_URL}/candidates`);
    if (!res.ok) throw new Error('Failed to fetch candidates');
    return res.json();
}

export async function fetchCandidate(id: string) {
    const res = await fetch(`${API_URL}/candidates/${id}`);
    if (!res.ok) throw new Error('Failed to fetch candidate');
    return res.json();
}

export async function fetchAnalytics() {
    const res = await fetch(`${API_URL}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
}

export async function createJob(data: { title: string; description: string; required_skills: string[] }) {
    const res = await fetch(`${API_URL}/add-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create job');
    return res.json();
}

export async function uploadResume(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/upload-resume`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload resume');
    return res.json();
}

export async function getJobMatches(jobId: string) {
    const res = await fetch(`${API_URL}/match-candidates/${jobId}`);
    if (!res.ok) throw new Error('Failed to fetch matches');
    return res.json();
}
