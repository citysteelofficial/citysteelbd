"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const quillModules = { toolbar: [[{ header: [2, 3, false] }], ['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']] };

export default function NewJobCircularPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', department: '', location: 'Dhaka', job_type: 'Full-time', experience: '', salary_range: '', description: '', requirements: '', is_active: true, deadline: '' });

  const set = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Job title is required');
    setSaving(true);
    const { error } = await supabase.from('job_circulars').insert([{
      title: form.title.trim(), department: form.department.trim() || null, location: form.location.trim(),
      job_type: form.job_type, experience: form.experience.trim() || null, salary_range: form.salary_range.trim() || null,
      description: form.description || null, requirements: form.requirements || null, is_active: form.is_active, deadline: form.deadline || null,
    }]);
    if (error) { alert('Error: ' + error.message); setSaving(false); return; }
    router.push('/admin/career');
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/career" className="rounded-md p-2 hover:bg-muted transition-colors"><ArrowLeft className="h-5 w-5" /></Link>
        <div><h2 className="text-3xl font-bold tracking-tight">New Job Circular</h2><p className="text-muted-foreground mt-1">Create a new job opening for the Career page</p></div>
      </div>
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="rounded-xl border bg-card p-6 space-y-5">
          <h3 className="text-lg font-semibold border-b pb-3">Basic Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Job Title *</label><input type="text" value={form.title} onChange={e => set('title', e.target.value)} className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="e.g. Structural Design Engineer" required /></div>
            <div><label className="block text-sm font-medium mb-1.5">Department</label><input type="text" value={form.department} onChange={e => set('department', e.target.value)} className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="e.g. Engineering" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Location *</label><input type="text" value={form.location} onChange={e => set('location', e.target.value)} className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="e.g. Dhaka" required /></div>
            <div><label className="block text-sm font-medium mb-1.5">Job Type *</label><select value={form.job_type} onChange={e => set('job_type', e.target.value)} className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">{JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1.5">Experience</label><input type="text" value={form.experience} onChange={e => set('experience', e.target.value)} className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="e.g. 2-5 years" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Salary Range</label><input type="text" value={form.salary_range} onChange={e => set('salary_range', e.target.value)} className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="e.g. 30,000 - 50,000 BDT" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Application Deadline</label><input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" /></div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 space-y-5">
          <h3 className="text-lg font-semibold border-b pb-3">Job Description</h3>
          <div className="min-h-[200px]"><ReactQuill theme="snow" value={form.description} onChange={(v: string) => set('description', v)} modules={quillModules} placeholder="Describe the role and responsibilities..." /></div>
        </div>
        <div className="rounded-xl border bg-card p-6 space-y-5">
          <h3 className="text-lg font-semibold border-b pb-3">Requirements & Qualifications</h3>
          <div className="min-h-[200px]"><ReactQuill theme="snow" value={form.requirements} onChange={(v: string) => set('requirements', v)} modules={quillModules} placeholder="List required skills, education..." /></div>
        </div>
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold border-b pb-3">Publishing</h3>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" /></label>
            <span className="text-sm font-medium">Active — Show on Career page</span>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? 'Creating...' : 'Create Job Circular'}</button>
          <Link href="/admin/career" className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-muted">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
