/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, EyeOff, Briefcase, MapPin, Clock, CalendarDays } from 'lucide-react';

interface JobCircular {
  id: string;
  title: string;
  department?: string;
  location: string;
  job_type: string;
  experience?: string;
  salary_range?: string;
  description?: string;
  requirements?: string;
  is_active: boolean;
  deadline?: string;
  created_at: string;
}

export default function AdminCareerPage() {
  const [jobs, setJobs] = useState<JobCircular[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('job_circulars')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setJobs(data as JobCircular[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await supabase.from('job_circulars').update({ is_active: !currentStatus, updated_at: new Date().toISOString() }).eq('id', id);
    setJobs(jobs.map(j => j.id === id ? { ...j, is_active: !currentStatus } : j));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job circular?')) return;
    await supabase.from('job_circulars').delete().eq('id', id);
    setJobs(jobs.filter(j => j.id !== id));
  };

  const isExpired = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Career / Job Circulars</h2>
          <p className="text-muted-foreground mt-1">Manage job openings displayed on the Career page</p>
        </div>
        <Link
          href="/admin/career/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> New Job Circular
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-medium text-muted-foreground">Total Jobs</div>
          <div className="mt-1 text-3xl font-bold">{jobs.length}</div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-medium text-muted-foreground">Active</div>
          <div className="mt-1 text-3xl font-bold text-green-600">{jobs.filter(j => j.is_active).length}</div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-medium text-muted-foreground">Inactive / Expired</div>
          <div className="mt-1 text-3xl font-bold text-orange-500">{jobs.filter(j => !j.is_active || isExpired(j.deadline)).length}</div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading job circulars...</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold mb-1">No Job Circulars Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first job circular to display on the Career page.</p>
            <Link
              href="/admin/career/new"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" /> Create First Job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Title</th>
                  <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Location</th>
                  <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Deadline</th>
                  <th className="px-4 py-3 text-center font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{job.title}</div>
                      {job.department && (
                        <div className="text-xs text-muted-foreground mt-0.5">{job.department}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {job.location}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3 w-3" /> {job.job_type}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {job.deadline ? (
                        <div className={`flex items-center gap-1.5 text-xs ${isExpired(job.deadline) ? 'text-red-500 font-semibold' : 'text-muted-foreground'}`}>
                          <CalendarDays className="h-3 w-3" />
                          {new Date(job.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          {isExpired(job.deadline) && <span className="ml-1">(Expired)</span>}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No deadline</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(job.id, job.is_active)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                          job.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title={job.is_active ? 'Click to deactivate' : 'Click to activate'}
                      >
                        {job.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {job.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/career/${job.id}/edit`}
                          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
