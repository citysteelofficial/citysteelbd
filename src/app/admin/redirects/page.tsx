"use client";

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { normalizePath, isValidTarget } from '@/lib/paths';
import {
  Loader2, Plus, Trash2, AlertCircle, ArrowRight, CheckCircle2,
  Link2, Power, RotateCcw, Search,
} from 'lucide-react';

interface Redirect {
  id: string;
  from_path: string;
  to_path: string;
  status_code: number;
  is_active: boolean;
  hits: number;
  note: string | null;
  created_at: string;
}

interface NotFoundEntry {
  id: string;
  path: string;
  hits: number;
  referrer: string | null;
  last_seen: string;
}

export default function AdminRedirects() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [notFound, setNotFound] = useState<NotFoundEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const [fromPath, setFromPath] = useState('');
  const [toPath, setToPath] = useState('');
  const [statusCode, setStatusCode] = useState<301 | 302>(301);
  const [note, setNote] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [redirectsRes, notFoundRes] = await Promise.all([
      supabase.from('redirects').select('*').order('created_at', { ascending: false }),
      supabase
        .from('not_found_log')
        .select('*')
        .eq('is_resolved', false)
        .order('hits', { ascending: false })
        .limit(100),
    ]);

    if (redirectsRes.data) setRedirects(redirectsRes.data);
    if (notFoundRes.data) setNotFound(notFoundRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Load-on-mount, matching the other admin screens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
  }, [fetchAll]);

  const resetForm = () => {
    setFromPath('');
    setToPath('');
    setStatusCode(301);
    setNote('');
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const from = normalizePath(fromPath);
    const to = toPath.trim();

    if (!from || from === '/') {
      setError('Enter the old URL path, for example /old-product-page');
      return;
    }
    if (!isValidTarget(to)) {
      setError('The new URL must start with / or with https://');
      return;
    }
    if (normalizePath(to) === from) {
      setError('The old and new URL are the same — that would loop forever.');
      return;
    }
    if (redirects.some((r) => r.from_path === from)) {
      setError(`A rule for ${from} already exists. Delete it first to change it.`);
      return;
    }

    setSaving(true);
    const { data, error: insertError } = await supabase
      .from('redirects')
      .insert([{ from_path: from, to_path: to, status_code: statusCode, note: note.trim() || null }])
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
    } else if (data) {
      setRedirects((prev) => [data, ...prev]);
      // Clear the matching 404 entry so the to-do list shrinks as work is done.
      await supabase.from('not_found_log').update({ is_resolved: true }).eq('path', from);
      setNotFound((prev) => prev.filter((n) => n.path !== from));
      resetForm();
      setNotice(`Redirect saved. It goes live within a minute.`);
    }
    setSaving(false);
  };

  const handleToggle = async (redirect: Redirect) => {
    const { error: updateError } = await supabase
      .from('redirects')
      .update({ is_active: !redirect.is_active })
      .eq('id', redirect.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setRedirects((prev) =>
      prev.map((r) => (r.id === redirect.id ? { ...r, is_active: !r.is_active } : r)),
    );
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase.from('redirects').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setRedirects((prev) => prev.filter((r) => r.id !== id));
    setConfirmDeleteId(null);
  };

  const handleDismiss = async (entry: NotFoundEntry) => {
    await supabase.from('not_found_log').update({ is_resolved: true }).eq('id', entry.id);
    setNotFound((prev) => prev.filter((n) => n.id !== entry.id));
  };

  const prefillFrom = (path: string) => {
    setFromPath(path);
    setNotice(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleRedirects = redirects.filter((r) => {
    if (!filter.trim()) return true;
    const needle = filter.toLowerCase();
    return r.from_path.includes(needle) || r.to_path.toLowerCase().includes(needle);
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">URL Redirects</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Point old or broken URLs at the pages that replaced them, so visitors and Google
          land somewhere useful instead of a 404.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {notice && (
        <div className="flex items-start gap-2 rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{notice}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Add rule */}
        <div className="lg:col-span-1 rounded-xl border bg-card p-6 shadow-sm h-fit">
          <h3 className="text-lg font-semibold mb-1">Add Redirect</h3>
          <p className="text-xs text-muted-foreground mb-4">
            You can paste a full URL from Search Console — only the path is kept.
          </p>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="from-path">Old URL (404)</label>
              <input
                id="from-path"
                required
                type="text"
                placeholder="/old-product-page"
                value={fromPath}
                onChange={(e) => setFromPath(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="to-path">New URL</label>
              <input
                id="to-path"
                required
                type="text"
                placeholder="/products/steel-beam"
                value={toPath}
                onChange={(e) => setToPath(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="status-code">Redirect Type</label>
              <select
                id="status-code"
                value={statusCode}
                onChange={(e) => setStatusCode(Number(e.target.value) === 302 ? 302 : 301)}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={301}>301 — Permanent (use this for SEO)</option>
                <option value={302}>302 — Temporary</option>
              </select>
              <p className="text-xs text-muted-foreground">
                301 passes the old page&apos;s search ranking to the new one. Use 302 only when
                the move is genuinely temporary.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="note">Note (optional)</label>
              <input
                id="note"
                type="text"
                placeholder="Why this redirect exists"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 h-10"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              {saving ? 'Saving...' : 'Add Redirect'}
            </button>
          </form>
        </div>

        {/* Existing rules */}
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-sm overflow-hidden h-fit">
          <div className="p-6 border-b flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Active Rules</h3>
              <p className="text-sm text-muted-foreground">
                {redirects.length} rule{redirects.length === 1 ? '' : 's'} · changes go live within a minute
              </p>
            </div>
            {redirects.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="h-9 w-full sm:w-48 rounded-md border border-input bg-transparent pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>

          <div className="w-full overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/20">
                  <th className="h-10 px-6 text-left font-medium text-muted-foreground">Redirect</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Type</th>
                  <th className="h-10 px-4 text-right font-medium text-muted-foreground">Hits</th>
                  <th className="h-10 px-6 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRedirects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-muted-foreground">
                      {redirects.length === 0
                        ? 'No redirects yet. Add one on the left, or pick a broken URL from the list below.'
                        : 'No rules match that filter.'}
                    </td>
                  </tr>
                ) : (
                  visibleRedirects.map((r) => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`flex flex-wrap items-center gap-2 ${r.is_active ? '' : 'opacity-50'}`}>
                          <span className="font-medium break-all">{r.from_path}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground break-all">{r.to_path}</span>
                        </div>
                        {r.note && <div className="text-xs text-muted-foreground mt-1">{r.note}</div>}
                        {!r.is_active && (
                          <span className="mt-1 inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${
                          r.status_code === 301
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {r.status_code}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-muted-foreground tabular-nums">{r.hits}</td>
                      <td className="px-6 py-4 text-right">
                        {confirmDeleteId === r.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-red-600 font-medium">Delete?</span>
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="text-xs bg-red-600 text-white px-2.5 py-1.5 rounded hover:bg-red-700 font-semibold shadow-sm"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-xs bg-muted text-foreground border border-input px-2.5 py-1.5 rounded hover:bg-accent font-semibold"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleToggle(r)}
                              title={r.is_active ? 'Disable' : 'Enable'}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-accent"
                            >
                              <Power className={`h-4 w-4 ${r.is_active ? 'text-green-600' : 'text-muted-foreground'}`} />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(r.id)}
                              title="Delete"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detected 404s */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary" /> Broken URLs Detected
            </h3>
            <p className="text-sm text-muted-foreground">
              Recorded automatically whenever a visitor or search engine hits a page that
              does not exist. Most-visited first.
            </p>
          </div>
          <button
            onClick={fetchAll}
            title="Refresh"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-input hover:bg-accent"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="w-full overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="h-10 px-6 text-left font-medium text-muted-foreground">Broken URL</th>
                <th className="h-10 px-4 text-right font-medium text-muted-foreground">Hits</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Last Seen</th>
                <th className="h-10 px-6 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notFound.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted-foreground">
                    No broken URLs recorded. Nothing to fix.
                  </td>
                </tr>
              ) : (
                notFound.map((n) => (
                  <tr key={n.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-medium break-all">
                      {n.path}
                      {n.referrer && (
                        <div className="text-xs text-muted-foreground mt-0.5 break-all">
                          from {n.referrer}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right tabular-nums text-muted-foreground">{n.hits}</td>
                    <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                      {new Date(n.last_seen).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => prefillFrom(n.path)}
                          className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded font-semibold hover:bg-primary/90"
                        >
                          Create Redirect
                        </button>
                        <button
                          onClick={() => handleDismiss(n)}
                          className="text-xs border border-input px-3 py-1.5 rounded font-semibold hover:bg-accent"
                        >
                          Ignore
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
