import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, X, Edit2, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Note {
  id: string;
  date: string;
  note: string;
  created_at: string;
}

type ViewMode = "year" | "month" | "day";

const CalendarView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const today = new Date().getDate();

  // Fetch notes from Supabase
  useEffect(() => {
    fetchNotes();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('calendar-notes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_notes'
        },
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('calendar_notes')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching notes:', error);
      return;
    }

    setNotes(data || []);
  };

  const formatDateForDB = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getNotesForDate = (date: Date) => {
    const dateStr = formatDateForDB(date);
    return notes.filter(note => note.date === dateStr);
  };

  const hasNotesOnDate = (date: Date) => {
    return getNotesForDate(date).length > 0;
  };

  const handleSaveNote = async () => {
    if (!currentNote.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    const dateStr = formatDateForDB(selectedDate);

    if (editingNoteId) {
      // Update existing note
      const { error } = await supabase
        .from('calendar_notes')
        .update({ note: currentNote, date: dateStr })
        .eq('id', editingNoteId);

      if (error) {
        toast.error("Failed to update note");
        console.error(error);
        return;
      }

      toast.success("Note updated successfully");
    } else {
      // Create new note
      const { error } = await supabase
        .from('calendar_notes')
        .insert({ date: dateStr, note: currentNote });

      if (error) {
        toast.error("Failed to save note");
        console.error(error);
        return;
      }

      toast.success("Note saved successfully");
    }

    setCurrentNote("");
    setEditingNoteId(null);
    setShowNoteDialog(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    const { error } = await supabase
      .from('calendar_notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      toast.error("Failed to delete note");
      console.error(error);
      return;
    }

    toast.success("Note deleted successfully");
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note.note);
    setEditingNoteId(note.id);
    setShowNoteDialog(true);
  };

  const handleAddNote = (date: Date) => {
    setSelectedDate(date);
    setCurrentNote("");
    setEditingNoteId(null);
    setShowNoteDialog(true);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const navigateMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const navigateYear = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(newDate.getFullYear() + direction);
    setSelectedDate(newDate);
  };

  // Year View
  const renderYearView = () => {
    const year = selectedDate.getFullYear();
    
    return (
      <div className="space-y-6">
        {/* Year Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigateYear(-1)}
            className="p-3 hover:bg-white/10 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          
          <h2 className="text-6xl font-bold text-white">{year}</h2>
          
          <button
            onClick={() => navigateYear(1)}
            className="p-3 hover:bg-white/10 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {monthNames.map((month, monthIndex) => {
            const daysInMonth = getDaysInMonth(year, monthIndex);
            const firstDay = getFirstDayOfMonth(year, monthIndex);
            const isCurrentMonth = monthIndex === currentMonth && year === currentYear;
            
            return (
              <motion.div
                key={month}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: monthIndex * 0.03 }}
                className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 cursor-pointer hover:bg-white/15 transition-all"
                onClick={() => {
                  const newDate = new Date(year, monthIndex, 1);
                  setSelectedDate(newDate);
                  setViewMode("month");
                }}
              >
                <h3 className={`text-xl font-bold mb-3 ${isCurrentMonth ? 'text-blue-400' : 'text-white'}`}>
                  {month}
                </h3>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const date = new Date(year, monthIndex, day);
                    const isToday = monthIndex === currentMonth && day === today && year === currentYear;
                    const hasNotes = hasNotesOnDate(date);
                    
                    return (
                      <div
                        key={day}
                        className={`aspect-square flex items-center justify-center rounded-full text-center relative ${
                          isToday ? 'bg-blue-500 text-white font-bold' : 'text-white/80'
                        }`}
                      >
                        {day}
                        {hasNotes && (
                          <div className="absolute bottom-0 w-1 h-1 bg-green-400 rounded-full" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // Month View
  const renderMonthView = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="space-y-6">
        {/* Month Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-3 hover:bg-white/10 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          
          <h2 className="text-4xl font-bold text-white">
            {monthNames[month]} {year}
          </h2>
          
          <button
            onClick={() => navigateMonth(1)}
            className="p-3 hover:bg-white/10 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6">
          {/* Week Days */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {weekDays.map(day => (
              <div key={day} className="text-center text-white/60 font-semibold text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
              const day = dayIndex + 1;
              const date = new Date(year, month, day);
              const isToday = month === currentMonth && day === today && year === currentYear;
              const hasNotes = hasNotesOnDate(date);
              
              return (
                <motion.div
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedDate(date);
                    setViewMode("day");
                  }}
                  className={`aspect-square flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all relative ${
                    isToday 
                      ? 'bg-blue-500 text-white font-bold shadow-lg' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <span className="text-lg">{day}</span>
                  {hasNotes && (
                    <div className="absolute bottom-2 flex gap-1">
                      {getNotesForDate(date).slice(0, 3).map((_, idx) => (
                        <div key={idx} className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Day View
  const renderDayView = () => {
    const dayNotes = getNotesForDate(selectedDate);
    const isToday = selectedDate.toDateString() === new Date().toDateString();

    return (
      <div className="space-y-6">
        {/* Day Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setViewMode("month")}
            className="p-3 hover:bg-white/10 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          
          <div className="text-center">
            <h2 className={`text-5xl font-bold ${isToday ? 'text-blue-400' : 'text-white'}`}>
              {selectedDate.getDate()}
            </h2>
            <p className="text-white/80 text-xl mt-2">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </p>
            <p className="text-white/60 text-sm mt-1">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
          </div>

          <button
            onClick={() => handleAddNote(selectedDate)}
            className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors shadow-lg"
          >
            <Plus className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {dayNotes.length === 0 ? (
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-12 text-center">
              <CalendarIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 text-lg">No notes for this day</p>
              <p className="text-white/40 text-sm mt-2">Click the + button to add a note</p>
            </div>
          ) : (
            dayNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 group hover:bg-white/15 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-white flex-1 whitespace-pre-wrap">{note.note}</p>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="p-2 bg-blue-500/80 hover:bg-blue-500 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                <p className="text-white/40 text-xs mt-3">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 p-6 overflow-y-auto">
      {/* View Mode Selector */}
      <div className="flex justify-center gap-3 mb-8">
        {(['year', 'month', 'day'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-6 py-3 rounded-full font-semibold capitalize transition-all ${
              viewMode === mode
                ? 'bg-white text-gray-900 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Render Current View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === "year" && renderYearView()}
          {viewMode === "month" && renderMonthView()}
          {viewMode === "day" && renderDayView()}
        </motion.div>
      </AnimatePresence>

      {/* Note Dialog */}
      <AnimatePresence>
        {showNoteDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowNoteDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingNoteId ? 'Edit Note' : 'Add Note'}
                </h3>
                <button
                  onClick={() => setShowNoteDialog(false)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <Textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Write your note here..."
                  className="min-h-[200px] resize-none"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowNoteDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveNote}>
                  {editingNoteId ? 'Update' : 'Save'} Note
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarView;