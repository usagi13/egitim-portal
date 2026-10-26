import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Gamepad2,
  BookOpen,
  Calendar,
  FileCheck,
  Plus,
} from 'lucide-react';
import { ClockAndCalendar } from './ClockAndCalendar';
import { CalendarEvent, TeacherCategoryId } from '../types';

interface HeaderProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent?: (id: string) => void;
  onSelectCategory: (id: TeacherCategoryId | null) => void;
  onOpenAddLinkModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  events,
  onAddEvent,
  onDeleteEvent,
  onSelectCategory,
  onOpenAddLinkModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onSelectCategory(null)}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
              AkademiHub <span className="text-indigo-600 font-semibold text-xs sm:text-sm">· Öğretmen & Eğitsel Oyun</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean text) */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onSelectCategory(null)}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
          >
            Eğitsel Oyunlar
          </button>
          <button
            onClick={() => onSelectCategory('sinavlarim')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
          >
            Sınavlarım
          </button>
          <button
            onClick={() => onSelectCategory('kaynaklarim')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
          >
            Ders Kaynaklarım
          </button>
          <button
            onClick={() => onSelectCategory('planlarim')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
          >
            Ders Planlarım
          </button>
          <button
            onClick={() => onSelectCategory('dosyalarim')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
          >
            Öğretmen Dosyalarım
          </button>
        </nav>

        {/* Zone 3: Live Clock & Interactive Calendar Widget */}
        <div className="flex items-center gap-2 shrink-0">
          <ClockAndCalendar
            events={events}
            onAddEvent={onAddEvent}
            onDeleteEvent={onDeleteEvent}
          />
        </div>
      </div>
    </header>
  );
};
