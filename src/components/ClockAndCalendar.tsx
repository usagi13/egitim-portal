import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock as ClockIcon, ChevronLeft, ChevronRight, Plus, X, CheckCircle2 } from 'lucide-react';
import { CalendarEvent } from '../types';

interface ClockAndCalendarProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent?: (id: string) => void;
}

export const ClockAndCalendar: React.FC<ClockAndCalendarProps> = ({
  events,
  onAddEvent,
  onDeleteEvent,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<'exam' | 'lesson' | 'meeting' | 'note'>('exam');
  const [newEventTime, setNewEventTime] = useState('09:00');

  // Real-time tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Turkish Date and Time
  const timeString = currentTime.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dayName = currentTime.toLocaleDateString('tr-TR', { weekday: 'long' });
  const dateString = currentTime.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calendar calculations
  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();
  const monthName = currentViewDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  // First day of month and number of days
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Convert so Monday is 0
  const mondayOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate(new Date(year, month + 1, 1));
  };

  const todayStr = currentTime.toISOString().split('T')[0];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    onAddEvent({
      title: newEventTitle.trim(),
      date: selectedDateStr,
      time: newEventTime,
      type: newEventType,
    });
    setNewEventTitle('');
  };

  const selectedDateEvents = events.filter((ev) => ev.date === selectedDateStr);

  return (
    <div className="relative">
      {/* Trigger Pill / Widget in Header */}
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-xl px-3 py-1.5 shadow-xs hover:border-slate-300 transition-all">
        {/* Clock Section */}
        <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <ClockIcon className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 tabular-nums font-mono tracking-tight leading-none">
              {timeString}
            </div>
            <div className="text-[10px] text-slate-600 font-medium leading-tight">
              {dayName}
            </div>
          </div>
        </div>

        {/* Date & Calendar Trigger */}
        <button
          onClick={() => setShowCalendarModal(true)}
          className="flex items-center gap-2 text-left hover:text-amber-700 transition-colors cursor-pointer group"
          title="Takvimi ve Etkinlikleri Görüntüle"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 leading-none">
              {dateString}
            </div>
            <div className="text-[10px] text-slate-600">
              {events.length} Akademik Not
            </div>
          </div>
        </button>
      </div>

      {/* Calendar Interactive Modal / Popover */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white capitalize">{monthName}</h3>
                  <p className="text-xs text-slate-300">Öğretmen Takvimi & Sınav/Ders Notları</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Önceki Ay"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Sonraki Ay"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="p-1 ml-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Body */}
            <div className="p-5">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
                <span>Pt</span>
                <span>Sa</span>
                <span>Ça</span>
                <span>Pe</span>
                <span>Cu</span>
                <span className="text-amber-600 font-bold">Ct</span>
                <span className="text-amber-600 font-bold">Pz</span>
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: mondayOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-9 rounded-lg" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const isToday = dayStr === todayStr;
                  const isSelected = dayStr === selectedDateStr;
                  const hasEvents = events.some((ev) => ev.date === dayStr);

                  return (
                    <button
                      key={dayStr}
                      onClick={() => setSelectedDateStr(dayStr)}
                      className={`h-9 rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all relative ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold shadow-sm'
                          : isToday
                          ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {hasEvents && (
                        <span
                          className={`w-1 h-1 rounded-full mt-0.5 ${
                            isSelected ? 'bg-amber-300' : 'bg-indigo-600'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Events for selected date */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {new Date(selectedDateStr).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      weekday: 'short',
                    })}{' '}
                    Etkinlikleri
                  </span>
                  <span className="text-[11px] text-slate-600">
                    {selectedDateEvents.length} kayıt
                  </span>
                </div>

                <div className="max-h-28 overflow-y-auto space-y-1.5 mb-3">
                  {selectedDateEvents.length === 0 ? (
                    <p className="text-xs text-slate-600 italic py-1">
                      Bu tarih için henüz planlanan bir sınav veya not bulunmuyor.
                    </p>
                  ) : (
                    selectedDateEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              ev.type === 'exam'
                                ? 'bg-rose-500'
                                : ev.type === 'meeting'
                                ? 'bg-amber-500'
                                : 'bg-indigo-500'
                            }`}
                          />
                          <span className="font-semibold text-slate-800">{ev.title}</span>
                          {ev.time && <span className="text-slate-600 tabular-nums">({ev.time})</span>}
                        </div>
                        {onDeleteEvent && (
                          <button
                            onClick={() => onDeleteEvent(ev.id)}
                            className="text-slate-400 hover:text-rose-600 p-0.5"
                            title="Sil"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Quick Add Note Form */}
                <form onSubmit={handleCreateEvent} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="Sınav, ders veya zümre notu ekle..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as 'exam' | 'lesson' | 'meeting' | 'note')}
                    className="px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                  >
                    <option value="exam">Sınav</option>
                    <option value="meeting">Toplantı</option>
                    <option value="lesson">Ders/Ödev</option>
                    <option value="note">Not</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ekle
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
