import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Trash2, Mail, MailOpen, Eye } from 'lucide-react';

export const Route = createFileRoute('/admin/messages')({ component: AdminMessages });

interface Message { id: string; name: string; email: string; phone?: string; subject?: string; message: string; is_read: boolean; created_at: string; }

function AdminMessages() {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetch = async () => { setLoading(true); const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }); if (data) setMsgs(data as Message[]); setLoading(false); };
  useEffect(() => { fetch(); }, []);

  const markRead = async (id: string) => { await supabase.from('contact_messages').update({ is_read: true }).eq('id', id); setMsgs(msgs.map(m => m.id === id ? { ...m, is_read: true } : m)); };
  const handleDelete = async (id: string) => { if (!confirm('Delete this message?')) return; await supabase.from('contact_messages').delete().eq('id', id); setMsgs(msgs.filter(m => m.id !== id)); setSelected(null); };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Contact Messages</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* List */}
        <div className="rounded-md border bg-card">
          <div className="max-h-[600px] overflow-auto">
            {loading ? <div className="p-8 text-center">Loading...</div> : msgs.length === 0 ? <div className="p-8 text-center text-muted-foreground">No messages yet</div> : (
              msgs.map(m => (
                <div key={m.id} onClick={() => { setSelected(m); if (!m.is_read) markRead(m.id); }} className={`flex items-start gap-3 p-4 border-b cursor-pointer transition-colors hover:bg-muted/50 ${!m.is_read ? 'bg-primary/5' : ''} ${selected?.id === m.id ? 'bg-muted' : ''}`}>
                  {m.is_read ? <MailOpen className="h-4 w-4 mt-1 text-muted-foreground" /> : <Mail className="h-4 w-4 mt-1 text-primary" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between"><span className={`text-sm ${!m.is_read ? 'font-bold' : 'font-medium'}`}>{m.name}</span><span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span></div>
                    <div className="text-xs text-muted-foreground truncate">{m.subject || 'No subject'}</div>
                    <div className="text-xs text-muted-foreground truncate">{m.message.slice(0, 60)}...</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Detail */}
        <div className="rounded-md border bg-card p-6">
          {selected ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div><h3 className="text-xl font-bold">{selected.name}</h3><a href={`mailto:${selected.email}`} className="text-sm text-primary hover:underline">{selected.email}</a>{selected.phone && <div className="text-sm text-muted-foreground"><a href={`tel:${selected.phone}`} className="hover:text-primary">{selected.phone}</a></div>}</div>
                <button onClick={() => handleDelete(selected.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
              {selected.subject && <div className="text-sm font-semibold text-foreground border-b pb-2">Subject: {selected.subject}</div>}
              <div className="text-sm text-foreground whitespace-pre-wrap">{selected.message}</div>
              <div className="text-xs text-muted-foreground border-t pt-2">{new Date(selected.created_at).toLocaleString()}</div>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your inquiry'}`} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Mail className="h-4 w-4" /> Reply via Email
              </a>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground"><p>Select a message to read</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
