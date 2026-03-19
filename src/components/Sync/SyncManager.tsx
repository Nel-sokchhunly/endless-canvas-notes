'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useCanvasStore } from '@/store/canvasStore';
import type { Note } from '@/types/canvas';

export default function SyncManager() {
  const supabase = createClient();
  const { user, setUser, notes, transform, hasSeenHint, setNotes, setTransform, setHasSeenHint, setIsSyncing } = useCanvasStore();
  
  const isInitialLoad = useRef(true);
  const syncTimeout = useRef<NodeJS.Timeout | null>(null);

  // 1. Listen for Auth Changes
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase, setUser]);

  // 2. Initial Fetch from Supabase when user signs in
  useEffect(() => {
    if (!user) {
      isInitialLoad.current = true;
      return;
    }

    const fetchData = async () => {
      // Fetch Notes
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id);

      if (!notesError && notesData) {
        // Map database fields back to frontend Note type if necessary
        // In our schema they match mostly, but let's be safe
        const mappedNotes: Note[] = notesData.map(n => ({
          id: n.id,
          x: n.x,
          y: n.y,
          text: n.text,
          kind: n.kind as 'sticky' | 'markdown',
          title: n.title,
          markdown: n.markdown,
          width: n.width,
          height: n.height,
          color: n.color as Note['color'],
          rotation: n.rotation,
          createdAt: new Date(n.created_at).getTime(),
        }));
        
        // Only set notes if there are some in DB, or if local is empty
        // This is a simple merge strategy: DB wins on login
        if (mappedNotes.length > 0) {
          setNotes(() => mappedNotes);
        }
      }

      // Fetch Canvas State
      const { data: stateData, error: stateError } = await supabase
        .from('canvas_state')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!stateError && stateData) {
        setTransform(() => ({
          x: stateData.x,
          y: stateData.y,
          scale: stateData.scale,
        }));
        setHasSeenHint(stateData.has_seen_hint);
      }

      isInitialLoad.current = false;
    };

    fetchData();
  }, [user, supabase, setNotes, setTransform, setHasSeenHint]);

  // 3. Sync Changes to Supabase (Debounced)
  useEffect(() => {
    if (!user || isInitialLoad.current) return;

    if (syncTimeout.current) clearTimeout(syncTimeout.current);

    setIsSyncing(true);

    syncTimeout.current = setTimeout(async () => {
      const notesToUpsert = notes.map(n => ({
        id: n.id,
        user_id: user.id,
        x: n.x,
        y: n.y,
        text: n.text,
        kind: n.kind,
        title: n.title,
        markdown: n.markdown,
        width: n.width,
        height: n.height,
        color: n.color,
        rotation: n.rotation,
        created_at: new Date(n.createdAt ?? Date.now()).toISOString(),
      }));

      // Upsert notes (this requires a primary key 'id')
      if (notesToUpsert.length > 0) {
        await supabase.from('notes').upsert(notesToUpsert);
      }

      // Diff-based deletion: remove DB rows that no longer exist locally
      const { data: dbNotes } = await supabase
        .from('notes')
        .select('id')
        .eq('user_id', user.id);

      if (dbNotes && dbNotes.length > 0) {
        const localIds = new Set(notes.map((n) => n.id));
        const idsToDelete = dbNotes.map((r) => r.id).filter((id) => !localIds.has(id));
        if (idsToDelete.length > 0) {
          await supabase.from('notes').delete().in('id', idsToDelete);
        }
      }

      // Sync Canvas State
      await supabase.from('canvas_state').upsert({
        user_id: user.id,
        x: transform.x,
        y: transform.y,
        scale: transform.scale,
        has_seen_hint: hasSeenHint,
      });

      setIsSyncing(false);
    }, 2000); // 2 second debounce

    return () => {
      if (syncTimeout.current) clearTimeout(syncTimeout.current);
    };
  }, [notes, transform, hasSeenHint, user, supabase, setIsSyncing]);

  return null; // This component doesn't render anything
}
