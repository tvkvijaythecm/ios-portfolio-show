import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, User, Clock, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Note {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
}

interface NotesAppProps {
  onClose: () => void;
}

interface ThemeColors {
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

const NotesApp = ({ onClose }: NotesAppProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [themeColors, setThemeColors] = useState<ThemeColors | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // Load theme colors and notes in parallel
      const [themeRes] = await Promise.all([
        supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'welcome')
          .maybeSingle()
      ]);
      
      if (themeRes.data?.value) {
        const value = themeRes.data.value as any;
        setThemeColors({
          gradientFrom: value.gradientFrom,
          gradientVia: value.gradientVia,
          gradientTo: value.gradientTo
        });
      }
    };
    
    loadData();
    fetchNotes();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('notes-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotes(prev => [payload.new as Note, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setNotes(prev => prev.filter(n => n.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setNotes(prev => prev.map(n => n.id === payload.new.id ? payload.new as Note : n));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return;
    }

    setNotes(data || []);
  };

  const handleSubmit = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from('notes').insert({
      content: newNote.trim(),
      author_name: authorName.trim() || 'Anonymous'
    });

    if (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    } else {
      toast.success('Note added!');
      setNewNote('');
      setAuthorName('');
    }

    setIsSubmitting(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Don't render until theme is loaded
  if (!themeColors) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50"
      style={{
        background: `linear-gradient(to bottom right, ${themeColors.gradientFrom}, ${themeColors.gradientVia}, ${themeColors.gradientTo})`
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-semibold text-white">Public Notes</h1>
        <div className="w-10" />
      </div>

      <div className="flex flex-col h-[calc(100%-80px)] px-4 pb-4">
        {/* Add Note Form */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 mb-4 border border-white/30"
        >
          <Input
            placeholder="Your name (optional)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="mb-3 bg-white/30 border-white/20 text-white placeholder:text-white/60"
          />
          <Textarea
            placeholder="Write your note here..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="mb-3 bg-white/30 border-white/20 text-white placeholder:text-white/60 min-h-[80px]"
          />
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !newNote.trim()}
            className="w-full bg-white/30 hover:bg-white/40 text-white border border-white/30"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Adding...' : 'Add Note'}
          </Button>
        </motion.div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          <AnimatePresence>
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/20 backdrop-blur-xl rounded-xl p-4 border border-white/30"
              >
                <p className="text-white mb-3 whitespace-pre-wrap">{note.content}</p>
                <div className="flex items-center justify-between text-white/70 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{note.author_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(note.created_at)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {notes.length === 0 && (
            <div className="text-center text-white/60 py-10">
              No notes yet. Be the first to add one!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotesApp;
